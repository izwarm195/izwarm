---
title: "README"
slug: "text-to-audio/tools/readme"
description: "零 token 的确定性管线：抓取 → 分桶 → 写入「一周一卷」的周笔记 → （可选）发邮件。"
publishDate: "2026-10-29"
createdAt: "2026-10-29T00:00:00Z"
tags: ["text-to-audio"]
series: ["Text-to-Audio","tools"]
---

# 音频领域日更收集器（tools/）

零 token 的确定性管线：抓取 → 分桶 → 写入「一周一卷」的周笔记 → （可选）发邮件。
中文摘要不在这里生成——由 DSH 会话里读笔记后补写，或你贴进 DeepSeek 网页版。

## 文件

| 文件 | 作用 |
| --- | --- |
| `audio_news.py` | 主脚本，纯标准库，无第三方依赖 |
| `run_daily.bat` | 计划任务调用的入口（ASCII，避免 cmd 按 GBK 读中文乱码） |
| `register_task.bat` | 一次性注册计划任务 `AudioNewsDaily`（每天 08:30），双击即可 |
| `mail.example.json` | 邮件配置模板，复制成 `mail.json` 并填授权码后才会发信 |
| `audio_news_state.json` | 去重状态（已推送过的 uid），删掉就会重推 |
| `audio_news.log` | 每次运行的输出 |

## 数据源

1. **arXiv** `cs.SD` / `eess.AS` / `cs.MM` 新投稿（按 submittedDate 排序）
2. **HuggingFace Daily Papers**（社区挑选，带 upvote 数，噪声低）
3. **HF 新模型**：`text-to-audio` / `text-to-speech` / `audio-to-audio` / `text-to-music` /
   `audio-classification` / `ASR` / `VAD` / `audio-text-to-text` 八个 pipeline 标签，
   过滤掉量化/转格式仓库（GGUF、AWQ、4bit、MLX…）和零下载零赞的空仓库
4. **GitHub** 新仓库：`topic:text-to-audio` / `audio-generation` / `text-to-speech`（未认证限流，只打 3 次）

## 分桶（按 Audio-Omni 的任务版图，TTA / 编辑置顶）

TTA·音效生成 → 音频编辑 → 音乐生成/视频配乐 → 语音合成 TTS → 音频理解/描述 →
统一音频大模型 → 表征/对齐/Codec → 评测/数据集 → 安全/深伪/水印 → 其他音频（兜底）

- 关键词带词边界匹配，避免 `tts`/`asr`/`fad` 命中别的单词内部
- 主桶得分低于 `MIN_PRIMARY_SCORE`（9）不入桶
- arXiv 是音频全集，未归类论文进「其他音频」；HF 日榜/GitHub/HF 模型是全域数据源，没命中直接丢

## 输出

`News/AN <ISO周> (mm-dd~mm-dd).md`，一周一卷，每天追加一节 `## YYYY-MM-DD 周X`，
顶部「本卷日程」自动重建。同一天重跑会覆盖当天那一节。

## 常用命令

```powershell
python Text-to-Audio\tools\audio_news.py --dry-run        # 只打印不写文件
python Text-to-Audio\tools\audio_news.py --days 3         # 抓近 3 天
python Text-to-Audio\tools\audio_news.py --date 2026-10-28  # 补跑某天
schtasks /run /tn "AudioNewsDaily"                        # 立刻跑一次
schtasks /delete /tn "AudioNewsDaily" /f                  # 取消计划任务
```

## 邮件

`tools/mail.json` 已经按东南大学邮箱（网易企业邮）预填好，**只剩 `auth_code` 一项**：

```json
{
  "smtp_host": "smtp.qiye.163.com",
  "smtp_port": 465,
  "user": "213253670@seu.edu.cn",
  "auth_code": "客户端授权密码",
  "to": ["213253670@seu.edu.cn"]
}
```

- 东南大学邮箱 = 网易企业邮外包，证书只对 `*.qiye.163.com` 有效，
  用 `smtp.seu.edu.cn` 会报 `Hostname mismatch` —— 主机必须填 `smtp.qiye.163.com`。
- `auth_code` 必须是**客户端授权密码**，登录密码会被拒（服务端回 `535 5.7.0 ERR.LOGIN.REQCODE`）。
  去 https://mail.seu.edu.cn → 设置 → 客户端设置，开启 SMTP 并生成授权密码。
- 填好后验证一次：`python Text-to-Audio\tools\audio_news.py --test-mail`
  收到测试信说明配好了，此后每天 08:30 的日更会自动发到该地址。
- 留空或仍是占位符时，脚本只写笔记、跳过发信（不报错）。

## 环境注意

- **网络双路自适应**：脚本不假定「代理开着或没开」，而是**按域名分别探测**——
  arXiv / HuggingFace / GitHub 各自试一遍「直连 vs 代理」，哪条通就记住哪条，
  后续请求直接复用（`_HOST_ROUTE`）。代理没开时走直连；代理开着而直连被掐时自动走代理。
  候选代理：环境变量里的 `HTTPS_PROXY`、`127.0.0.1:7897`、`7890`、`10809`、`1080`。
- **抓取源报错会单独发告警邮件**（主题带 `⚠️ 抓取异常`），不再静默跳过。
  单纯 0 条不算故障——arXiv 周末/节假日不更新是正常的。
- `--days` 默认 **3**：arXiv 有发布延迟，给 3 天窗口才能覆盖到周末后的补发；
  重复条目由去重状态剔除。
- 计划任务若被安全软件拦，可手动双击 `register_task.bat`；或在任务计划程序里
  新建「每天 08:30 运行 run_daily.bat」。
- 本机 `HTTP_PROXY`/`HTTPS_PROXY` 指向 127.0.0.1:7897 但代理**不一定在跑**，
  脚本开头清掉代理环境变量，改由自己的探测决定走哪条路。

