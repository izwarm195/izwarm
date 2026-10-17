---
title: "NNDL 26-10-13 手写 Transformer"
slug: "machine-and-deep-learning/nndl/26-10-13-transformer"
description: "——手写一个 Encoder–Decoder Transformer 做英译中：三种注意力、学习率调度、两个参数组的权重衰减，以及复盘。"
publishDate: "2026-10-13"
createdAt: "2026-10-13T00:00:00Z"
updatedDate: "2026-10-17T14:09:43"
tags: ["NNDL","PyTorch","python","machine-learning"]
series: ["Machine & Deep Learning","NNDL"]
---

——手写一个 Encoder–Decoder Transformer 做英译中：三种注意力、学习率调度、两个参数组的权重衰减，以及复盘。

承接 [NNDL 26-09-26 循环神经网络练习](/notes/machine-and-deep-learning/nndl/26-09-26-rnn/)：上一次实现了LSTM的"循环 + 门控"机制，这一次，不用 `nn.Transformer` / `nn.MultiheadAttention`。任务是训一个字符级翻译模型：源长 64、目标长 32、4 层、4 头、128 维，20000 步。希望能弄清三种注意力的 Q/K/V 和掩码，把训练调度（预热 + 余弦退火 + 分组权重衰减）补齐，并总结思考。

![image.png](https://s3.su.bcebos.com/izwarm-obsidian/2026/10/b7537eb055355aeff31a787b96ff5c59.png)


# 一、公式总结

**记号**：批量 $B$；源长 $S$ = `SRC_LEN` = 64；目标长 $T$ = `TGT_LEN` = 32；嵌入维度 $C$ = `n_embd` = 128；头数 $h$ = `n_head` = 4；每头维度 $d=C/h=32$；层数 $n_{layer}=4$。词表：$V_{src}=83$（英文按字符，$79+4$）、$V_{tgt}=3661$（中文按字，$3657+4$）。

**① 缩放点积注意力**：

$$
\text{att}=\frac{QK^\top}{\sqrt d}\in\mathbb R^{B\times h\times L\times S},\qquad
Y=\operatorname{softmax}(\text{att})\,V
$$

**② 三种掩码**：

$$
\text{pad\_mask}=\big[\text{idx}_{src}=\text{PAD}\big]\in\{0,1\}^{B\times S}
$$

```python
att = att.masked_fill(pad_mask[:, None, None, :], float('-inf'))   # 自注意力 / 跨注意力
att = att.masked_fill(self.mask[:L, :L], float('-inf'))            # 因果
```


**③ FFN（Pre-LN 结构里的第二个子层）**：

$$
\text{FFN}(x)=W_2\,\text{GELU}(W_1x),\qquad C\to 3C\to C
$$

> 展开倍率取 3（原始论文是 4），`n_embd * 3`。

**④ 残差 + Pre-LN**：

$$
\begin{aligned}
\text{EncoderBlock:}\quad & x\leftarrow x+\text{Attn}(\text{LN}_1x),\quad x\leftarrow x+\text{FFN}(\text{LN}_2x)\\
\text{DecoderBlock:}\quad & x\leftarrow x+\text{SelfAttn}(\text{LN}_1x)\\
& x\leftarrow x+\text{CrossAttn}(\text{LN}_2x,\ \text{memory})\\
& x\leftarrow x+\text{FFN}(\text{LN}_3x)
\end{aligned}
$$

> **舍弃 dropout**，原因见 3.1。

**⑤ 嵌入 + 可学习位置嵌入**：

$$
x=\boldsymbol E_{tok}[\text{idx}]+\boldsymbol E_{pos}\big[\text{arange}(L)\big]
$$

> 位置索引必须写在输入张量的设备上：`torch.arange(S, device=idx_src.device)`，见 3.5。

**⑥ 输出头与权重共享**：

$$
\text{logits}=H\,\boldsymbol E_{tgt}[i]^\top,\qquad \texttt{head.weight} \leftarrow \texttt{tgt\_emb.weight}
$$

**⑦ 损失（PAD 位置不计入）**：

$$
\mathcal L=-\frac1N\sum_{n}\log\frac{\exp z_{n,y_n}}{\sum_{c}\exp z_{nc}},\qquad
y_n=-100 \Rightarrow \text{忽略}
$$

> `F.cross_entropy` 默认 `ignore_index=-100`。

**⑧ 学习率：预热 + 余弦退火**（$W$ = `WARMUP` = 800，$T$ = `MAX_STEPS` = 20000）：

$$
\eta(t)=
\begin{cases}
\eta_{\max}\cdot\dfrac{t}{W}, & t\le W\\[2mm]
\eta_{\min}+\dfrac{\eta_{\max}-\eta_{\min}}{2}\Big(1+\cos\dfrac{\pi(t-W)}{T-W}\Big), & t>W
\end{cases}
$$

> $\eta_{\max}=3\times10^{-3}$、$\eta_{\min}=1\times10^{-5}$。前 800 步线性升上去，之后余弦降到 $10^{-5}$。

**⑨ 分组权重衰减（AdamW）**：

$$
\theta\leftarrow\theta-\eta\Big(\hat m+\lambda\,\theta\Big),\qquad
\lambda=\begin{cases}0.1,& \dim(\theta)\ge 2\\ 0.0,&\dim(\theta)<2\end{cases}
$$

> "$\dim\ge2$"= 线性层权重、嵌入矩阵；"$\dim<2$"= 偏置、LayerNorm 的 weight/bias。后者不衰减是 GPT/BERT 的惯例，理由见 3.2。

**⑩ 梯度裁剪**：

$$
\|\boldsymbol g\|\leftarrow\min\Big(1,\frac{\kappa}{\|\boldsymbol g\|}\Big)\boldsymbol g,\qquad \kappa=1.0
$$

# 二、完整代码（一）

- 此部分为手写，用时约 3.5 h。
### 1. Env

```python
import torch
import torch.nn as nn
import torch.nn.functional as F
import matplotlib.pyplot as plt
import random
import math
from collections import Counter
from pathlib import Path
```

### 2. Data
- pairs
- chars & string to ids
- encode/decode
- make_batch

```python
# pairs
RAW = Path("./data/cmn.txt")
pairs = []
SRC_LEN, TGT_LEN = 64, 32
for line in RAW.read_text(encoding='utf-8').splitlines():
    parts = line.split('\t')
    en, ch = parts[0], parts[1]
    if len(en)<=SRC_LEN and len(ch) <= TGT_LEN - 2:
        pairs.append((en,ch))
random.Random(17).shuffle(pairs)
n_train, n_dev, n_test = 30000, 1000, 835
train_pairs = pairs[:n_train]
dev_pairs = pairs[n_train:n_dev + n_train]
test_pairs = pairs[n_dev + n_train:]

# chars & string to ids
PAD, UNK, BOS, EOS = 0, 1, 2, 3
src_chars = sorted({ch for en,_ in train_pairs for ch in en})
src_stoi = {ch: i + 4 for i, ch in enumerate(src_chars)}

tgt_chars = sorted({z for _,ch in train_pairs for z in ch})
tgt_stoi = {z:i+4 for i,z in enumerate(tgt_chars)}

src_size = len(src_chars) + 4
tgt_size = len(tgt_chars) + 4

# encode/decode
def encode_src(text):
    return [src_stoi.get(ch, UNK) for ch in text]
print(f"encode_src('what'):{encode_src('what?')}")

def encode_tgt(text):
    return [tgt_stoi.get(ch, UNK) for ch in text]
print(f"encode_src('有道理'):{encode_tgt('有道理')}")

def decode_tgt(ids):
    out = []
    for token in ids:
        if token == EOS:
            break
        if token < 4:
            continue
        else:
            out.append(tgt_chars[token - 4])
    return ''.join(out)
print(f"decode_src('[1544,3204,2049]'):{decode_tgt([1544,3204,2049])}")


# make_batch
device = torch.device('cuda')
def make_batch(pairs):
    src, tgt_in, tgt_out = [],[],[]
    batch_size = len(pairs)
    src = torch.full((batch_size, SRC_LEN), PAD)
    tgt_in = torch.full((batch_size, TGT_LEN),PAD)
    tgt_out = torch.full((batch_size, TGT_LEN),-100)
    for row, pair in enumerate(pairs):
        en, ch = pair
        src[row, :len(en)] = torch.tensor(encode_src(en))
        tgt_in[row, :len(ch)+1] = torch.tensor([BOS] + encode_tgt(ch))
        tgt_out[row, :len(ch)+1] = torch.tensor(encode_tgt(ch)+[EOS])
    return src.to(device), tgt_in.to(device), tgt_out.to(device)

print('\n'+f'make_batch(test_pairs):\n{make_batch(test_pairs)}')
```

```
encode_src('what'):[75, 60, 53, 72, 26]
encode_src('有道理'):[1544, 3204, 2049]
decode_src('[1544,3204,2049]'):有道理

make_batch(test_pairs):
(tensor([[35, 72,  4,  ...,  0,  0,  0],
        [46, 67, 65,  ...,  0,  0,  0],
        [38, 57, 66,  ...,  0,  0,  0],
        ...,
        [27,  4, 55,  ...,  0,  0,  0],
        [35,  4, 56,  ...,  0,  0,  0],
        [49, 67, 73,  ...,  0,  0,  0]], device='cuda:0'), tensor([[   2,  889,   85,  ...,    0,    0,    0],
        [   2, 1755,  842,  ...,    0,    0,    0],
        [   2,  259, 1243,  ...,    0,    0,    0],
        ...,
        [   2, 2832,  210,  ...,    0,    0,    0],
        [   2, 1243, 2066,  ...,    0,    0,    0],
        [   2,  218, 1195,  ...,    0,    0,    0]], device='cuda:0'), tensor([[ 889,   85, 1542,  ..., -100, -100, -100],
        [1755,  842, 1347,  ..., -100, -100, -100],
        [ 259, 1243,   77,  ..., -100, -100, -100],
        ...,
        [2832,  210,  715,  ..., -100, -100, -100],
        [1243, 2066, 2609,  ..., -100, -100, -100],
        [ 218, 1195, 2832,  ..., -100, -100, -100]], device='cuda:0'))
```

### 3. Attention
- Self
- Causal
- Cross

```python
# selfattention
class SelfAttention(nn.Module):
    def __init__(self, n_embd, n_head):
        super().__init__()
        self.n_embd = n_embd
        self.n_head = n_head
        self.head_dim = n_embd // n_head
        self.proj = nn.Linear(n_embd,n_embd,bias=False,dtype=torch.float32)
        self.qkv = nn.Linear(n_embd, n_embd *3, bias=False,dtype=torch.float32)

    def forward(self,X,pad_mask=None):
        B, L, D = X.shape
        q, k, v = self.qkv(X).split(D,dim=2)
        
        q = q.view(B,L,self.n_head, self.head_dim).transpose(1,2)
        k = k.view(B,L,self.n_head, self.head_dim).transpose(1,2)
        v = v.view(B,L,self.n_head, self.head_dim).transpose(1,2)
        att = (q @ k.transpose(2,3)/ math.sqrt(self.head_dim))
        if pad_mask is not None:
            att = att.masked_fill(pad_mask[:,None,None,:], float('-inf'))
        att = F.softmax(att, dim=-1)
        y = (att @ v).transpose(1,2).contiguous().view(B,L,D)
        return self.proj(y)

# CausalAttention
class CausalSelfAttention(nn.Module):
    def __init__(self, n_embd, n_head, block_size):
        super().__init__()
        self.n_embd = n_embd
        self.n_head = n_head
        self.head_dim = n_embd // n_head
        self.proj = nn.Linear(n_embd,n_embd,bias=False,dtype=torch.float32)
        self.qkv = nn.Linear(n_embd, n_embd *3, bias=False,dtype=torch.float32)
        mask = torch.triu(torch.ones(block_size,block_size),diagonal=1).bool()
        self.register_buffer('mask',mask)

    def forward(self,X,pad_mask=None):
        B, L, D = X.shape
        q, k, v = self.qkv(X).split(D,dim=2)
        
        q = q.view(B,L,self.n_head, self.head_dim).transpose(1,2)
        k = k.view(B,L,self.n_head, self.head_dim).transpose(1,2)
        v = v.view(B,L,self.n_head, self.head_dim).transpose(1,2)
        att = (q @ k.transpose(2,3)/ math.sqrt(self.head_dim))
        att = att.masked_fill(self.mask[:L,:L], float('-inf'))
        att = F.softmax(att, dim=-1)
        y = (att @ v).transpose(1,2).contiguous().view(B,L,D)
        return self.proj(y)
  
  # CrossAttention
class CrossAttention(nn.Module):
    def __init__(self, n_embd, n_head):
        super().__init__()
        self.n_embd = n_embd
        self.n_head = n_head
        self.head_dim = n_embd // n_head
        self.proj = nn.Linear(n_embd,n_embd,bias=False,dtype=torch.float32)
        self.kv = nn.Linear(n_embd, n_embd *2, bias=False,dtype=torch.float32)
        self.q = nn.Linear(n_embd, n_embd, bias=False, dtype = torch.float32)

    def forward(self,X,memory,pad_mask=None):
        B, L, D = X.shape
        S = memory.shape[1]
        q = self.q(X).view(B,L,self.n_head, self.head_dim).transpose(1,2)
        k, v = self.kv(memory).split(D,dim=2)
        
        v = v.view(B,S,self.n_head, self.head_dim).transpose(1,2)
        k = k.view(B,S,self.n_head, self.head_dim).transpose(1,2)
        att = (q @ k.transpose(2,3)/ math.sqrt(self.head_dim))
        if pad_mask is not None:
            att = att.masked_fill(pad_mask[:,None,None,:], float('-inf'))
        att = F.softmax(att, dim=-1)
        y = (att @ v).transpose(1,2).contiguous().view(B,L,D)
        return self.proj(y)
```

### 4. Model
- FFN
- EncoderBlock
- DecodeBlock
- Tramsformer

```python
# FFN
class FeedForward(nn.Module):
    def __init__(self, input_size, hidden_size):
        super().__init__()
        self.linear1 = nn.Linear(input_size, hidden_size)
        self.act = nn.GELU()
        self.linear2 = nn.Linear(hidden_size, input_size)
    def forward(self,X):
        return self.linear2(self.act(self.linear1(X)))

# EncoderBlock
class EncoderBlock(nn.Module):
    def __init__(self, n_embd, n_head):
        super().__init__()
        self.ln1 = nn.LayerNorm(n_embd)
        self.attn = SelfAttention(n_embd, n_head)
        self.ln2 = nn.LayerNorm(n_embd)
        self.ffn = FeedForward(n_embd, n_embd * 3)

    def forward(self,X,pad_mask=None):
        X = X + self.attn(self.ln1(X),pad_mask)
        return X + self.ffn(self.ln2(X))

# DecoderBlock
class DecoderBlock(nn.Module):
    def __init__(self, n_embd, n_head, block_size):
        super().__init__()
        self.ln1 = nn.LayerNorm(n_embd)
        self.attn = CausalSelfAttention(n_embd, n_head,block_size)
        self.ln2 = nn.LayerNorm(n_embd)
        self.cattn = CrossAttention(n_embd,n_head)
        self.ln3 = nn.LayerNorm(n_embd)
        self.ffn = FeedForward(n_embd, n_embd * 3)
    def forward(self,x,memory, pad_mask=None):
        x = x + self.attn(self.ln1(x))
        x = x + self.cattn(self.ln2(x),memory, pad_mask)
        return x + self.ffn(self.ln3(x))
```

```python

# Transformer
class Transformer(nn.Module):
    def __init__(self, src_vocab, tgt_vocab, src_block_size, tgt_block_size, n_layer=4, n_head = 4, n_embd = 128):
        super().__init__()
        self.src_block_size = src_block_size
        self.tgt_block_size = tgt_block_size
        self.src_emb = nn.Embedding(src_vocab, n_embd, padding_idx=PAD)
        self.tgt_emb = nn.Embedding(tgt_vocab, n_embd, padding_idx=PAD)
        self.src_pos = nn.Embedding(src_block_size, n_embd)
        self.tgt_pos = nn.Embedding(tgt_block_size, n_embd)
        
        self.enc_blocks = nn.ModuleList([EncoderBlock(n_embd,n_head) for _ in range(n_layer)])
        self.dec_blocks = nn.ModuleList([DecoderBlock(n_embd,n_head,tgt_block_size) for _ in range(n_layer)])
        self.ln_enc = nn.LayerNorm(n_embd)
        self.ln_dec = nn.LayerNorm(n_embd)
        self.head = nn.Linear(n_embd, tgt_vocab, bias=False)
        self.head.weight = self.tgt_emb.weight

    def encode_src(self,idx_src):
        _, S = idx_src.shape
        pad_mask = idx_src == PAD
        x = self.src_emb(idx_src) + self.src_pos(torch.arange(S, device=idx_src.device))
        for block in self.enc_blocks:
            x = block(x,pad_mask)
        return self.ln_enc(x), pad_mask
    def decode_tgt(self,idx_tgt,memory,pad_mask=None):
        _, T = idx_tgt.shape
        x = self.tgt_emb(idx_tgt) + self.tgt_pos(torch.arange(T, device=idx_tgt.device))
        for block in self.dec_blocks:
            x = block(x, memory, pad_mask)
        return self.ln_dec(x)

    def forward(self, idx_src, idx_tgt, targets=None):
        memory, pad_mask = self.encode_src(idx_src)
        logits = self.head(self.decode_tgt(idx_tgt, memory, pad_mask))
        loss = None
        if targets is not None:
            loss = F.cross_entropy(logits.reshape(-1, logits.size(-1)), targets.reshape(-1))
        return logits, loss

```

### 5. Train
- Learn rate
  - Fixed batch evaluation
  - Train step
  - Train

```python
BATCH = 64
MAX_STEPS = 20000
WARMUP = 800
LR_MAX, LR_MIN = 3e-3, 1e-5

torch.manual_seed(0)
config = dict(src_vocab=src_size, tgt_vocab = tgt_size, src_block_size = SRC_LEN, tgt_block_size=TGT_LEN, n_layer = 4, n_embd=128)
model = Transformer(**config).to(device)
groups = [
    dict(params=[p for p in model.parameters() if p.ndim >= 2], weight_decay=0.1),
    dict(params=[p for p in model.parameters() if p.ndim < 2], weight_decay=0.0),
]
optimizer = torch.optim.AdamW(groups, lr=LR_MAX, betas=(0.9,0.95))

def get_lr(step):
    if step <= WARMUP:
        return LR_MAX * step / WARMUP
    progress = min(1.,(step-WARMUP)/(MAX_STEPS-WARMUP))
    return LR_MIN + 0.5 * (LR_MAX - LR_MIN) * (1 + math.cos(math.pi * progress))

def fixed_batches(pairs, batch_size, iters, seed):
    order = torch.randperm(len(pairs),generator=torch.Generator().manual_seed(seed))
    picked = order[:batch_size * iters].tolist()
    return [[pairs[i] for i in picked[s:s+batch_size]] for s in range(0, len(picked),batch_size)]

@torch.no_grad()
def estimate_loss(batches):
    was_training = model.training
    model.eval()
    losses=[]
    for batch in batches:
        x_src, x_tgt, y = make_batch(batch)
        losses.append(model(x_src, x_tgt,y)[1].item())
    model.train(was_training)
    return sum(losses)/len(losses)

train_eval_batches = fixed_batches(train_pairs, BATCH, 10,200)
dev_eval_batches = fixed_batches(dev_pairs, BATCH, 10,117)

def train_step(step, batch):
    model.train()
    for group in optimizer.param_groups:
        group['lr'] = get_lr(step)
    x_src, x_tgt, y = make_batch(batch)
    _, loss = model(x_src, x_tgt, y)
    optimizer.zero_grad()
    loss.backward()
    torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
    optimizer.step()
    return loss.item()

hist = {'step':[],'train':[],'dev':[]}
step = 0
while step< MAX_STEPS:
    order = torch.randperm(len(train_pairs)).tolist()
    for s in range(0, len(order) - BATCH + 1, BATCH):
        step += 1
        if step > MAX_STEPS:
            break
        train_step(step,[train_pairs[i] for i in order[s:s+BATCH]])
        if step % 200 ** 0 or step ** MAX_STEPS:
            train_loss = estimate_loss(train_eval_batches)
            dev_loss = estimate_loss(dev_eval_batches)
            hist['step'].append(step)
            hist['train'].append(train_loss)
            hist['dev'].append(dev_loss)
            print(f'step {step:5d}  train={train_loss:.4f}  dev={dev_loss:.4f}  '
                  f'lr={get_lr(step):.6f} ') 
```
### 6. Results

```
step  1000  train=3.5772  dev=3.7505  lr=0.002999 
step  2000  train=2.5579  dev=2.8874  lr=0.002971 
step  3000  train=1.9658  dev=2.5094  lr=0.002904 
...
step 18000  train=0.0967  dev=2.3265  lr=0.000089 
step 19000  train=0.0857  dev=2.3391  lr=0.000030 
step 20000  train=0.0829  dev=2.3492  lr=0.000010 
```

```python
fig, ax = plt.subplots(figsize=(5.2, 2.8))
ax.plot(hist['step'], hist['train'], label='train')
ax.plot(hist['step'], hist['dev'], label='dev')
ax.legend(); ax.grid(alpha=.2); fig.tight_layout(); plt.show()
```
![image.png](https://s3.su.bcebos.com/izwarm-obsidian/2026/10/e952d862b73b9d923b816eccb3af5fbb.png)

```
译得好的 10 句
[1.00] You're the smartest person that I know.
     参考: 你是我所知道的最聪明的人。
     预测: 你是我所知道的最聪明的人。
[1.00] You might be right.
     参考: 你可能是对的。
     预测: 你可能是对的。
[1.00] Who's to blame?
     参考: 是誰的錯呢？
     预测: 是誰的錯呢？
[1.00] Was Tom asleep?
     参考: 汤姆睡着了吗？
     预测: 汤姆睡着了吗？
[1.00] Tom likes to sit on the floor.
     参考: 汤姆喜欢坐在地上。
     预测: 汤姆喜欢坐在地上。
[1.00] Tom couldn't see anybody.
     参考: 汤姆看不到任何人。
     预测: 汤姆看不到任何人。
[1.00] This medicine has no side effects.
     参考: 这药没有副作用。
     预测: 这药没有副作用。
[1.00] No one voted against it.
     参考: 没有人投反对票。
     预测: 没有人投反对票。
[1.00] My friends all call me Tom.
     参考: 我的朋友都叫我湯姆。
     预测: 我的朋友都叫我湯姆。
[1.00] May I turn off the TV?
     参考: 我能关电视吗？
     预测: 我能关电视吗？

无厘头的 10 句
[0.22] How rude of you!
     参考: 你真粗魯！
     预测: 你干了!
[0.21] I didn't ask Tom for help.
     参考: 我没有找Tom帮忙。
     预测: 我沒帶湯姆到發生。
[0.20] The lubrication system was poorly designed.
     参考: 润滑系统设计得不好。
     预测: 還世界将系任何許多。
[0.17] The chances are he's already heard the news.
     参考: 他有可能已經得知這消息。
     预测: 改變他是新聞的庭法了。
[0.17] He is different from what he used to be.
     参考: 他和從前不一樣。
     预测: 他對自己的那天生活方收到的旅星。
[0.17] Are you nuts?
     参考: 你不要命啦！
     预测: 你没有天气？
[0.15] It came to nothing.
     参考: 这没有结果。
     预测: 什麼都沒來了。
[0.14] We should ban advertising aimed towards children.
     参考: 我们应该禁止针对儿童的广告。
     预测: 我們應該更加努力一點小孩子。
[0.10] What's the average height of the players?
     参考: 选手们的平均身高是多少？
     预测: 大家在玩什麼啊？
[0.07] No less than three hundred dollars was needed for the work.
     参考: 这个工作需要不低于300美金。
     预测: 沒有那麼多的因為字母認識。
```


# 三、思考

## 3.1 不写 dropout

原始版（`Translation.ipynb`）四处写了 `DROPOUT = 0.1`，手写版全砍了。

理由是数据规模。这次 3 万句对，上一次循环网络是合成任务、训练集 500 条。数据量上去后往往会欠拟合，很难过拟合，dropout 只会为模型带来负担，比如置零引入噪声拖慢收敛，丢弃神经元降低有效容量。GPT 一类的大模型把 dropout 设成 0，也有相似的原因。

数据也支持这个判断。dev 从第 7000 步起走平，末段 2.3265 → 2.3492 只升 1%，train 却降到 0.083。

## 3.2 `param_group` 的用法

```python
groups = [
    dict(params=[p for p in model.parameters() if p.ndim >= 2], weight_decay=0.1),
    dict(params=[p for p in model.parameters() if p.ndim < 2],  weight_decay=0.0),
]
optimizer = torch.optim.AdamW(groups, lr=LR_MAX, betas=(0.9, 0.95))
```

二维及以上（线性层权重、嵌入矩阵）衰减 0.1，一维（偏置、LayerNorm 的 `weight` / `bias`）不衰减。偏置和 LayerNorm 参数不是表达能力的主要来源，衰减只会损害性能，这是 GPT/BERT 的惯例。
- `AdamW` 与 `Adam` 的区别就在于，前者把权重衰减解耦出去，不混进梯度。

- **不能写 `optimizer.lr = ...`。** `step()` 读的是每个参数组自己的 `'lr'`：

	```python
	for group in self.param_groups:
	    lr = group['lr']
	```

  `optimizer.defaults['lr']` 只用于初始化参数组，改了不影响已有的组，所以下面两种写法都不生效：

	```python
	optimizer.lr = 1e-4              # 只是挂了个普通属性
	optimizer.defaults['lr'] = 1e-4  # 改的是默认值，已有的组不受影响
	```

## 3.3 `transpose` 与 `contiguous`

`view` 只改形状，`transpose` 只换维度，两者都不动内存。所以 `transpose` 之后张量通常不连续，而 `view` 要求连续，需先调 `contiguous()`。

例如 `torch.arange(6).view(2, 3)`，内存 `[0,1,2,3,4,5]`，步长 `(3,1)`。`transpose(0,1)` 后形状 `(3,2)`，内存不变，步长 `(1,3)`，此时 `view(6)` 报错：

```text
RuntimeError: view size is not compatible with input tensor's size and stride
```

`contiguous()` 按 `(3,2)` 重排内存为 `[0,3,1,4,2,5]`，步长恢复 `(2,1)`，`view(6)` 即可执行。

注意力中：

```python
y = (att @ v).transpose(1, 2).contiguous().view(B, L, D)
```

合并 `h`、`d` 时 `view` 要求内存连续，所以先 `contiguous()` 再 `view`。

```text
(B, L, C)  --view-->  (B, L, h, d)  --transpose(1,2)-->  (B, h, L, d)
(B, h, L, d)  --transpose(1,2)-->  (B, L, h, d)  --contiguous-->  --view-->  (B, L, C)
```

换成 `reshape` 等价，它会按需自动 `contiguous()`。
但是显式写出能点明这里有一次内存重排，也避免 `reshape` 时而返回视图、时而返回副本的不确定性。

## 3.4 `block_size` $\ge$ `T`

`block_size` 是最大序列窗口，`T` 是 `att` 的实际长度，$T \le \texttt{block\_size}$。这里取 `TGT_LEN = 32`，只有解码器因果自注意力用到。形状靠切片对齐：

```python
mask = torch.triu(torch.ones(block_size, block_size), diagonal=1).bool()
self.register_buffer('mask', mask)          # 注册时 (32, 32)
...
att = att.masked_fill(self.mask[:L, :L], float('-inf'))   # 前向时切成 (L, L)
```

注册时按上限建，使用时按实际长度切。训练时右填充到 32，等于上限；推理逐步生成，`L` 从 1 增到 32：

| 推理步 | `att` 形状 | `mask[:L,:L]` |
|---|---|---|
| 第 1 步 | `(B, h, 1, 1)` | `(1, 1)` |
| 第 5 步 | `(B, h, 5, 5)` | `(5, 5)` |
| 第 32 步 | `(B, h, 32, 32)` | `(32, 32)` |

buffer 会随 `.to(device)` 搬到 GPU，切片是零拷贝视图。每次现算 `torch.triu(torch.ones(L, L))` 的问题是：反复新建张量；新张量在 CPU 而 `att` 在 CUDA，会报设备不一致；上限也被藏起来。

预注册让 `T > block_size` 成为明确越界。但手写版没加断言，超限时切片偏小，掩码会静默失效。改 `TGT_LEN` 时须同步改 `block_size`。

## 3.5 `device='cuda'` 的实现逻辑

`SelfAttention` 不写 `device` 是对的：模块只定义参数和计算，不管放在哪。创建时在 CPU，搬运在外部完成：

```python
model = Transformer(**config).to(device)
```

`.to(device)` 递归搬运两类东西：`nn.Parameter`（权重、LayerNorm、嵌入）和 `register_buffer` 的张量（因果掩码）。**输入不会被搬**，所以 `make_batch` 末尾要 `return src.to(device), ...`。

`SelfAttention` 不新建张量，无需处理。`CausalSelfAttention` 和 `encode_src` 会新建，需自己处理：

```python
self.register_buffer('mask', mask)              # ① 靠 buffer 随模型迁移
...
self.src_pos(torch.arange(S, device=idx_src.device))   # ② 取输入自身的设备
```

②用输入的设备而非外部 `device` 变量，否则模型换到 CPU 就失效。漏掉会报 `Expected all tensors to be on the same device`。

模块内写死设备会让无 GPU 的机器崩溃，也让 `.to()` 失去意义。手写版的 `torch.device('cuda')` 就是写死的，这是练习环境固定带来的取舍，通用写法：

```python
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
```

## 3.6 `logits.reshape(-1, logits.size(-1))` 能否写成 `logits.view(B*T, V)`

可以，但 `view` 要求张量连续。连续时两者等价，不连续时 `view` 报错，`reshape` 自动兜底。

```python
logits.reshape(-1, logits.size(-1))
```

`-1` 自动推断，`logits.size(-1)` 是词表大小 $V$，结果 `(B*T, V)`，与展平后的 `targets`（`(B*T,)`）对齐算交叉熵。

写成 `view` 需要 `B`、`T`、`V` 已取好且 `logits` 连续。这里都满足（`nn.Linear` 输出连续，`targets` 由 `torch.full` 建出也连续）：

```python
B, T = idx_tgt.shape
V = logits.size(-1)
loss = F.cross_entropy(logits.view(B*T, V), targets.view(B*T))
```

若上游有 `transpose`、`permute`，`logits` 不再连续，`view` 会报同样的错，须先 `contiguous()`。

推荐 `reshape`：不要求连续，也不依赖 `B`、`T` 是否在作用域内。确定连续又想写明 `B*T` 时，用 `view` 也行，只是多一个约束。

# 四、与上一次练习的对照

|         | 上次（手写 SRN / LSTM）                      | 这次（手写 Transformer）                                            |
| ------- | -------------------------------------- | ------------------------------------------------------------- |
| 核心算子    | 循环单元：隐状态跨时间步传递，**参数在所有时间步共享**          | 注意力：所有位置**并行**交互，靠 Q/K/V 的相似度决定"看哪里"                          |
| 时间维的处理  | `for step in range(seq_len)` 逐步推进      | 一次矩阵乘算完全部位置；**因果性靠掩码给，不靠循环**                                  |
| 输入约定    | 三维 `[B, L, I]`，token 是 `[B, L]` 的 long | 同样三维 `[B, L, C]`，但内部要多一次 `view + transpose` 拆头                |
| 手工实现了什么 | 循环单元前向（逐时间步 matmul + 门控）               | 三种注意力的 Q/K/V 拆分、掩码、多头合并                                       |
| 位置信息    | 天然有序（先后进入循环），不需要额外编码                   | 并行无序，**必须显式加位置嵌入**                                            |
| 主要失败模式  | **梯度消失**（SRN 在 length=50 退化成随机猜）       | 有很多哦                                                          |
| 正则化     | 没上                                     | 原始版上 `dropout=0.1`，手写版拿掉：数据量上去后它只剩拖慢收敛的代价，见 3.1               |
| 新增概念    | 门控机制 / 长程依赖 / 加法捷径 vs 连乘衰减             | 缩放点积注意力 / 多头 / 三种掩码 / Pre-LN / 预热+余弦退火 / 分组权重衰减 / Beam search |

# 五、漫长的、曲折的、有趣的

 上面的翻译任务用的是 ‘Tatoeba 口语例句’ 这个 30000 句对的小语料，现在我将其拓展为 WMT19 中英平行语料，训练集 120 万句对。模型的翻译效果应当大幅提升，但是在同样的 20000 步下，新模型翻译“I love you”为“我们很难。”

 在改进过程中，进行了若干次调整，出现了一些有趣的现象，暴露了不少问题，收获了一些新的东西。下面复盘一下具体情况：

 ## 一、复盘
### 1、加 Warmup，调学习率
前模型训练结束前 dev 一直在降，显然是欠拟合，故加 Warmup 步数以及学习率。在这途中，有一次 Max_lr 过高导致 dev 在 1000 步左右反升。
最终 Model 4 使用 Warmup=5000，效果有所上升，但是 dev 依旧没有趋缓，显然是步数不够。
> 此时模型依次为 Model 1、2、3、4
### 2、续训
在原来模型的基础上，继续训练 10000 步，值得一提的是这里换掉了 AdamW 的全部状态、并把学习率从 0 重新预热，从而在开始续训的时候，稍微跳出 dev 以寻找更好的梯度下降路径。
续训结果：dev 先从 1.8349 升到 2.9557，再一路降回 1.7552，总计 30000 步。
> 此时模型为 Model 5
### 3、★ 修改 loss
新的模型在翻译效果上，明显倾向于：短句翻的一坨，长句却能逼近原意。猜测是由于 loss 函数计算存在缺陷：`F.cross_entropy` 把整个 batch 里所有非 PAD 的 token 拉平求平均，长句 token 多、在梯度里占的权重就大，短句被稀释，需要归一化。
改成先对每条样本内部的 token 求平均、再对样本求平均，重训 30000 步。同一口径下 dev 从 1.9322 降到 1.5813，译文里短句的塌陷明显收窄。
> 此时模型记为 Model 6
### 4、★ Beam Search
继续优化，添加 Beam Search 的输出选择算法。所有模型（除 Model X）加 Beam Search 前后的翻译结果见下方“初代模型结果”。

Beam Search 一定程度上，让部分模型在部分句子上选择了更好的翻译结果，但是在下面的训练结果中可看出，除 Model X，总计★ 9、▼ 8、※ 19，这说明 Beam Search 的表现几乎是随机的，这源于模型本身对翻译结果的评估存在缺陷。根据深入调研，该缺陷可总结为：
- 模型过于自信
- Loss 没有物尽其用
- CrossEntropyLoss 本身评估不精确

### 5、词表截断、BPE、温度校准 T
针对以上三个缺陷采取三个措施：
- 词表截断
  词表截断直接砍掉 softmax 的容量。中文全量 9181 个字只保留最高频的 3000 个，覆盖 99.53% 的字符。这避免了砍掉的长尾学不会却一直占用概率质量的问题。英文侧 484 个字符留 256 个，覆盖 99.999%。
- BPE Tokenize
  BPE 在截断后的字符表上学 1500 次合并。源侧词表 208+1500 得 1712，目标侧 2987+1500 得 4491，是字符级 9185 的 48.9%。目标侧平均 2.0 字符/子词，`TGT_LEN=48` 下零截断。
- Softmax 加 Temperature
  Softmax 加 Temperature 是为了压一压模型的过度自信。让 Deepseek 在 dev 上建候选池，看评分排序与 chrF 排序的 Spearman ρ 随 T 的变化表现：两次拟合出的最优 T 与 T=1.0 的 ρ 差都在 0.002 以内，命中率反而 T=1.0 更高，所以最终把 T 设回 1.0。

  三个措施皆有所改良，但是 Temperature 的效果不佳。

### 6、最终训练
将 BPE 训练到极致：从头训 43000 步，再 warm restart 续训 57000 步，共 100000 步，dev 从 2.2800 降到 2.0507。

为了跨 tokenization 可比，让 Deepseek 将总 nats 除以目标字符数，得到Model X 为 1.5651，字符级最好的 Model 6 是 1.6426，好 4.71%，与 token 吞吐对齐的 Model 5 的 1.8488 比好 15.3%。
> 最终模型记为 Model X，请见“最终模型结果”。

## 二、最终结果

### A. 初代模型结果
#### a. 初代模型总览

|         | SRC_LEN | TGT_LEN | lr_max | warmup | dev    | num_epochs |
| ------- | ------- | ------- | ------ | ------ | ------ | ---------- |
| Model 1 | 64      | 32      | 3e-3   | 100    | 1.9085 | 1.07       |
| Model 2 | 96      | 48      | 1e-3   | 1000 * | 2.2919 | 1.07       |
| Model 3 | 96      | 48      | 3e-3   | 1000 * | 1.8731 | 1.07       |
| Model 4 | 96      | 48      | 5e-3   | 5000   | 1.8349 | 1.07       |
| Model 5 | 96      | 48      | 5e-3   | 1000   | 1.7552 | 1.60       |
| Model 6 | 96      | 48      | 3e-3   | 3000   | 1.5813 | 3.20       |

#### b. **翻译对照**

> - 束搜索 `beam=5`、长度惩罚 `alpha=0.7`
> - 句子按长度从短到长
> - `★` beam 更准 ｜ `▼` beam 更差 ｜ `※` 没变
> ★ 9、▼ 8、※ 19。
#### 1. `The talks have ended.`　（21 字符）

|  | Greedy | Beam Search |
| --- | --- | --- |
| Model 1 | 这些税务已经开始。 | ※已经开始了。 |
| Model 2 | 这些工作已经开始。 | ▼事实上。 |
| Model 3 | 这些工作已经取得了。 | ★这项工作已经开始。 |
| Model 4 | 该项工作已经取得了进展。 | ▼这项工作已经确定。 |
| Model 5 | 这些工作已经确定。 | ※目前已经确定。 |
| Model 6 | 这些工作已经生效。 | ※这些工作已经生效。 |

#### 2. `Officials closed the border.`　（28 字符）

|  | Greedy | Beam Search |
| --- | --- | --- |
| Model 1 | 官方的官员也有。 | ※其中的官方被告人。 |
| Model 2 | 应该提供的证据。 | ※经费分摊比额。 |
| Model 3 | 官方解决方案。 | ※正式会议结束。 |
| Model 4 | 官方会议结束了这一边界。 | ▼官方会议结束了边界。 |
| Model 5 | 官员一致。 | ★官员在边界。 |
| Model 6 | 官员组成边界。 | ★官员结束边界。 |

#### 3. `The report is very important.`　（29 字符）

|  | Greedy | Beam Search |
| --- | --- | --- |
| Model 1 | 报告是重要的。 | ※报告是重要的。 |
| Model 2 | 报告是一个重要的。 | ※报告是一个重要的。 |
| Model 3 | 报告是重要的。 | ※报告是重要的。 |
| Model 4 | 报告是重要的。 | ※报告是重要的。 |
| Model 5 | 报告是重要的。 | ★该报告非常重要。 |
| Model 6 | 报告是非常重要的。 | ※报告非常重要。 |

#### 4. `The station was closed after the accident.`　（42 字符）

|  | Greedy | Beam Search |
| --- | --- | --- |
| Model 1 | 该国的发言已经取得了。 | ※该发言的发言。 |
| Model 2 | 这些国家是一个指控。 | ※这些统计的工作人员已经采取了行动。 |
| Model 3 | 该站在成立的事件后。 | ▼这项工作已经完成。 |
| Model 4 | 该国的国家都会选择。 | ※此外，任何情况已经完成。 |
| Model 5 | 在此后，该地点已结束。 | ★在事故之后，该地站已结束。 |
| Model 6 | 事故之后，该站在这一点。 | ※事故之后，该站在这一点。 |

#### 5. `The company reported a large increase in profits last year.`　（59 字符）

|  | Greedy | Beam Search |
| --- | --- | --- |
| Model 1 | 公司的法律是一年的最大的法律。 | ★该公司的报告已经增加。 |
| Model 2 | 任何报告是一年的一个重要的一个重要点。 | ▼本报告所述期间的任何方面。 |
| Model 3 | 该公司报告了一个最后的利益。 | ★该公司报告了一个利益的利益增加。 |
| Model 4 | 公司报告了一年的工作日益增加。 | ※该公司报告了过去年的工作日益增加。 |
| Model 5 | 公司报告了一个大量增加过去年。 | ※公司报告了一个大量增加过去年。 |
| Model 6 | 公司报告了最近几年的一个增加。 | ★公司报告了最大的利润增加。 |

#### 6. `The government announced a new policy to improve public health services in rural areas.`　（87 字符）

|  | Greedy | Beam Search |
| --- | --- | --- |
| Model 1 | 政府间社会保健的新的政策 | ※政府提出新的政策方面的新政策 |
| Model 2 | 政府在公共部门的新的政策中，一个新的政策已经成为非常重要。 | ※政府在公共部门的新的政策方面发挥了一些政策。 |
| Model 3 | 政府的政府在农村地区的公共卫生保健服务方面有一个新的政策。 | ▼政府宣布新的公共保健服务方面的政策。 |
| Model 4 | 政府继续提供一个新的政策，以改善农村地区的保健服务。 | ★政府宣布一个新的政策，改善农村地区的公共卫生服务。 |
| Model 5 | 政府宣布了一个新的政策，改善公共卫生服务。 | ▼政府宣布了一个新的政策，改善公共保健服务。 |
| Model 6 | 政府宣布了一个新的政策改善农村地区的公共卫生服务。 | ▼政府宣布新的政策改善农村地区的公共卫生服务。 |
### B. 最终模型结果

#### a. 最终模型参数

|         | SRC_LEN | TGT_LEN | 词表 src/tgt  | 参数量   | lr_max      | warmup      | num_epochs | dev    |
| ------- | ------- | ------- | ----------- | ----- | ----------- | ----------- | ---------- | ------ |
| Model X | 64      | 48      | 1712 / 4491 | 2.39M | 5e-3 → 3e-3 | 5000 → 2000 | 100000     | 2.0507 |

两段训练：从头训 43000 步用 lr_max=5e-3、warmup=5000；warm restart 续训 57000 步用 lr_max=3e-3、warmup=2000。
tokenization 是字符表截断加 1500 次 BPE 合并，源侧 208+1500 得 1712，目标侧 2987+1500 得 4491。

跨 tokenization 的公平口径要换成每字符 nats，即总交叉熵除以目标字符数。同一批 640 句 dev 上：

|         | 类型 | 步数   | dev    | nats/字符 | 字符困惑度 |
| ------- | ---- | ------ | ------ | --------- | ---------- |
| Model 1 | 字符 | 20000  | 1.9085 | 1.9936    | 7.342      |
| Model 2 | 字符 | 20000  | 2.2919 | 2.3440    | 10.423     |
| Model 3 | 字符 | 20000  | 1.8731 | 1.9691    | 7.164      |
| Model 4 | 字符 | 20000  | 1.8349 | 1.9272    | 6.870      |
| Model 5 | 字符 | 30000  | 1.7552 | 1.8488    | 6.352      |
| Model 6 | 字符 | 60000  | 1.5813 | 1.6426    | 5.169      |
| Model X | BPE  | 100000 | 2.0507 | 1.5651    | 4.783      |

`dev` 一列是各模型自己训练时的口径，Model X 那格是子词级，与前六行不可比。`nats/字符` 才是可比的：Model X 比字符级最好的 Model 6 好 4.71%，比 token 吞吐对齐的 Model 5 好 15.3%。

同一批 200 句固定测试集上，字符级 BLEU-4 与 chrF：

|         | 类型 | 贪心 BLEU | beam BLEU | ΔBLEU | 95% CI        | 贪心 chrF | beam chrF |
| ------- | ---- | --------- | --------- | ----- | ------------- | --------- | --------- |
| Model 5 | 字符 | 36.98     | 38.33     | +1.35 | [-0.89, +3.59] | 0.3148    | 0.3220    |
| Model 6 | 字符 | 40.03     | 40.41     | +0.37 | [-0.90, +1.70] | 0.3674    | 0.3694    |
| Model X | BPE  | 41.48     | 43.10     | +1.62 | [+0.16, +3.12] | 0.3420    | 0.3552    |

Model X 是整轮实验里唯一一个 beam 相对贪心的 BLEU 增益 95% 置信区间不含 0 的模型。chrF 一列却给出相反的排序，Model 6 反而更高，不清楚为什么。
但总之，Model X 翻译结果的整体观感远好于之前的模型，具体见下。

#### b. 翻译对照

> - 束搜索 `beam=5`、长度惩罚 `alpha=0.7`、温度 `T=1.0`
> - 句子按长度从短到长
> - `★` beam 更准 ｜ `▼` beam 更差 ｜ `※` 没变
> ★ 11、▼ 3、※ 10。

| #   | EN                                                                                      | Greedy                    | Beam Search             |
| --- | --------------------------------------------------------------------------------------- | ------------------------- | ----------------------- |
| 1   | The talks have ended.                                                                   | 会谈已经结束。                   | ※会谈已经结束。                |
| 2   | The vote was delayed.                                                                   | 投票被延迟。                    | ※投票被延迟。                 |
| 3   | The bank reported a loss.                                                               | 银行报告了损失。                  | ★该银行报告了损失。              |
| 4   | Officials closed the border.                                                            | 官员关闭了边界。                  | ※官员关闭了边界。               |
| 5   | Prices rose sharply in March.                                                           | 在3月份，价格分摊。                | ★在3月份上升了价格。             |
| 6   | The minister signed the deal.                                                           | 部长签署了该协议。                 | ※部长签署了该协议。              |
| 7   | The report is very important.                                                           | 报告非常重要。                   | ★该报告非常重要。               |
| 8   | The committee needs more time.                                                          | 委员会需要更多时间。                | ※委员会需要更多时间。             |
| 9   | The talks resumed on Wednesday.                                                         | 会谈会日于Wednesstay。          | ★讨论会于星期三恢复。             |
| 10  | The agency issued a formal warning.                                                     | 该机构发出正式警告。                | ★该机构发表了正式的警告。           |
| 11  | The delegation thanked the government.                                                  | 该代表团感谢政府。                 | ※该代表团感谢政府。              |
| 12  | Negotiators failed to reach an agreement.                                               | 谈判人未能达成协议。                | ※谈判人未能达成协议。             |
| 13  | The station was closed after the accident.                                              | 该站在事故后关闭。                 | ※该站在事故后关闭。              |
| 14  | The economy grew by three percent last quarter.                                         | 经济学会的三%以上季度取代。            | ▼经济从三%的最后四季度下降。         |
| 15  | The ministry confirmed the figures on Thursday.                                         | 该部确认了星期四的数字。              | ※该部确认了星期四的数字。           |
| 16  | The meeting will start at nine tomorrow morning.                                        | 会议将于九次提名波尔罗恩。             | ▼会议将开始在九次提名波动。          |
| 17  | The council approved the budget after a long debate.                                    | 该委员会在长期辩论后核准了预算。          | ★该委员会经过长的辩论后核准了预算。      |
| 18  | The report calls for urgent action to cut emissions.                                    | 报告要求紧急行动来减少排放。            | ※报告要求紧急行动来减少排放。         |
| 19  | The company reported a large increase in profits last year.                             | 该公司在去年报告了大量利润。            | ★该公司在去年报告了利润增加。         |
| 20  | The court ruled that the new law violated the constitution.                             | 法院裁定，新法律违反了宪法。            | ★法院裁定，新的法律违反了宪法。        |
| 21  | Scientists say the climate is changing faster than they expected.                       | 科学家说，气候的变革比预期的总体变动。       | ★科学家说，气候的变化比预期更快。       |
| 22  | The committee urged member states to increase their contributions.                      | 委员会敦促成员国增加了捐款。            | ★委员会敦促成员国增加其捐款。         |
| 23  | The president said the country would not accept the proposed terms.                     | 主席说，该国不接受拟议的任期。           | ★主席说，该国不会接受拟议的条件。       |
| 24  | The government announced a new policy to improve public health services in rural areas. | 政府宣布了一个新的政策，改善农村地区公共保健服务。 | ▼政府宣布为改善农村地区公共保健服务的新政策。 |

这也验证了前面加 Beam Search 效果趋于随机的原因，那就是模型太烂了。

# 六、完整代码（二）
此部分为BPE 版本的最终模型 Model X 完整代码，在手写版本基础上由蓝色大肥鱼完成。
> [你知道吗？]
> 该版本完成过程中产生的一半费用发生在 2026 年 10 月 15 日，届时 Deepseek 部分服务宕机。全部费用于当日下午约 16：00 全部返还。

- 改动只在三处：tokenization、训练单元、温度校准。
- `Attention` 与 `Model` 两部分与（一）逐字相同，不再重复。

### 1. Env

```python
import torch
import torch.nn as nn
import torch.nn.functional as F
import matplotlib.pyplot as plt
import random
import math
from collections import Counter
from pathlib import Path
```

### 2. Data
- pairs
- 字符表截断 + BPE tokenizer
- encode/decode
- make_batch

```python
# pairs（BPE 版）
# 与字符级版本共用同一份 TSV、同一套长度过滤、同一个打乱种子 —— 唯一区别是 tokenization。
# 两步（顺序不能反，实现在 tools/train_bpe.py）：
#   1. 字符表截断：只在**完整训练集**上统计字频，只保留高频字符，其余字符统一映射成 UNK。
#      中文全量 9181 个字，保留 3000 个已覆盖 99.53% 的字符；砍掉的长尾里 69.7% 的字
#      出现 ≤100 次、1710 个只出现 1 次 —— 它们根本学不会，却占着 softmax 容量、还污染概率分布。
#   2. BPE：在截断后的字符表上学 1500 次合并，学出「数据」「方法」「什么」这类高频片段。
import json

RAW = Path('./data/wmt19_zh_en.tsv')
BPE_JSON = Path('./data/bpe_zh_en.json')

MAX_SRC_CHARS, MAX_TGT_CHARS = 96, 46    # 语料过滤仍按**字符**，与旧版完全一致（可比）
SRC_LEN, TGT_LEN = 64, 48                # 但这两个现在是**子词**长度
PAD, UNK, BOS, EOS = 0, 1, 2, 3
device = torch.device('cuda')            # 和字符级版本保持一致（那边也是硬编码 cuda）

_bpe = json.loads(BPE_JSON.read_text(encoding='utf-8'))
UNK_CHAR = _bpe['unk_char']


def make_tokenizer(vocab, merges, n_chars, unk_char):
    """(vocab, merges) -> (encode, decode)。checkpoint 里存的也是这套信息，便于事后复原。

    编码技巧：第 r 次合并产生的新符号，用私有区单字符 chr(0xE000+r) 代表，于是
    「按合并顺序反复合并」就等价于对字符串按顺序做 str.replace —— C 速度。
    （教科书那种「每步找最小 rank 的 pair」写法，120 万句要几十分钟。）
    已用 tools/check_bpe.py 与教科书实现逐 id 比对：0 处不一致。
    """
    sym_char = [v if i < n_chars else chr(0xE000 + (i - n_chars))
                for i, v in enumerate(vocab)]
    sym2id = {c: i + 4 for i, c in enumerate(sym_char)}
    to_sym = {v: sym_char[i] for i, v in enumerate(vocab[:n_chars])}
    steps = [(sym_char[a], sym_char[b], sym_char[n_chars + r])
             for r, (a, b) in enumerate(merges)]

    def encode(text):
        s = ''.join(to_sym.get(c, unk_char) for c in text)
        for a, b, c in steps:
            if a in s:
                s = s.replace(a + b, c)
        return [sym2id[ch] for ch in s]      # s 只由 sym_char 组成，一定查得到

    def decode(ids):
        out = []
        for t in ids:
            if t == EOS:                     # 和字符级 decode_tgt 同样的语义
                break
            if t < 4:
                continue
            out.append(vocab[t - 4])
        return ''.join(out)

    return encode, decode


encode_src, decode_src = make_tokenizer(_bpe['src_vocab'], _bpe['src_merges'],
                                        _bpe['n_src_chars'], UNK_CHAR)
encode_tgt, decode_tgt = make_tokenizer(_bpe['tgt_vocab'], _bpe['tgt_merges'],
                                        _bpe['n_tgt_chars'], UNK_CHAR)

src_chars, tgt_chars = _bpe['src_vocab'], _bpe['tgt_vocab']
src_size, tgt_size = len(src_chars) + 4, len(tgt_chars) + 4

# checkpoint 里带上这些，事后才不需要靠猜来复原 tokenization
TOKENIZER = {'kind': 'bpe', 'unk_char': UNK_CHAR,
             'n_src_chars': _bpe['n_src_chars'], 'src_vocab': _bpe['src_vocab'],
             'src_merges': _bpe['src_merges'],
             'n_tgt_chars': _bpe['n_tgt_chars'], 'tgt_vocab': _bpe['tgt_vocab'],
             'tgt_merges': _bpe['tgt_merges']}

pairs = []
for line in RAW.read_text(encoding='utf-8').splitlines():
    en, ch = line.split('\t')[:2]
    if len(en) <= MAX_SRC_CHARS and len(ch) <= MAX_TGT_CHARS:
        pairs.append((en, ch))
random.Random(17).shuffle(pairs)
n_train, n_dev, n_test = 1200000, 2000, 2000
train_pairs = pairs[:n_train]
dev_pairs = pairs[n_train:n_dev + n_train]
test_pairs = pairs[n_dev + n_train:]

print(f'词表：src {src_size}（字符表 {_bpe["n_src_chars"]} + 合并 {len(_bpe["src_merges"])}）'
      f'   tgt {tgt_size}（字符表 {_bpe["n_tgt_chars"]} + 合并 {len(_bpe["tgt_merges"])}）')
print(f'语料：train {len(train_pairs)}, dev {len(dev_pairs)}, test {len(test_pairs)}')
print(f'对比字符级旧版：src 488 -> {src_size}，tgt 9185 -> {tgt_size}'
      f'（缩小到 {tgt_size/9185*100:.1f}%）')


def make_batch(batch):
    x_src = torch.full((len(batch), SRC_LEN), PAD, dtype=torch.long, device=device)
    x_tgt = torch.full((len(batch), TGT_LEN), PAD, dtype=torch.long, device=device)
    y = torch.full((len(batch), TGT_LEN), -100, dtype=torch.long, device=device)
    for i, (en, ch) in enumerate(batch):
        s = encode_src(en)[:SRC_LEN]
        t = [BOS] + encode_tgt(ch)[:TGT_LEN - 2] + [EOS]
        x_src[i, :len(s)] = torch.tensor(s, device=device)
        x_tgt[i, :len(t) - 1] = torch.tensor(t[:-1], device=device)
        y[i, :len(t) - 1] = torch.tensor(t[1:], device=device)
    return x_src, x_tgt, y


# 自检：压缩率 + 往返
_en = 'The government announced a new policy to improve public health services in rural areas.'
_zh = '政府宣布了一项新政策，以改善农村地区的公共卫生服务。'
print(f'压缩率自检：src {len(_en)} 字符 -> {len(encode_src(_en))} 子词'
      f'（{len(_en)/len(encode_src(_en)):.2f}x）   '
      f'tgt {len(_zh)} 字符 -> {len(encode_tgt(_zh))} 子词'
      f'（{len(_zh)/len(encode_tgt(_zh)):.2f}x）')
print(f'往返自检：{decode_tgt(encode_tgt(_zh))!r}')
```

### 3. Attention

`SelfAttention` / `CausalSelfAttention` / `CrossAttention` 
见“完整代码（一）”
### 4. Model

`FeedForward` / `EncoderBlock` / `DecoderBlock` / `Transformer` 
见“完整代码（一）”
### 5. Train
- Learn rate
- Fixed batch evaluation
- Train step
- Train
- Save

```python
BATCH = 64
MAX_STEPS = 30000
WARMUP = 5000
LR_MAX, LR_MIN = 5e-3, 1e-5

torch.manual_seed(0)
config = dict(src_vocab=src_size, tgt_vocab = tgt_size, src_block_size = SRC_LEN, tgt_block_size=TGT_LEN, n_layer = 4, n_embd=128)
model = Transformer(**config).to(device)
groups = [
    dict(params=[p for p in model.parameters() if p.ndim >= 2], weight_decay=0.1),
    dict(params=[p for p in model.parameters() if p.ndim < 2], weight_decay=0.0),
]
optimizer = torch.optim.AdamW(groups, lr=LR_MAX, betas=(0.9,0.95))

def get_lr(step):
    if step <= WARMUP:
        return LR_MAX * step / WARMUP
    progress = min(1.,(step-WARMUP)/(MAX_STEPS-WARMUP))
    return LR_MIN + 0.5 * (LR_MAX - LR_MIN) * (1 + math.cos(math.pi * progress))

def fixed_batches(pairs, batch_size, iters, seed):
    order = torch.randperm(len(pairs),generator=torch.Generator().manual_seed(seed))
    picked = order[:batch_size * iters].tolist()
    return [[pairs[i] for i in picked[s:s+batch_size]] for s in range(0, len(picked),batch_size)]

@torch.no_grad()
def estimate_loss(batches):
    was_training = model.training
    model.eval()
    losses=[]
    for batch in batches:
        x_src, x_tgt, y = make_batch(batch)
        losses.append(model(x_src, x_tgt,y)[1].item())
    model.train(was_training)
    return sum(losses)/len(losses)

train_eval_batches = fixed_batches(train_pairs, BATCH, 10,200)
dev_eval_batches = fixed_batches(dev_pairs, BATCH, 10,117)

def train_step(step, batch):
    model.train()
    for group in optimizer.param_groups:
        group['lr'] = get_lr(step)
    x_src, x_tgt, y = make_batch(batch)
    _, loss = model(x_src, x_tgt, y)
    optimizer.zero_grad()
    loss.backward()
    torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
    optimizer.step()
    return loss.item()

# ---- checkpoint：文件名带 TGT_LEN 与 lr，不同超参的实验不会互相覆盖 ----
def save_ckpt(path=None):
    path = Path(path or f'ckpt_bpe_lr{LR_MAX:g}.pt')
    torch.save({
        'config': config,                    # 含词表大小与 block size，可直接重建模型
        'state_dict': model.state_dict(),
        'src_chars': src_chars, 'tgt_chars': tgt_chars,
        'src_size': src_size, 'tgt_size': tgt_size,
        'tokenizer': TOKENIZER,          # BPE 的复原信息，事后不用猜
        'SRC_LEN': SRC_LEN, 'TGT_LEN': TGT_LEN,
        'hist': hist, 'lr_max': LR_MAX, 'max_steps': MAX_STEPS,
    }, path)
    print(f'已保存 {path}（TGT_LEN={TGT_LEN}, 参数量 '
          f'{sum(p.numel() for p in model.parameters()) / 1e6:.2f} M）')
    return path

hist = {'step':[],'train':[],'dev':[]}
step = 0
while step< MAX_STEPS:
    order = torch.randperm(len(train_pairs)).tolist()
    for s in range(0, len(order) - BATCH + 1, BATCH):
        step += 1
        if step > MAX_STEPS:
            break
        train_step(step,[train_pairs[i] for i in order[s:s+BATCH]])
        if step % 200 ** 0 or step ** MAX_STEPS:
            train_loss = estimate_loss(train_eval_batches)
            dev_loss = estimate_loss(dev_eval_batches)
            hist['step'].append(step)
            hist['train'].append(train_loss)
            hist['dev'].append(dev_loss)
            print(f'step {step:5d}  train={train_loss:.4f}  dev={dev_loss:.4f}  '
                  f'lr={get_lr(step):.6f} ') 

CKPT_PATH = save_ckpt()   # 路径留给温度单元写回 T
```

### 6. Temperature

```python
# ---- 温度校准 T ----
# beam 的打分是「Σ log p ÷ 长度^α」。模型若**过度自信**（把 0.99 给一个错 token），
# 分数差距会被放大 → beam 被早期的高概率错误锁死 → 候选全挤在众数附近。
# 温度 T 把 logits 除以 T 再 softmax，把分布压平一些。
#
# 注意定位：**T 不参与训练**，也不改变贪心（argmax 与 T 无关），
# 它只在**解码打分**时生效，所以是训练完成后在 dev 上拟合、写进 checkpoint。
#
# 拟合依据直接选「我们真正在意的那个量」：候选池内 评分排序 与 chrF 排序 的 Spearman ρ。
import random as _random

BEAM_WIDTH, BEAM_ALPHA = 5, 0.7   # 束宽；长度惩罚指数。最后一个测试单元会用到这两个名字


@torch.no_grad()
def seq_score(src_text, seq, T=1.0, alpha=0.7):
    """teacher-forced 打分：Σ log softmax(logits/T) ÷ (len-1)^α。seq 含开头 BOS。"""
    idx = torch.full((1, SRC_LEN), PAD, dtype=torch.long, device=device)
    s = encode_src(src_text)[:SRC_LEN]
    idx[0, :len(s)] = torch.tensor(s, device=device)
    memory, pad_mask = model.encode_src(idx)
    t = torch.tensor([seq], device=device)
    logits = model.head(model.decode_tgt(t, memory, pad_mask))[0] / T
    lsm = torch.log_softmax(logits[:-1], -1)
    lp = float(lsm.gather(1, t[0, 1:].unsqueeze(1)).sum())
    return lp / max(len(seq) - 1, 1) ** alpha


@torch.no_grad()
def candidate_pool(src_text, beam=5, alpha=0.7):
    """给一句英文生成候选集：纯 beam 搜索的全部完成候选 + 未结束的 beam，按打分排序。"""
    idx = torch.full((1, SRC_LEN), PAD, dtype=torch.long, device=device)
    s = encode_src(src_text)[:SRC_LEN]
    idx[0, :len(s)] = torch.tensor(s, device=device)
    memory, pad_mask = model.encode_src(idx)

    def step(seqs):
        B = seqs.shape[0]
        lg = model.head(model.decode_tgt(
            seqs, memory.expand(B, *memory.shape[1:]),
            None if pad_mask is None else pad_mask.expand(B, *pad_mask.shape[1:])))[:, -1].clone()
        lg[:, PAD] = float('-inf')
        lg[:, BOS] = float('-inf')
        return lg

    def rank(lp, sq):
        return lp / max(len(sq) - 1, 1) ** alpha

    alive, finished = [(0.0, [BOS])], []
    for _ in range(TGT_LEN - 1):
        seqs = torch.tensor([q for _, q in alive], device=device)
        top = torch.topk(torch.log_softmax(step(seqs), -1), beam, dim=-1)
        cands = []
        for i, (cum, sq) in enumerate(alive):
            for v, tk in zip(top.values[i].tolist(), top.indices[i].tolist()):
                cands.append((cum + v, sq + [tk]))
        cands.sort(key=lambda c: rank(*c), reverse=True)
        alive = []
        for cum, sq in cands:
            if sq[-1] == EOS:
                finished.append((rank(cum, sq), sq))
            elif len(alive) < beam:
                alive.append((cum, sq))
        if not alive:
            break
    allc = finished + [(rank(c, s), s) for c, s in alive]
    allc.sort(key=lambda p: p[0], reverse=True)
    return [s for _, s in allc[:8]]


def _spearman(a, b):
    def rank(v):
        idx = sorted(range(len(v)), key=lambda i: v[i])
        rk = [0.0] * len(v)
        i = 0
        while i < len(idx):
            j = i
            while j + 1 < len(idx) and v[idx[j + 1]] == v[idx[i]]:
                j += 1
            for k in range(i, j + 1):
                rk[idx[k]] = (i + j) / 2 + 1
            i = j + 1
        return rk
    ra, rb = rank(a), rank(b)
    n = len(a)
    ma, mb = sum(ra) / n, sum(rb) / n
    num = sum((x - ma) * (y - mb) for x, y in zip(ra, rb))
    da = math.sqrt(sum((x - ma) ** 2 for x in ra))
    db = math.sqrt(sum((y - mb) ** 2 for y in rb))
    return num / (da * db) if da * db > 0 else 0.0


def _chrf(hyp, ref, nmax=6, beta=2.0):
    if not hyp or not ref:
        return 0.0
    from collections import Counter
    p = r = 0.0
    used = 0
    for n in range(1, nmax + 1):
        th, tr = len(hyp) - n + 1, len(ref) - n + 1
        if th <= 0 or tr <= 0:
            continue
        hg = Counter(tuple(hyp[i:i + n]) for i in range(th))
        rg = Counter(tuple(ref[i:i + n]) for i in range(tr))
        m = sum(min(c, rg.get(g, 0)) for g, c in hg.items())
        p += m / th
        r += m / tr
        used += 1
    if not used:
        return 0.0
    P, R = p / used, r / used
    if P + R == 0:
        return 0.0
    b2 = beta * beta
    return (1 + b2) * P * R / (b2 * P + R)


_n_cal = 120
T_GRID = [0.5, 0.7, 0.85, 1.0, 1.2, 1.5, 2.0, 3.0]
_cal = dev_pairs[:_n_cal]

print('在 dev 上构造候选池（每句 8 条），然后用不同 T 打分，看「评分排序」和「chrF 排序」')
print('的相关性 —— 相关性最高的 T 就是最该用的 T。')
print()
_pool_seqs, _pools, _refs = [], [], []
for _en, _zh in _cal:
    _sp = candidate_pool(_en)                 # 只建一次池，别在 T 循环里重复建
    _pool_seqs.append(_sp)
    _pools.append([decode_tgt(s) for s in _sp])
    _refs.append(_zh)

print(f"{'T':>6} {'平均 Spearman ρ':>16} {'评分最高的那条 = chrF 最高':>28}")
print('-' * 54)
_rho_by_T, _hit_by_T = {}, {}
for _T in T_GRID:
    _rhos, _hits = [], 0
    for (_en, _zh), _seqs, _pool in zip(_cal, _pool_seqs, _pools):
        _sc = [seq_score(_en, s, T=_T) for s in _seqs]
        _cf = [_chrf(t, _zh) for t in _pool]
        if len(set(_sc)) > 1 and len(set(_cf)) > 1:
            _rhos.append(_spearman(_sc, _cf))
        if max(range(len(_sc)), key=lambda i: _sc[i]) == max(range(len(_cf)), key=lambda i: _cf[i]):
            _hits += 1
    _rho_by_T[_T] = sum(_rhos) / len(_rhos) if _rhos else 0.0
    _hit_by_T[_T] = _hits / len(_cal)
    print(f'{_T:>6.2f} {_rho_by_T[_T]:>16.4f} {_hit_by_T[_T]:>28.1%}')

BEAM_T = max(T_GRID, key=lambda t: _rho_by_T[t])
print()
print(f'选定 BEAM_T = {BEAM_T:g}（ρ = {_rho_by_T[BEAM_T]:.4f}，命中率 {_hit_by_T[BEAM_T]:.1%}）')
print(f'对照 T=1.0：ρ = {_rho_by_T[1.0]:.4f}，命中率 {_hit_by_T[1.0]:.1%}')

# 把 T 写回 checkpoint —— 它是**解码期**参数，必须跟着模型走，
# 否则最后一个单元去加载时会退回默认 T=1，这一格就白跑了。
if 'CKPT_PATH' in globals():
    _ck = torch.load(CKPT_PATH, map_location='cpu')
    _ck['beam_T'] = BEAM_T
    _ck['temp_curve'] = {'T': T_GRID, 'rho': [_rho_by_T[t] for t in T_GRID],
                         'hit': [_hit_by_T[t] for t in T_GRID], 'n_cal': _n_cal}
    torch.save(_ck, CKPT_PATH)
    print(f'已把 BEAM_T={BEAM_T:g} 写回 {CKPT_PATH}')
else:
    print('（没找到 CKPT_PATH，T 只留在内存里；跑过训练单元才会有）')
```

### 7. Results

```
词表：src 1712（字符表 208 + 合并 1500）   tgt 4491（字符表 2987 + 合并 1500）
语料：train 1200000, dev 2000, test 800689
对比字符级旧版：src 488 -> 1712，tgt 9185 -> 4491（缩小到 48.9%）
压缩率自检：src 87 字符 -> 25 子词（3.48x）   tgt 26 字符 -> 13 子词（2.00x）
往返自检：'政府宣布了一项新政策，以改善农村地区的公共卫生服务。'
```

第一段从头训 43000 步：

```
step   200  train=19.6089  dev=19.4603  lr=0.000200 
step   400  train=12.7264  dev=12.6599  lr=0.000400 
step   600  train=8.5145  dev=8.5438  lr=0.000600 
...
step 42600  train=2.2492  dev=2.2814  lr=0.000011 
step 42800  train=2.2476  dev=2.2805  lr=0.000010 
step 43000  train=2.2479  dev=2.2800  lr=0.000010 
已保存 ckpt_bpe_lr0.005_43k.pt（TGT_LEN=48, 参数量 2.39 M）
```

再 warm restart 续训 57000 步：

```
step    200  train=2.2663  dev=2.3529  lr=0.000300  (8s)
step    400  train=2.0990  dev=2.4831  lr=0.000600  (15s)
step    600  train=2.5141  dev=2.6541  lr=0.000900  (22s)
step   2000  train=3.7716  dev=3.5308  lr=0.003000  (74s)
...
step  56800  train=2.0164  dev=2.0508  lr=0.000001  (1961s)  <- 存最优
step  57000  train=1.8330  dev=2.0507  lr=0.000001  (1968s)  <- 存最优

最优 dev = 2.0507（第 57000 步）；起点 dev = 2.2800
已写出 ckpt_bpe_lr0.005_100k.pt
```

温度校准在 43000 步的模型上跑出来：

```
     T    平均 Spearman ρ            评分最高的那条 = chrF 最高
------------------------------------------------------
  0.50           0.1656                        31.7%
  0.70           0.1638                        34.2%
  0.85           0.1714                        35.8%
  1.00           0.1703                        36.7%
  1.20           0.1602                        33.3%
  1.50           0.1373                        32.5%
  2.00           0.1331                        28.3%
  3.00           0.1500                        30.0%

选定 BEAM_T = 0.85（ρ = 0.1714，命中率 35.8%）
对照 T=1.0：ρ = 0.1703，命中率 36.7%
```

```python
# hist 是两段拼起来的：43000 步从头训 + 57000 步续训，第二段的 step 编号从 0 重数，
# 横轴得自己拼成全局步数。
brk = next(i for i in range(1, len(hist['step'])) if hist['step'][i] < hist['step'][i - 1])
xs = hist['step'][:brk] + [hist['step'][brk - 1] + s for s in hist['step'][brk:]]

fig, ax = plt.subplots(figsize=(5.2, 2.8))
ax.plot(xs, hist['train'], label='train')
ax.plot(xs, hist['dev'], label='dev')
ax.axvline(hist['step'][brk - 1], color='gray', lw=.8, ls='--', alpha=.6)
ax.legend(); ax.grid(alpha=.2); fig.tight_layout(); plt.show()
```

![image.png](https://s3.su.bcebos.com/izwarm-obsidian/2026/10/09d52120ecde3a684d060e9bf9adc071.png)

曲线在 43000 步处的竖虚线是 warm restart，dev 先被顶上去再回落。跨 tokenization 的最终指标见“最终模型结果”。

# 七、视频记录
> 完整代码（一）的录制和 Manim 演示视频的剪辑。演示视频制作 prompt：[Transformer 视频演示 prompt](/notes/machine-and-deep-learning/nndl/transformer-视频演示-prompt/)


