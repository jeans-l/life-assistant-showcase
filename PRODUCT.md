# Product

> Source lineage
> - 主源：主项目 `生活助理/docs/prd/mvp-assistant/mvp-assistant-prd.md`
> - 补源：`生活助理/docs/prd/README.md`
> - 补源：`生活助理/docs/prd/onboarding/README.md`
> - 补源：`生活助理/docs/prd/assistant-daily-companion-flow.md`

## 1. 当前产品是什么

生活助理当前公开展示的，不是一个“万能 AI”，而是一个基于 memory 的个人 AI 决策助手原型。

它要验证的核心命题不是“聊天更像人”，而是：

**用户是否愿意把高频、低风险、重复性的生活决策委托给 AI 助理。**

这一定义直接来自主项目 PRD。也正因为如此，当前产品的重心不是炫技，而是默认方案是否足够稳、结果是否足够可承接、治理边界是否足够清楚。

## 2. 当前 MVP 范围

主项目当前把 MVP 范围收敛为四个部分：

- `assistant`：统一入口、统一协调层、统一收口层
- `MealSkill`：吃什么，验证高频、低风险、可执行的默认决策
- `NewsSkill`：看什么，验证信息筛选能否从推荐提升到主动摘要
- `LearningSkill`：学什么，验证长周期任务能否形成持续推进与补偿调整

这也是为什么 public showcase 只展示最能代表主链的体验，而不试图列一堆功能清单。

## 3. 用户如何进入这个产品

主项目把用户进入产品的链路拆成了三个清楚的阶段：

1. `Onboarding`：完成首次激活、最小建档与关系建立
2. `App Shell`：进入 `今天 / 日程 / 角色 / 我的 + 全局 assistant` 的正式舞台
3. `可服务状态`：完成模型接入后，assistant 才真正进入可以持续判断、默认承接和推进的状态

这里的关键不是“首登收多少资料”，而是先把用户与 assistant 的关系建立起来，并区分“进入 app 壳层”与“assistant 真正可服务”这两个阶段。

## 4. 三段产品证明链

### 4.1 Relationship Before Configuration

Onboarding 证明的不是“资料收集能力”，而是关系建立能力。

用户第一次进入时，不应该先面对一张巨大的配置表，而应该先和一个有明确身份的 assistant 完成最小关系建立：你是谁、你在哪里、你的节奏怎样、我该如何和你配合。

对应公开预览页：

- [Onboarding Preview](./demo/preview-onboarding.html)

### 4.2 Focus Before Information Overload

`Today` 页证明的不是“信息组织能力”，而是注意力收束能力。

一个合格的生活助理首页，不应该把所有模块平铺给用户自己整理，而应该先把当前最该被接住的一件事放到前台。只有当用户需要改条件、补约束或重新判断时，系统才升级到更复杂的 assistant 承接。

对应公开预览页：

- [App Shell Preview](./demo/preview-app-tabs.html)

### 4.3 Decision Workbench Before Endless Chat

午餐工作台证明的不是“会不会给建议”，而是“默认方案能不能成为可继续推进的起点”。

主项目在这里验证的，是一个生活场景进入 domain skill 之后，如何把默认方案、候选切换、继续追问和后续承接放到同一个工作台里，而不是散成一串无法治理的聊天回复。

对应公开预览页：

- [Lunch Workbench Preview](./demo/preview-lunch-flow.html)

## 5. 当前产品为什么不是聊天壳

主项目 PRD 和 UI 规范都反复强调同一件事：生活助理不是聊天首页，不是信息流，也不是插件市场。

当前产品之所以成立，是因为它至少同时保留了这几层分工：

- assistant 负责“要不要做、什么时候做、结果怎么承接”
- skill 负责“进入这个领域之后，默认方案怎么形成”
- App 负责“把结果接到页面里，让用户可以继续、修改、确认或回看”

这就是为什么当前 public demo 的重点不是聊天录屏，而是 Onboarding、Today、Lunch Workbench 这三条正式产品路径。

## 6. 当前公开 demo 在证明什么

当前 public demo 对应的是主项目已经明确在做的第一阶段验证：

- 能否建立关系，而不是只建立配置
- 能否先收束当前事项，而不是堆叠信息
- 能否把默认方案做成工作台，而不是一次性回答

它不证明：

- 完整全场景能力覆盖
- 真实 provider 接入与履约执行
- 正式 runtime contract 与私有实现细节

因此，public demo 的任务不是“替代正式产品”，而是把主项目已经收敛清楚的产品命题，以可浏览的静态形式公开出来。
