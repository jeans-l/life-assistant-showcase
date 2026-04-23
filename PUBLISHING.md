# Publishing Guide

> Source lineage
> - 主源：主项目 `生活助理/README.md`
> - 补源：`生活助理/docs/prd/v1-commitment-and-non-goals.md`
> - 补源：`生活助理/docs/architecture/development-plan-local-delivery.md`

## 1. 仓库定位

这个目录现在应被理解为：

**从主项目 `生活助理` 抽出的 public showcase 仓。**

它不是完整开源主仓，也不是正式实现分发仓。它只保留三类 public-safe 内容：

- 愿景与产品判断
- Harness 与治理边界的高层架构表达
- 来自主项目最新静态 preview 的公开 demo

## 2. 推荐发布方式

最简单的发布方式是：

1. 将当前目录作为独立 public repo 发布
2. 使用 GitHub Pages 托管 `main` 分支根目录
3. 让 `demo/index.html` 成为对外 demo 入口
4. 在仓库首页 `README.md` 中放出文档与 demo 的统一导航

如果后续需要更强的托管能力，也可以把整个目录部署到 Vercel，但当前仓库本质上仍是纯静态站点。

## 3. 发布前检查

### 安全与边界

- 没有主项目私有提交历史
- 没有真实 provider 凭据、真实 endpoint 或调试工作台入口
- 没有正式 runtime contract、内部 schema、仓库实现映射或 release runbook 细节
- demo 链接全部为静态相对路径，不依赖主项目本地实现入口

### 内容一致性

- `README.md`、`VISION.md`、`PRODUCT.md`、`ARCHITECTURE.md`、`DEMO.md` 都能追溯到主项目源文档
- 文档分工清晰：`README` 讲整体，`VISION` 讲愿景，`PRODUCT` 讲当前产品，`ARCHITECTURE` 讲 Harness，`DEMO` 讲公开演示
- `demo/index.html`、`preview-onboarding.html`、`preview-app-tabs.html`、`preview-lunch-flow.html` 都可独立打开

### 静态演示

- `preview-lunch-flow.html` 能正确读取 `demo/local-seeds/meal/library.json`
- 所有 preview 页面不依赖主项目 runtime
- `preview-reset.html` 的回跳与 target 都指向当前仓库内页面

## 4. 发布后应承诺什么

这个仓库当前对外只能承诺：

- 有一套可公开阅读的产品与架构叙事
- 有一组来自主项目的静态 preview，能帮助理解当前产品形态
- 有一份 public-safe 本地 seed 数据，用于说明午餐工作台如何组织默认方案

这个仓库当前不应承诺：

- 完整可运行产品
- 真实外部执行链路
- 多端同步、系统级 push、全场景 agent 能力或高风险决策自动化

## 5. 后续增强

后续如果你提供真实截图或录屏，优先替换 `README.md` 的主视觉和 demo 文档里的说明素材；但在没有截图之前，仍应以可打开的静态 preview 页面作为第一展示材料，而不是再退回旧 SVG 占位。
