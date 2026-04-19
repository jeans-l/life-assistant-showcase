# Publishing Guide

这个目录已经按“可单独发布的 public showcase repo”整理完成。正式对外发布时，建议不要保留当前私有仓历史，而是把这个目录单独抽出为一个全新的仓库。

## 推荐仓库名

- `life-assistant-showcase`
- `ai-life-assistant`
- `life-assistant-case-study`

## 建议发布步骤

1. 将本目录完整复制到一个新的空目录
2. 在新目录初始化全新的 Git 仓库
3. 推送到新的 public repository
4. 将 `demo/` 部署到 GitHub Pages 或 Vercel
5. 把线上 demo 链接补回新仓库的 `README.md`

## 发布前检查

### 安全检查

- 没有原私有仓提交历史
- 没有内部脚本、环境探测脚本或 release runbook
- 没有真实 endpoint、token、secret 或 provider 配置
- 没有可回推出私有实现的细粒度路径和 contract

### 内容检查

- `README.md` 前两屏能说清楚这是什么、解决什么问题、当前做到哪一步
- `VISION.md`、`DEMO.md`、`ARCHITECTURE.md` 口径一致
- `demo/index.html` 在桌面和移动端都可读
- 所有图片和演示内容都使用展示素材或本地模拟数据

### 对外边界检查

- 仓库说明已经明确“核心实现与业务代码保留在私有仓”
- 许可说明已经明确“公开仓不是完整开源产品”
- 演示页没有出现需要私有服务才能跑通的路径

## 当前目录结构

```text
life-assistant-showcase/
├── README.md
├── VISION.md
├── DEMO.md
├── ARCHITECTURE.md
├── PUBLISHING.md
├── LICENSE.md
├── assets/
└── demo/
```

## 发布后的建议动作

- 在 README 顶部补一个真实的在线 demo 链接
- 如果有录屏或 GIF，可以替换或补充 `assets/` 中的静态图
- 如果对外需要更偏合作或投资语境，可在 README 的“当前状态”后面增加一段“下一阶段验证重点”
