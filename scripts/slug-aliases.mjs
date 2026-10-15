/**
 * URL 段落别名表：vault 里的中文段落 → 站内 URL 用的 ASCII 代号。
 *
 * 为什么需要：`slugify()` 保留 `\p{L}`（中文），而浏览器把每个中文字符百分号编码成 9 个字符，
 * 于是 `signals/数字电路与系统/第3章-逻辑函数及其简化` 会变成 168 字符的 URL。
 * 本站要的是短、稳定、纯 ASCII 的路径，所以中文段落在这里统一换成代号。
 *
 * 键 = **原文段落**（笔记标题或目录名，一字不差，包括 `&`、`（）`、全角引号）。
 * 值 = URL 片段，只允许小写字母 / 数字 / 连字符（selftest 会校验）。
 * 章节类（`第3章 …` / `第九章 …` / `附录`）由 sync-obsidian.mjs 的规则自动处理，**不要写在这里**；
 * 表里的键优先于规则，所以想让某一章自定义（如 `ch9-oscillation`）也可以直接写一行覆盖。
 *
 * 命名风格：短、可读、全小写连字符；目录里已经写明的信息不重复（`nndl/` 下的笔记不再带 `nndl-` 前缀）。
 * 新增笔记若含中文却没进这张表，同步脚本会在结尾用 warn 把段落原文列出来，照着补一行即可。
 */
export const SEGMENT_ALIASES = {
  // ---- 目录 ----
  '数字电路与系统': 'dcs',

  // ---- 数字电路与系统 ----
  '《数字电路与系统》李文渊第2版 习题&解答': 'dcs-exercises',

  // ---- 复变函数（Complex）----
  // 笔记被改名成「复变函数 - 第一次作业」后，标题里多了前缀，URL 仍保持原来的 assignment-1
  '复变函数 - 第一次作业': 'assignment-1',
  '第一次作业': 'assignment-1',

  // ---- 信号与系统 ----
  'Signals & System 总目录': 'toc',
  '信号与系统阅读随记': 'reading-notes',

  // ---- 物理 ----
  '《物理学》下册公式总结': 'formulas-vol2',

  // ---- 机器学习 / 深度学习（目录已经是 nndl/，故不再重复前缀）----
  'NNDL 26-09-03 Logistic回归练习': '26-09-03-logistic',
  'NNDL 26-09-08 前馈神经网络练习（第一部分）': '26-09-08-fnn-1',
  'NNDL 26-09-08 前馈神经网络练习（第二部分）': '26-09-08-fnn-2',
  'NNDL 26-09-16 卷积神经网络练习': '26-09-16-cnn',
  'NNDL 26-09-26 循环神经网络练习': '26-09-26-rnn',
  'NNDL 26-10-13 手写 Transformer': '26-10-13-transformer',

  // ---- Python / Numpy / Pandas ----
  // Python 下分了三个子系列目录（Numpy Things / Pandas / Python 杂记，见 vault 的 MOC）：
  // 「Numpy Things」与「Pandas」本身就是 ASCII，不用别名；只有「Python 杂记」要一个短代号。
  'Python 杂记': 'misc',
  'Numpy 函数汇总': 'numpy-functions',
  'Numpy 对话总结 I': 'numpy-dialogue-i',
  'Numpy 对话总结 II': 'numpy-dialogue-ii',
  'Numpy 综合案例': 'numpy-examples',
  'Numpy, Scipy 复数总结': 'numpy-scipy-complex',
  'Pandas 函数汇总': 'pandas-functions',
  'Pandas 对话总结': 'pandas-dialogue',
  'Tensor & Numpy 函数对比': 'tensor-numpy-compare',
  // 杂记按 vault 的编号命名（Python 杂记 01 - …），目录已经叫 misc/，文件名不再重复前缀
  'Python 杂记 01 - fromfunction 与可变参数': '01-fromfunction',
  'Python 杂记 02 - assert 与 tensor.uniform_': '02-assert-uniform',
  'Python 杂记 03 - plt.xlabel 报错与 hasattr': '03-plt-xlabel-hasattr',
  'Python 杂记 04 - torch.cat 与 torch.stack': '04-cat-stack',
  'Python 杂记 05 - torch.squeeze 与转置': '05-squeeze-transpose',
  'Python 杂记 06 - functools.partial 与 randperm': '06-partial-randperm',
  'Python 杂记 07 - nn.Sequential 与 flatten': '07-sequential-flatten',
  'Python 杂记 08 - pathlib 与 os': '08-pathlib-os',
  'Python 杂记 09 - Path 常用方法': '09-path-methods',
  'Python 杂记 10 - ignore_index(-100) 与 CrossEntropy': '10-ignore-index',
  'Python 杂记 11 - register_buffer': '11-register-buffer',

  // ---- 英语 ----
  '数学英语词汇': 'math-vocab',

  // ---- C++ 基础（二级）----
  '二级C++上机综合案例三例': 'c2-exam-cases',
  '二级C++选择题公共基础知识速补': 'c2-basics',

  // ---- C++ 例题 ----
  '去旅行': 'travel',
  '数字反转': 'reverse-number',
  '完全平方数计数': 'count-perfect-squares',
  '合并两个有序数组': 'merge-sorted-arrays',
  '求第 n 位数字': 'nth-digit',
  '禁止在int乘int时不开long long': 'int-mul-overflow',
  '复古游戏的“背包消耗”算法': 'retro-game-inventory',
  '温度转换': 'temperature-conversion',
  '星际探测器状态引擎': 'probe-state-engine',
  '智能网关数据解析器': 'gateway-parser',

  // ---- C++ 技巧 ----
  '位运算': 'bitwise',
  '逗号表达式': 'comma-operator',
};
