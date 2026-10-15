---
title: "NNDL 26-10-13 手写 Transformer"
slug: "machine-and-deep-learning/nndl/26-10-13-transformer"
description: "——手写一个 Encoder–Decoder Transformer 做英译中：三种注意力、学习率调度、两个参数组的权重衰减，以及复盘。"
publishDate: "2026-10-13"
createdAt: "2026-10-13T00:00:00Z"
updatedDate: "2026-10-15T17:59:38"
tags: ["NNDL","PyTorch","python","machine-learning"]
series: ["Machine & Deep Learning","NNDL"]
---

——手写一个 Encoder–Decoder Transformer 做英译中：三种注意力、学习率调度、两个参数组的权重衰减，以及复盘。

承接 [NNDL 26-09-26 循环神经网络练习](/notes/machine-and-deep-learning/nndl/26-09-26-rnn/)：上一次实现了LSTM的"循环 + 门控"机制，这一次，不用 `nn.Transformer` / `nn.MultiheadAttention`。任务是训一个字符级翻译模型：源长 64、目标长 32、4 层、4 头、128 维，20000 步。希望能弄清三种注意力的 Q/K/V 和掩码，把训练调度（预热 + 余弦退火 + 分组权重衰减）补齐，并总结思考。

# 一、公式总结

**记号**：批量 $B$；源长 $S$ = `SRC_LEN` = 64；目标长 $T$ = `TGT_LEN` = 32；嵌入维度 $C$ = `n_embd` = 128；头数 $h$ = `n_head` = 4；每头维度 $d=C/h=32$；层数 $n_{layer}=4$。词表：$V_{src}=83$（英文按字符，$79+4$）、$V_{tgt}=3661$（中文按字，$3657+4$）。

**① 缩放点积注意力**：

$$
\text{att}=\frac{QK^\top}{\sqrt d}\in\mathbb R^{B\times h\times L\times S},\qquad
Y=\operatorname{softmax}(\text{att})\,V
$$

> 三个注意力类里 $L$ 和 $S$ 的含义不同：
> - `SelfAttention`：$L=S=T_{src}$，Q/K/V 同源，一次算完 $[Q;K;V]=XW_{qkv}$，$W_{qkv}\in\mathbb R^{C\times 3C}$；
> - `CausalSelfAttention`：同样同源，但 $L=S=T_{tgt}$ 且加因果掩码；
> - `CrossAttention`：$L=T_{tgt}$、$S=T_{src}$，$Q=XW_q$ 而 $[K;V]=\text{memory}\,W_{kv}$，所以要拆成两个线性层（`self.q` 和 `self.kv`）。

**② 三种掩码**：

$$
\text{pad\_mask}=\big[\text{idx}_{src}=\text{PAD}\big]\in\{0,1\}^{B\times S}
$$

```python
att = att.masked_fill(pad_mask[:, None, None, :], float('-inf'))   # 自注意力 / 跨注意力
att = att.masked_fill(self.mask[:L, :L], float('-inf'))            # 因果
```

> 广播是关键：`pad_mask` 是 $(B,S)$，插两个长度 1 的维度变成 $(B,1,1,S)$，正好对上 `att` 的 $(B,h,L,S)$，于是每个头、每个 query 行都屏蔽同一批 key 列。
>
> 掩码是**加在 softmax 之前**的：被置 $-\infty$ 的位置过 softmax 后指数为 0，权重恰好为 0。
>
> 因果掩码来自 `torch.triu(..., diagonal=1)`，是**严格上三角**——对角线保留（每个位置能看自己），只把"未来"挡掉。

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

> 是 **Pre-LN**：归一化在子层**入口**，残差是干净的恒等通路。整个块里**没有 dropout**，这一点单独在 3.1 说。

**⑤ 嵌入 + 可学习位置嵌入**：

$$
x=\boldsymbol E_{tok}[\text{idx}]+\boldsymbol E_{pos}\big[\text{arange}(L)\big]
$$

> `nn.Embedding(..., padding_idx=PAD)` 里的 `padding_idx` **不做填充**，它只做一件事：让 PAD 那一行的梯度恒为 0，参数永远停在初始值（全 0）。真正的 PAD 是 `make_batch` 用 `torch.full` 铺出来的。
>
> 位置索引必须写在输入张量的设备上：`torch.arange(S, device=idx_src.device)`，见 3.5。

**⑥ 输出头与权重共享**：

$$
\text{logits}=H\,\boldsymbol E_{tgt}[i]^\top,\qquad \texttt{head.weight} \leftarrow \texttt{tgt\_emb.weight}
$$

> `self.head = nn.Linear(n_embd, tgt_vocab, bias=False)` 之后紧跟 `self.head.weight = self.tgt_emb.weight`，两块参数是**同一个对象**（不是拷贝）——`state_dict` 里会出现两个键指向同一份存储。所以 `head` 后面绝不能加 bias。

**⑦ 损失（PAD 位置不计入）**：

$$
\mathcal L=-\frac1N\sum_{n}\log\frac{\exp z_{n,y_n}}{\sum_{c}\exp z_{nc}},\qquad
y_n=-100 \Rightarrow \text{忽略}
$$

> `tgt_out` 用 `torch.full(..., -100)` 初始化，只有写进去的真实 token 才参与 loss；`F.cross_entropy` 默认 `ignore_index=-100`。

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

# 二、完整代码

## Transformer: EN -> CH

- Env

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

- Data
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

- Attention
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

- Model
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

- Train
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
## Results

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

理由是数据规模。这次 3 万句对，上一次循环网络是合成任务、训练集 500 条。数据量上去后过拟合不再是瓶颈，dropout 只剩代价：置零引入噪声拖慢收敛，丢弃神经元降低有效容量。GPT 一类的大模型把 dropout 设成 0，是同一条逻辑。

数据也支持这个判断。dev 从第 7000 步起走平，末段 2.3265 → 2.3492 只升 1%，train 却降到 0.083。这个 gap 说明 2M 参数在背训练集，但记忆几乎没伤到 dev——dev 的天花板由数据覆盖决定。dropout 要修的问题不存在，而 20000 步的固定预算下它只会让终点更差。

顺带少一层 train/eval 分叉：其余算子（线性层、LayerNorm、softmax、掩码）在两种模式下数值相同，只有 dropout 例外。

## 3.2 `param_group` 的用法

```python
groups = [
    dict(params=[p for p in model.parameters() if p.ndim >= 2], weight_decay=0.1),
    dict(params=[p for p in model.parameters() if p.ndim < 2],  weight_decay=0.0),
]
optimizer = torch.optim.AdamW(groups, lr=LR_MAX, betas=(0.9, 0.95))
```

二维及以上（线性层权重、嵌入矩阵）衰减 0.1，一维（偏置、LayerNorm 的 `weight`/`bias`）不衰减。偏置和 LayerNorm 参数不是表达能力的主要来源，衰减只会损害性能，这是 GPT/BERT 的惯例。`AdamW` 与 `Adam` 的区别也在这：前者把权重衰减解耦出去，不混进梯度。

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

`view` 改形状不复制数据，`transpose` 换维度也不移动内存。所以 `transpose` 之后张量往往不连续，而 `view` 要求连续，因此需要 `contiguous()`。

`torch.arange(6).view(2, 3)` 内存是 `[0,1,2,3,4,5]`、步长 `(3,1)`。`transpose(0,1)` 后形状变 `(3,2)`，内存没动，步长成 `(1,3)`，逻辑形状和内存布局不再对应，`view(6)` 就会报：

```text
RuntimeError: view size is not compatible with input tensor's size and stride
```

`contiguous()` 按 `(3,2)` 把内存重排成 `[0,3,1,4,2,5]`，步长回到 `(2,1)`，`view(6)` 才能跑。

注意力里同一件事：

```python
y = (att @ v).transpose(1, 2).contiguous().view(B, L, D)
```

`att @ v` 是 `(B,h,L,d)` 且连续；`transpose(1,2)` 得到 `(B,L,h,d)` 但不搬内存；要把 `h`、`d` 合并回 `D`，而 `view` 要求最后两维连续，所以先 `contiguous()` 排内存，再 `view` 合并。

```text
(B, L, C)  --view-->  (B, L, h, d)  --transpose(1,2)-->  (B, h, L, d)
(B, h, L, d)  --transpose(1,2)-->  (B, L, h, d)  --contiguous-->  --view-->  (B, L, C)
```

换成 `reshape` 功能等价，它需要时自动 `contiguous()`。显式写的好处是点明这里真要一次内存重排，也避开 `reshape` 有时返回视图、有时返回副本的不确定性。

## 3.4 `block_size` $\ge$ `T`

`block_size` 是最大序列窗口，`T` 是 `att` 的实际长度，关系只有 $T \le \texttt{block\_size}$。这里它是 `TGT_LEN = 32`，只有解码器的因果自注意力用得上。形状对不上是因为切片：

```python
mask = torch.triu(torch.ones(block_size, block_size), diagonal=1).bool()
self.register_buffer('mask', mask)          # 注册的形状 (32, 32)
...
att = att.masked_fill(self.mask[:L, :L], float('-inf'))   # 前向时切片成 (L, L)
```

`att` 最后两维是 $(L, L)$，`mask[:L,:L]` 正好也是。注册时按上限开，使用时按实际长度切。`T` 是变的：训练时右填充到 32，恰好等于上限；推理时逐步生成，每一步都要过因果掩码。

| 推理步 | `att` 形状 | `mask[:L,:L]` |
|---|---|---|
| 第 1 步 | `(B, h, 1, 1)` | `(1, 1)` |
| 第 5 步 | `(B, h, 5, 5)` | `(5, 5)` |
| 第 32 步 | `(B, h, 32, 32)` | `(32, 32)` |

预注册成 buffer 会跟着 `.to(device)` 搬到 GPU，之后不管 `L` 是多少，切片都是零拷贝的视图操作。改成每次现算 `torch.triu(torch.ones(L, L))` 有三个问题：推理 32 步新建 32 次张量；新张量默认在 CPU 而 `att` 在 CUDA，直接报设备不一致；还把序列长度上限藏了起来。

预注册把上限固定住，`T > block_size` 就成了显式越界。手写版没写断言，超限时切片为空、掩码静默失效。改 `TGT_LEN` 时 `block_size` 必须跟着改。

## 3.5 `device='cuda'` 的实现逻辑

`SelfAttention` 里没有一行 `device`，这是对的：模块只定义有哪些参数、怎么算，不定义参数放在哪。`self.qkv = nn.Linear(...)` 创建时在 CPU，搬走是在外面做的：

```python
model = Transformer(**config).to(device)
```

`nn.Module.to(device)` 递归遍历所有子模块，搬两类东西：`nn.Parameter`（线性层权重、LayerNorm 的 weight/bias、嵌入矩阵）和 `register_buffer` 注册的张量（那个因果掩码）。**但它不搬输入**，所以 `make_batch` 结尾要写 `return src.to(device), ...`。

`SelfAttention` 内部不新建张量，不用管设备；`CausalSelfAttention` 和 `encode_src` 会新建，就得自己处理：

```python
mask = torch.triu(torch.ones(block_size, block_size), diagonal=1).bool()
self.register_buffer('mask', mask)              # ① 靠 buffer 跟着 .to(device) 走
...
self.src_pos(torch.arange(S, device=idx_src.device))   # ② 显式指定输入所在的设备
```

① 是让默认在 CPU 的张量随模型一起搬。② 取的是**输入自己的设备**，不是类外那个 `device` 变量，否则模型换到 CPU 就废了。少了这个 `device=`，`masked_fill` 或嵌入相加会报 `Expected all tensors to be on the same device`。

模块内部硬写设备没有好处：没 GPU 的机器直接崩，想搬回 CPU 得改源码，`.to()` / `.cuda()` / `.cpu()` 也失去意义。这份手写版恰好违反了这一点（`torch.device('cuda')` 写死，只能在有 CUDA 的机器上跑），是练习机固定带来的取舍：

```python
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
```

## 3.6 `logits.reshape(-1, logits.size(-1))` 能不能写成 `logits.view(B*T, V)`

可以，但 `view` 多一条前提：张量必须连续。连续时两者等价，不连续时 `view` 报错、`reshape` 自动兜底。

```python
logits.reshape(-1, logits.size(-1))
```

`-1` 自动推断，`logits.size(-1)` 是目标词表大小 $V$，结果 `(B*T, V)`，与 `targets` 展平后的 `(B*T,)` 对齐做交叉熵。写成 `view(B*T, V)` 要三个条件：`B`、`T` 在作用域里已知，`V` 提前取好，`logits` 连续。这里三条都满足（`nn.Linear` 的输出连续，`targets` 由 `torch.full` 建出来也连续），所以这句合法：

```python
B, T = idx_tgt.shape
V = logits.size(-1)
loss = F.cross_entropy(logits.view(B*T, V), targets.view(B*T))
```

上游若有 `transpose`、`permute` 这类只改步长的操作，`logits` 就不连续，`view` 会报同一个 `view size is not compatible`，得先 `contiguous()`。`reshape` 会自动判断，必要时自己复制一份。

推荐 `reshape`：不要求连续，`-1` 自动推断，`B`/`T` 改名或挪出作用域都不影响。确定连续又想显式写出 `B*T` 时写 `view` 也行，只是多了一个可能出错的约束。

# 四、与上一次练习的对照

|         | 上次（手写 SRN / LSTM）                      | 这次（手写 Transformer）                                    |
| ------- | -------------------------------------- | ----------------------------------------------------- |
| 核心算子    | 循环单元：隐状态跨时间步传递，**参数在所有时间步共享**          | 注意力：所有位置**并行**交互，靠 Q/K/V 的相似度决定"看哪里"                  |
| 时间维的处理  | `for step in range(seq_len)` 逐步推进      | 一次矩阵乘算完全部位置；**因果性靠掩码给，不靠循环**                          |
| 输入约定    | 三维 `[B, L, I]`，token 是 `[B, L]` 的 long | 同样三维 `[B, L, C]`，但内部要多一次 `view + transpose` 拆头        |
| 手工实现了什么 | 循环单元前向（逐时间步 matmul + 门控）               | 三种注意力的 Q/K/V 拆分、掩码、多头合并（**一次都没有现成模块**）                |
| 位置信息    | 天然有序（先后进入循环），不需要额外编码                   | 并行无序，**必须显式加位置嵌入**                                    |
| 主要失败模式  | **梯度消失**（SRN 在 length=50 退化成随机猜）       | **记忆训练集**（train 0.083，dev 从第 7000 步起走平在 2.33，末段只升 1%） |
| 正则化     | 没上（样本量够、瓶颈是结构）                         | 原始版上 `dropout=0.1`，手写版拿掉：数据量上去后它只剩拖慢收敛的代价，见 3.1       |
| 新增概念    | 门控机制 / 长程依赖 / 加法捷径 vs 连乘衰减             | 缩放点积注意力 / 多头 / 三种掩码 / Pre-LN / 预热+余弦退火 / 分组权重衰减       |

这一次的瓶颈在**数据**——结构是对的、也能跑出像样的翻译（dev 上挑出的 10 条最好译例相似度全是 1.00），但 3 万句对配 4 层 128 维，模型把训练集记熟了（train 0.083）而 dev 走平在 2.33。**一个要换模型，一个要加数据，解法完全不同。**

另外，两次都栽在同一类地方：**形状上的隐式约定**。上次是数据生成器的别名 bug（改的是同一个 list 对象），这次是 `view` 对连续性的要求、`torch.arange` 对设备的要求——都是"代码看着没错、一跑就报错"的类型，而且报错信息（`view size is not compatible with input tensor's size and stride`、`Expected all tensors to be on the same device`）都已经把原因写得很清楚了，只是得知道去哪一行找。

