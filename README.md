# Life Assistant Showcase

> 一个基于记忆的个人 AI 决策助手 public showcase，尝试把 AI 从 `search / recommend` 推进一步，变成对日常生活决策与执行的默认承接。

> Source lineage
> - 主体内容收敛自主项目 `生活助理` 的 `docs/prd/README.md`、`docs/prd/vision.md`、`docs/prd/v1-commitment-and-non-goals.md` 与 `docs/ui-ux/app-设计规范.md`
> - 静态预览页直接来自主项目 `demo/**`
> - 本仓只保留 public-safe 的产品、架构与 demo 表达，不包含正式 runtime 实现

[Demo Navigator](./demo/index.html) · [Vision](./VISION.md) · [Product](./PRODUCT.md) · [Architecture](./ARCHITECTURE.md) · [Demo Notes](./DEMO.md)

## 一句话愿景

生活助理想做的不是一个更会聊天的 AI，而是一个真正面向个人生活的助理系统：长期理解你，在合适的时间给出默认方案，在治理边界成立时继续承接执行与写回。

## 为什么这件事成立

过去二十年，软件把“获取信息”和“获得选项”做得越来越高效，但普通人的决策负担并没有一起下降。真正持续消耗精力的，往往不是信息不存在，而是选项太多、约束太碎、事情太频繁，导致日常判断本身变成了负担。

主项目的核心判断很明确：AI 的下一阶段，不应该只停留在 `search / recommend`，而应该进一步进入 `decision-making / execution`。从这个角度看，生活助理不是在做一个更强的聊天入口，而是在尝试把“持续获得专业判断”这件事，从少数人的昂贵配置变成大众可获得的基础设施。

## 当前产品证明链

当前 public showcase 不讲“全场景 AI 生活自动化”，只讲主项目已经明确在验证的三段证明链：

1. [Onboarding Preview](./demo/preview-onboarding.html)：先建立关系与最小激活，而不是先把用户扔进一张长配置表。
2. [App Shell Preview](./demo/preview-app-tabs.html)：`今天 / 日程 / 角色 / 我的 + 全局 assistant` 共同组成正式舞台，其中 `Today` 负责先接住当下最该处理的一件事。
3. [Lunch Workbench Preview](./demo/preview-lunch-flow.html)：默认方案、候选切换、继续追问和后续承接落在同一个工作台，而不是散落在一串聊天气泡里。

这三段链路共同回答的是：关系如何建立、注意力如何收束、默认决策如何被看见和继续推进。

## Harness 摘要

主项目的系统成立方式，不是“一个超级聊天框 + 若干调用”，而是一个有明确治理边界的 Harness：

- assistant 是宿主与治理层，负责路由、上下文装配、结果采纳、正式写回与 surface 承接。
- skill 是领域能力包，负责进入某个生活领域之后如何形成默认方案、备选方案和解释。
- provider 是外部能力来源，回答“外部能提供什么候选、能执行什么、能回流什么状态”，不是新的智能主语。
- 正式写回主权只发生在 governed writeback，也就是主项目文档里的 `writeback_decision`。

这也是为什么生活助理反复强调“它不是聊天首页，不是信息流，也不是插件市场”。更多见 [ARCHITECTURE.md](./ARCHITECTURE.md)。

## Try The Demo

- [Public Demo Navigator](./demo/index.html)
- [Onboarding Preview](./demo/preview-onboarding.html)
- [App Shell Preview](./demo/preview-app-tabs.html)
- [Lunch Workbench Preview](./demo/preview-lunch-flow.html)
- [Demo Walkthrough](./DEMO.md)

## Public Boundary

这个仓库包含：

- 从主项目抽取后的愿景、产品和架构 public 叙事
- 来自主项目最新静态 preview 的对外演示页
- 一份用于午餐工作台演示的本地 seed 数据 `demo/local-seeds/meal/library.json`

这个仓库不包含：

- 完整业务源码与运行时实现
- 私有 provider、正式 contract、内部 schema、仓库路径映射或调试工作台
- 任何依赖私有环境才能跑通的后端链路

## 视觉说明

本仓当前优先保留“可打开的静态 preview 页面”，而不是用旧 SVG 假装真实产品截图。后续如果补入正式截图，会优先替换 README 主视觉；在此之前，`demo/*.html` 才是最贴近主项目当前表达的公开视觉材料。
