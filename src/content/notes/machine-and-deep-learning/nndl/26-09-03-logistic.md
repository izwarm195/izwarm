---
title: "NNDL 26-09-03 Logistic回归练习"
slug: "machine-and-deep-learning/nndl/26-09-03-logistic"
description: "视频记录在 https://www.bilibili.com/video/BV113to6uEJc"
publishDate: "2026-09-03"
createdAt: "2026-09-03T00:00:00Z"
updatedDate: "2026-09-09T21:37:02"
tags: ["NNDL","PyTorch","python","machine-learning"]
series: ["Machine & Deep Learning","NNDL"]
---

# 完整代码（用时约 60 min）
视频记录在 https://www.bilibili.com/video/BV113to6uEJc

```python
import torch
from nndl import Op
from nndl.data import make_moons
import matplotlib.pyplot as plt

# model
class Linear_LR(Op):
    def __init__(self,input_size):
        super().__init__()
        self.params = {
            'w':torch.zeros(input_size,1),
            'b':torch.zeros(1)
        }
        self.grads = {}

    def forward(self,X):
        self.inputs = X
        self.outputs = torch.sigmoid(
            self.inputs @ self.params['w'] + self.params['b']
        )
        return self.outputs

    def backward(self,y):
        N = y.shape[0]
        self.grads['w'] = - 1 / N * (self.inputs.T @ (y - self.outputs))
        self.grads['b'] = - 1 / N * (y-self.outputs).sum()

# data
X, y = make_moons(n_samples = 1000 , shuffle = True, noise = 0.2)
X_train = X[:799]
y_train = y[:799].reshape(-1,1)
X_dev = X[799:999]
y_dev = y[799:999].reshape(-1,1)

# optimizer
class optimizer():
    def __init__(self,model,lr):
        self.model = model
        self.init_lr = lr

    def step(self):
        for key in self.model.params.keys():
            self.model.params[key] = self.model.params[key] - self.init_lr * self.model.grads[key]

# metric
def accuracy(labels,preds):
    preds = (preds >= 0.5).float()
    return (labels == preds).float().mean().item()

# Runner
class Runner():
    def __init__(self,model,optimizer,metric):
        self.model = model(2)
        self.optimizer = optimizer(self.model,0.005)
        self.metric = metric
        self.history = {
            'train_score':[],
            'dev_score':[]
        }

    def train(self,train_set,dev_set,num_epochs):
        X,y = train_set
        X_dev, y_dev = dev_set
        # 1 epoch
        for epoch in range(num_epochs):
            logits = self.model(X)
            self.model.backward(y)
            self.optimizer.step()
            self.history['train_score'].append(self.metric(y,logits))
            # dev
            dev_logits = self.model(X_dev)
            self.history['dev_score'].append(self.metric(y_dev,dev_logits))

# train
runner = Runner(Linear_LR,optimizer,accuracy)
runner.train([X_train,y_train],[X_dev,y_dev],1000)

# ---- 可视化：训练/验证曲线 + 学到的线性决策边界 ----
# 说明：这是原始二维特征的线性 Logistic 回归；moons 线性不可分，
# 所以直线边界在数学上确为学到的分界面，但无法真正把两类分开，
# 准确率会封顶在 ~0.8 附近。

fig, axes = plt.subplots(1, 2, figsize=(13, 5.5))

# 左：accuracy 随 epoch 的变化
for name, s in [('train', runner.history['train_score']),
                ('dev',   runner.history['dev_score'])]:
    axes[0].plot(s, label=name)
axes[0].set_xlabel('epoch')
axes[0].set_ylabel('accuracy')
axes[0].set_title('Accuracy over epochs')
axes[0].legend()
axes[0].grid(alpha=0.3)

# 右：数据散点 + 决策边界 w 0*x + w 1*y + b = 0
axes[1].scatter(X[:, 0], X[:, 1], c=y, cmap='RdBu', s=12, marker='.', alpha=0.7)
w = runner.model.params['w']   # [2,1]
b = runner.model.params['b']   # [1]
x 0 = torch.linspace(X[:, 0].min(), X[:, 0].max(), 200)
boundary_y = (-(w[0] * x 0 + b[0]) / w[1]).numpy()
axes[1].plot(x 0.numpy(), boundary_y, 'k-', lw=1.6, label='决策边界')
axes[1].set_xlabel('x')
axes[1].set_ylabel('y')
axes[1].set_title('决策边界：直线切不开弯月形两类')
axes[1].legend(loc='upper right')
axes[1].grid(alpha=0.3)

fig.tight_layout()
plt.show()
```

# 总结
## 一、这次练习做了什么

用"手写 Op"的方式（不用 PyTorch autograd），从零实现了线性 Logistic 回归：`Linear_LR` 自己写 sigmoid 前向和交叉熵合成梯度，再配自写的 optimizer / accuracy / Runner，在 `make_moons(noise=0.2)` 上切 train/dev 训练 1000 轮，最后画准确率曲线和决策边界。本质是把"前向 → 反向求梯度 → 参数更新 → 评估"这套轮子亲手造了一遍。

## 二、踩过的坑和怎么避免

**1. 把"类"当成"实例"用（最隐蔽）**
Runner 里写 `self.model = model`，存的是 `Linear_LR` 这个类。于是 `self.model(X)` 被 Python 解释成"用 X 去实例化模型"，`X` 就成了 `input_size`，导致 `torch.zeros(X, 1)` 报 `zeros() takes 1 positional argument`。
**避免**：分清"类=模板"与"实例=真正带 params/grads 的对象"。模型要先 `model(2)` 实例化一次（2 = 特征维数），之后前向、反向、优化全部用这同一个实例。traceback 最后一行往往不是根因，要往上追到"谁把错的东西传了进来"。

**2. 梯度的归属搞错**
`optimizer.step` 里写 `self.grads[key]`，但梯度存在模型上。优化器自己没有 grads，一跑就 `AttributeError`。
**避免**：动手前想清楚每个状态属于谁——**参数和梯度属于模型**，优化器只负责"拿 `model.grads` 去更新 `model.params`"。

**3. 没核对函数签名就调用**
`accuracy(labels, preds)` 被传成 `metric(logits)`（少真值）和 `metric(dev_set, ...)`（把一个 `[X, y]` 列表当 labels）。dev 那条更是根本没对 `X_dev` 做前向，哪来的预测可比？
**避免**：调用前先看形参；评估的正确姿势 = **对验证集独立前向 → 与它的真值比较**，训练 logits 和原始数据都不能直接拿来当指标输入。

**4. 画边界线时公式和 API 都错**
`torch.linspace` 漏了 `steps` 报 TypeError；边界写成 `y = w0·x`，既没用 w 1、没减 b，符号还是反的；算完还忘了 `plt.plot`。
**避免**：先推导再写码。sigmoid 的分界面是"线性组合 = 0"，即 `w0·x + w1·y + b = 0` ⇒ `y = −(w0·x + b)/w1`；还要检查坐标和系数对应：`X[:,0]→x` 配 `w[0]`，`X[:,1]→y` 配 `w[1]`。

## 三、图是怎么优化的

原来的问题：先 `plt.subplot` 开了图一，又 `plt.figure()` 另起图二，曲线和散点分家；边界线没画或画错；`print` 把 200 个数刷屏；旧 cell 里残留的报错输出还误导排查。

现在的图：一张 `fig` 用 `plt.subplots(1, 2)` 分左右两半——
- **左图**：train/dev 两条 accuracy 曲线同框，带图例和网格，一眼看出收敛后"卡在 ~0.8"这个线性天花板；
- **右图**：按类别着色的散点 + 按正确公式用学到的 `w, b` 算出的黑色决策边界（转 `.numpy()` 保证绘图兼容），标题直接注明"直线切不开弯月形两类"。

  顺手删了刷屏 print、清空了误导性的旧输出缓存。

## 四、简单说说非线性分割

**为什么线性不行**：线性模型的输出是输入的线性组合，所以它的决策边界永远是**直线 / 平面 / 超平面**。moons 是弯月形（圆环、螺旋同理），天生"绕弯"，任何一条直线都切不开，硬学的直线只能尽量把点分对，准确率到 ~0.8 就是顶。

**非线性怎么来的**：经典做法不是把模型式子改花哨，而是**把特征升维、变非线性**，让两类在新的特征空间里"重新变成直线可分"，然后照样用线性分类器。两个直观例子：
- 一个圆环内外两类：按 `x1²+x2²` 和半径比大小就能分——那只要把特征换成 `(x1², x2²)`，圆就变成了一条直线；
- moons：加多项式基 `φ(x)=[x1, x2, x1², x1·x2, x2²]`，再训练线性 LR 就能画出漂亮的分隔曲线（在特征空间里仍是直线）。

  这条思路和第 2 章多项式回归、SVM 的核技巧一脉相承；神经网络则是把这个"特征映射"也交给网络自己去学（隐藏层）。

  **关于书**：你的感觉没错——这本书**第 3 章讲的就是线性模型**（Logistic / Softmax 都只能出直线平面），所以它演示 moons 时本来就不会"完美分开"，这恰恰是用来展示线性模型边界和动机的：想进一步就要靠特征变换（书中后续章节 / 案例里"先升维再线性分类"的做法）。

  一句话收尾：**这次练习最大的收获不是代码本身，而是"状态归属（类 vs 实例、梯度放哪）、评估流程（签名+独立前向）、以及模型的几何含义（分界面方程）"三件事**——这三样在以后写任何模型和画任何边界时都通用。

# 推广：Logistic + n 次多项式
```python
import torch
from nndl import Op
from nndl.data import make_moons
import matplotlib.pyplot as plt
plt.rcParams['font.sans-serif'] = ['Microsoft YaHei', 'SimHei']
plt.rcParams['axes.unicode_minus'] = False

deg = 15

# ---------------- model ----------------
class Linear_LR(Op):
    def __init__(self, input_size):
        super().__init__()
        self.params = {
            'w': torch.zeros(input_size, 1),
            'b': torch.zeros(1)
        }
        self.grads = {}

    def forward(self, X):
        self.inputs = X
        self.outputs = torch.sigmoid(
            self.inputs @ self.params['w'] + self.params['b']
        )
        return self.outputs

    def backward(self, y):
        N = y.shape[0]
        self.grads['w'] = -1 / N * (self.inputs.T @ (y - self.outputs))
        self.grads['b'] = -1 / N * (y - self.outputs).sum()

# ---------------- poly：x1、x2 的 1..deg 次单项式，[N, M]；常数项由 b 承担 ----------------
def poly_basis(X, deg=3):
    cols = []
    for a in range(deg, -1, -1):
        for b in range(deg - a + 1):
            if a ** 0 and b ** 0:
                continue
            cols.append(X[:, 0] ** a * X[:, 1] ** b)
    return torch.stack(cols, dim=1)

# ---------------- data ----------------
X, y = make_moons(n_samples=1000, shuffle=True, noise=0.2)
X_train, X_dev = X[:799], X[799:999]
y_train = y[:799].reshape(-1, 1)
y_dev   = y[799:999].reshape(-1, 1)

# 只用训练集统计做 z-score（防泄漏），再升次多项式特征（注意：默认按 deg，但当前实际是二次 z-score）
mu, sd = X_train.mean(0), X_train.std(0) + 1e-8
X_train = poly_basis((X_train - mu) / sd, deg)
X_dev   = poly_basis((X_dev - mu) / sd, deg)

# ---------------- optimizer ----------------
class optimizer():
    def __init__(self, model, lr):
        self.model = model
        self.init_lr = lr

    def step(self):
        for key in self.model.params.keys():
            self.model.params[key] = self.model.params[key] - self.init_lr * self.model.grads[key]

# ---------------- metric ----------------
def accuracy(labels, preds):
    preds = (preds >= 0.5).float()
    return (labels == preds).float().mean().item()

# ---------------- Runner ----------------
class Runner():
    def __init__(self, model, optimizer, metric, lr=0.01):
        self.model_cls = model
        self.opt_cls = optimizer
        self.lr = lr
        self.metric = metric
        self.model = None
        self.optimizer = None
        self.history = {
            'train_score': [],
            'dev_score': []
        }

    def train(self, train_set, dev_set, num_epochs):
        X, y = train_set
        if self.model is None:
            self.model = self.model_cls(X.shape[1])     # 首次按特征维数把类变实例
            self.optimizer = self.opt_cls(self.model, self.lr)
        X_dev, y_dev = dev_set
        for epoch in range(num_epochs):
            logits = self.model(X)
            self.model.backward(y)
            self.optimizer.step()
            self.history['train_score'].append(self.metric(y, logits))
            dev_logits = self.model(X_dev)
            self.history['dev_score'].append(self.metric(y_dev, dev_logits))

# ---------------- train ----------------
runner = Runner(Linear_LR, optimizer, accuracy)
runner.train([X_train, y_train], [X_dev, y_dev], 2000)
print(f"final: train {runner.history['train_score'][-1]:.4f}  dev {runner.history['dev_score'][-1]:.4f}")

# ---------------- 可视化：训练/验证曲线 + 决策边界 ----------------
fig, axes = plt.subplots(1, 2, figsize=(13, 5.5))

# 左：accuracy 随 epoch 的变化
for name, s in [('train', runner.history['train_score']),
                ('dev',   runner.history['dev_score'])]:
    axes[0].plot(s, label=name)
axes[0].set_xlabel('epoch'); axes[0].set_ylabel('accuracy')
axes[0].set_title('Accuracy over epochs')
axes[0].legend(); axes[0].grid(alpha=0.3)

# 右：原始坐标铺网格 -> 同一 mu/sd 归一化 -> poly_basis -> 模型预测概率
xs = torch.linspace(X[:, 0].min() - 0.1, X[:, 0].max() + 0.1, 300)
ys = torch.linspace(X[:, 1].min() - 0.1, X[:, 1].max() + 0.1, 300)
GX, GY = torch.meshgrid(xs, ys, indexing='xy')
grid_raw = torch.stack([GX.flatten(), GY.flatten()], dim=1)
grid_feat = poly_basis((grid_raw - mu) / sd, deg)
p = runner.model(grid_feat).reshape(GX.shape).numpy()

cf = axes[1].contourf(GX.numpy(), GY.numpy(), p, levels=50, cmap='RdBu', alpha=0.45)
cs = axes[1].contour(GX.numpy(), GY.numpy(), p, levels=[0.5], colors='black', linewidths=2)
axes[1].scatter(X[:, 0].numpy(), X[:, 1].numpy(), c=y.numpy(),
                cmap='RdBu', s=12, marker='.', edgecolor='none')
axes[1].set_xlabel('x'); axes[1].set_ylabel('y')
axes[1].set_title(f' {deg}-degree polynomial')
axes[1].grid(alpha=0.3)
fig.colorbar(cf, ax=axes[1], label='P(y=1)')
fig.tight_layout()
plt.show()
```
