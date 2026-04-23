# Demo Walkthrough

> Source lineage
> - 主源：主项目 `生活助理/demo/**`
> - 补源：`生活助理/docs/ui-ux/**`
> - 补源：`生活助理/docs/prd/mvp-alignment-checklist.md`

## 1. 这套 public demo 是什么

这个仓库里的 demo，不是重新发明的一套营销页，而是从主项目当前静态 preview 中抽出来的 public-safe 版本。

它的任务只有一个：把主项目已经明确在验证的产品证明链，做成可以直接打开、直接理解、直接演示的静态页面。

入口见：

- [Public Demo Navigator](./demo/index.html)

## 2. 当前保留的三条公开链路

### 2.1 Onboarding Preview

文件：

- [demo/preview-onboarding.html](./demo/preview-onboarding.html)

它证明的是：

- 首次进入先建立关系与最小激活
- 用户先认识 assistant，再开始最小建档
- 模型能力可以后置开启，而不是把首次接入做成技术配置流程

### 2.2 App Shell Preview

文件：

- [demo/preview-app-tabs.html](./demo/preview-app-tabs.html)

它证明的是：

- 正式舞台是 `今天 / 日程 / 角色 / 我的 + 全局 assistant`
- `Today` 页不是信息流，而是当前事项的承接面
- assistant 不是一级导航页，而是跨页统一辅助层

### 2.3 Lunch Workbench Preview

文件：

- [demo/preview-lunch-flow.html](./demo/preview-lunch-flow.html)

它证明的是：

- 默认方案不是一句回复，而是一个可继续推进的工作台起点
- 候选切换、继续追问和状态修改都在同一个场景里发生
- 领域 skill 的结果必须回到 assistant 的治理与承接链里

## 3. 本地 seed 数据来自哪里

午餐工作台当前读取：

- [demo/local-seeds/meal/library.json](./demo/local-seeds/meal/library.json)

这份数据是从主项目 `local-seeds/meal/library.json` 抽取过来的 public 静态 seed。它只服务于公开演示，不代表真实外部平台接入，也不承诺实时库存、真实 ETA 或真实履约状态。

## 4. 推荐怎么演示

最顺的讲法是：

1. 先讲愿景：为什么 AI 不该只停留在搜索与推荐
2. 再讲产品：为什么生活助理不是聊天壳，而是关系建立、注意力收束和默认决策承接
3. 最后按顺序打开三条链路：
   - Onboarding：关系建立
   - App Shell：正式舞台
   - Lunch Workbench：默认方案如何被看见、被修改、被继续推进

## 5. 演示边界

当前 public demo 明确不展示：

- 主项目正式 React runtime
- 本地 fresh-install 与 demo bootstrap 的实现链路
- 真实 provider、外部履约、私有 contract 或调试工作台

它展示的，是主项目当前最值得对外解释的那部分产品形态：体验结构、信息架构、默认方案承接方式，以及公开可讨论的治理边界。
