---
title: "Transformer 视频演示 prompt"
slug: "machine-and-deep-learning/nndl/transformer-video-prompt"
description: "使用 Manim 绘制可视化动画。"
publishDate: "2026-10-14"
createdAt: "2026-10-14T00:00:00Z"
updatedDate: "2026-10-17T18:15:58"
tags: ["machine-learning"]
series: ["Machine & Deep Learning","NNDL"]
---

使用 Manim 绘制可视化动画。
- 画布形状：16：9
- 背景透明，白字白线，主题色青绿色。
- 原则：慢速、少文字、无中文、严格遵循代码顺序。

- 主要由【可视化】和【代码展示】组成，两个组分分别采取统一风格。
- 整体风格请参考 Style；源代码请参考 [NNDL 26-10-13 手写 Transformer](/notes/machine-and-deep-learning/nndl/26-10-13-transformer/)
- 所有显示隐藏为淡入淡出

- 每个部分的可视化/代码展示 分别存储为独立视频，存放在Drafts\Transformer\Manim。

# 视频细节（由多个视频组成，先生成独立视频）
- Data（视频一）
  - 数据集展示
    - 显示一个代码块，其中从慢到快滚动数据集，滚动过程中淡出，不少于 5 秒。
  - pairs -> chars & string to ids -> encode/decode -> make_batch 可视化动画
  - 代码展示
- Model（视频二）
  - 屏幕右侧展示Transformer 架构（经典论文图，但是三个 attention 改成代码里的命名）
    - 初始架构图为未激活状态，各模块皆为白色圆角线框勾勒。
    - 主题色框出三个 attention -> 三个 attention 渐变合并(一个框内，Self/Causal/Cross)，合并框移至屏幕左侧剩余位置正上方，下方留空进行 attention 可视化。
  - attention 可视化：
    - Selfattention 部分
      - 纵向滑动展示可视化。
        - 首先，前面合并框的 Self 字体变成主题色
        - 采用立方体表示\[B,L,D]形状的 X，箭头+文字(.transpose(...)等)
        - X -> QKV —各种变形每一次都要画，立方体转置、切分、拼接等，view 到四维时，展示多个 head 堆叠即可—>att -> y
      - 展示 SelfAttention 代码
      - 代码块复制一份收缩至 SelfAttention 块，此块转为激活状态，为白色填充圆角矩形，中间文字部分为透明。
    - Caucal 部分
      - 刚才的SelfAttention代码块还在左侧
      - SelfAttention 代码渐变为 Causal 代码，并突出显示差异，上方高亮渐变为 Causal
      - 代码块收缩至 CausalAttention 块并隐藏，此块转为激活状态，为白色填充圆角矩形，中间文字部分为透明。
  - Add&Norm, FFN
    - 左上角的Self/Causal/Cross 框隐藏
    - 同时主题色框出Add&Norm, FFN 模块，Add&Norm 融为左边子块，FFN 融为中间子块，即除架构图剩余部分的左右两块
    - 左右子块同时展示两个模块的架构图，动画从输入到输出，可参考之前画的 LSTM。左 Add&Norm, 右FFN
    - 架构图隐藏，同时显示代码，左 Add&Norm, 右FFN
    - 代码块收缩至 Add&Norm, FFN块（同时显示架构图），此块转为激活状态，为白色填充圆角矩形，中间文字部分为透明。
  - EncoderBlock
    - 直接展示代码，依次高亮对应代码以及架构图部分
    - 隐藏除“EncoderBlock”的代码
    - 显示 Transformer 部分代码，具体为
      - class Transformer(nn.Module):
      -     def __init__(...
      -         self.enc_blocks = nn.ModuleList([EncoderBlock(n_embd,n_head) for _ in range(n_layer)])
      - def encode_src 的全部内容
      - 其余用省略号表示
    - “EncoderBlock”先移至代码中的位置，再显示 以上代码。
    - 依次高亮 encode_src 中的内容，对应高亮架构图中的内容，最终高亮 self.ln_enc(x), 同时在 encodeblock 对应输出位置显示一个高亮的 self.ln_enc(x)，并将其变为 “memory”
  - CrossAttention
    - 左侧代码块隐藏
    - 显示先前的上框下 SelfAttention 代码块
    - 代码渐变为 Cross 代码，并突出显示差异，上方高亮渐变为 Cross
    - 高亮代码中以及之前显示在架构图上的“memory”
    - 依次高亮 cross 代码内容，同时memory 逐渐移至并融入 cross 块
    - 代码块收缩至 CrossAttention 块并隐藏，此块转为激活状态，为白色填充圆角矩形，中间文字部分为透明。
  - DecoderBlock
    - 同 EncoderBlock，只不过没有 memory
  - Transformer
    - 展示 Transformer 代码，init 部分用省略号表示
    - 依次高亮 forward 中的内容，对应高亮架构图中的内容，最终到 Softmax -> Output
    - 显示一个 Output 矩阵，它最初是三维的，随后转到单个 batch 的二维矩阵，矩阵下方对应字符以及 EOS。

# Review
## Review 1
- Review 1：目前效果很乱，痛点是：
  1. 整体比例失衡应适当缩小相应组分，缩小字体
  2. 不要画类似“2.Data”之类的东西
  3. 可视化的时候 不要放代码，最多写个函数名，不然我搞可视化干嘛？
  4. 青绿色应再亮一点
  5. 代码块，行距太小。请调整并增加小幅度的颜色区分
  6. 非代码英文，使用 CMU serif，中文用宋体
  7. 所有相似地位的代码块，应当保持位置形状大小统一，并且代码自动换行。
  8. 注意对齐！
- D
  - 1
    - 长句子和中文重叠，应整体缩小字体
    - 视频开始的时候，素材文字溢出了，没被遮罩
    - 淡出的时候应继续滚动，视频中停了
  - 合并 2，3 并重绘
    - 首先，“有道理”渲染成了正方形
    - 其次，不展示“make_pairs”等标题
    - 右半边代码块，左半边可视化，保证结构对齐
    - 具体流程：
      - 原数据集 -> pairs：
        - 左边：中文…，英文… （多行，撑满左边，省略号用于对齐，不够的补，超过的省）-> \[中文…，英文…]
        - 右边：在左边变幻的时候，显示 make_pairs 代码
      - pairs + ids
        - 左边：
          - 刚刚的数据集，变换成两个 chars，每个 chars 显示三行（自动换行），两个 chars 之间的空挡应大于行距，位于左边正中间
          - 两个 chars 只显示一行，并在每个字符元素下方显示 id
          - 两个 chars 上移，下方显示 PAD 等以及他们的 id
          - PAD 等隐藏，两个 chars 变换为 stoi 对应的字典
        - 右边：
          - 代码块不变，之前的代码隐藏
          - 上面四步，每一步显示对应的代码。
      - encode/decode
        - 左边：
          - 之前的三个编解码，从上到下依次展示，字符和数字对齐，不使用箭头
          - 细节：例如“what?”，先显示 what，然后在其偏右下的位置显示 encode_src，然后在下方显示数字。显示数字的方式是，what 字符复制一份变换到对应的数字。三个部分应保持数值距离相同
        - 右边：依次展示对应的代码
      - make_batch
        - 左边：
          - 显示开始时的原数据 pairs
          - pairs 压缩到单个 pair，并移至左半部分的上方
          - 下方显示三个空矩阵
          - 填充 PAD
          - 上方 pair，对应的部分，按字加入下方的三个空矩阵，此时中文字应当是同时分身加入 target in/out
          - to device 部分，左边上层显示一个 GPU 图标，半透明，片刻后隐藏
        - 右边：
          - 逐步显示对应的代码
          - 最后 to device
- M：先把右边的图优化，现在非常丑。由于之前提到，整体缩小比例，现在右边的图请你参考 [NNDL 26-10-13 手写 Transformer](/notes/machine-and-deep-learning/nndl/26-10-13-transformer/) 开头的那个图做，争取尽量还原，尤其是那些箭头，和边框等粗且圆润。

## Review 2
- Review 2
- D：整体调整：1、相同的代码块内，代码显示后不必隐藏；2、左右部分各加一个底板，参考 izwarm.top；
  - 1
    - 数据集没有淡入
    - 滚动看起来有点卡
  - 2
    - pairs：数据集和代码一起消失，即延长数据集显示时间
    - chars：你选择了部分，但是随机 id 会迷惑人。
      - 现在改为：全部从 4，显示 456，省略号，显示中间的，省略号。
      - 方框窄一点，字符多一点
      - 代码部分，和 size 一起显示
    - chars -> stoi：37 s 之后，直接跳过到 encode_src
    - 1:24 ：元组渐变到后面的格子而非淡出淡入，并且后面的两句话放同一行
    - gpu 图标是覆盖下面三行的，置于上层，而非“上方”
- M：整体调整：1、架构图全部白线，不上色，线再细一点，框中字小一点并居中；2、左右部分各加一个底板，参考 izwarm.top；3、一个模块激活之后，后面一直是激活状态；4、激活状态和原模块应当完全重合，现在表现为两个不一样大的叠在一起；5、代码高亮普遍有问题，似乎普遍往后高亮了几个词
  - 1
    - self/causal/cross 框，应位于左边底板水平居中位置，下同。
  - 2
    - 长方体不够圆润，且有线穿过字母
    - 向上滚动时，靠近上方框的部分加透明度，和前面的数据集滚动一样
    - 具体内容，尽量往我画的这个靠（忽略右上角的门电路）
      ![6c0edf0c9341828cb83f2b09212f7b3f_720.png](https://s3.su.bcebos.com/izwarm-obsidian/2026/10/8372237abdf28aa8bf9466bb3c2c6112.png)

  - 3
    - 左边代码位置偏下，请居中
    - 是渐变而不是淡出淡入
  - 4
    - 这部分隐藏上述底板
    - add&norm 在架构图中框出来的五个框，应同时放大至左边的大框并完全重合；FFN 同理
  - add&norm 的代码，仅显示一个 nn.LayerNorm
  - 5
    - return self.ln_enc(x)那里，复制一个 self.ln_enc(x) 移到右边，再变为 memory
  - 6
    - 同样是渐变而不是淡出淡入
  - 7
    - 激活有误，应该是激活 decoderblock 的外框
  - 8
    - 激活有误，最后的时候，几乎所有变为主题色，激活时，全部变成白色填充

## Review 3
- D
  - 1
    - 没有滚动
  - 2
    - 代码不应紧贴左右边线
    - 0：24 左右应同时隐藏
    - 修改：刚刚显示的代码保持正常，同一块代码中不在这轮显示的，渐变为灰色
- M：架构图线再细一点
  - 2
    - 立方体角上有瑕疵
  - 3
    - self 的 code 展示完之后，应复制一份激活 Self 块。激活方式同 causal
  - 4
    - self、causal 都应处于激活状态，这里没画
  - 后面都是激活的问题

## Review 4
- D
  - 1：开始滚动的时候会卡一下
- M
  - 整体调整：
    - 统一代码字体大小，代码占左区域，应在下图红色框范围内：![image.png](https://s3.su.bcebos.com/izwarm-obsidian/2026/10/bb0c4ccebadfe314da523412a2120c41.png)
    - 保证代码左侧对齐红框左侧，代码右侧自动换行。
    - 架构图：箭头的三角缩小一倍。
  - 2：
    - QKV 下方只显示了 QKV 其中一个，这有点误导，修改：
      - view 和 transpose 那两个图，整体左移和上面的 Q 对齐，并添加 Q -> view -> transpose 的箭头，箭头不应太细
      - 右边用 -> K,V -> K,V 的文字表示
    - matmul 和 softmax，改成数学公式。一个三合一箭头由QKV 引出连接其上方，下方箭头引出 proj 部分。 
  - 4：0：26，两个代码不应隐藏后再显示，而是直接融入对应模块。
