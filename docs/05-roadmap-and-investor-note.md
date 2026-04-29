# 05｜Roadmap & Investor Note

> 这份文档用于说明项目路线、阶段验证目标和对外叙事。它面向潜在用户、开发者、投资人和合作者。

## 1. 项目定位

生活助理不是一个垂直生活工具，而是一个 AI-native personal assistant prototype。

它要探索的是：

> AI 是否能成为个人生活中的决策基础设施，而不只是聊天入口或信息工具。

核心机会不是“再做一个 chatbot”，而是把高频、低风险、重复性的生活决策逐步交给 AI，形成一个用户可控、可反馈、可学习的个人助理系统。

## 2. 为什么现在值得做

过去的互联网产品主要解决信息连接和供需匹配问题。

AI 之后，下一层变化是：

```text
Search / Recommend
→ Decision-making / Execution
```

当供给和信息越来越丰富，用户真正稀缺的是判断力、精力和连续执行能力。

个人生活助理的长期价值在于：

1. 理解用户长期偏好。
2. 结合当天状态和环境。
3. 在具体场景中给出默认决策。
4. 在低风险任务上推进执行。
5. 从反馈中持续学习。

## 3. MVP 验证命题

MVP 不验证全场景 AI agent。

MVP 只验证一个更具体的问题：

> 用户是否愿意把高频、低风险、重复性的生活决策委托给 AI 助理做默认判断？

首个核心场景选择“吃什么 / 午餐决策”，原因是：

1. 高频：几乎每天发生。
2. 低风险：错误成本相对可控。
3. 重复性强：适合从反馈中学习。
4. 决策成本真实存在：用户经常不知道吃什么。
5. 容易连接外部服务：外卖、餐厅、配送状态。

## 4. 阶段规划

### P0：核心闭环验证

目标：证明产品主链成立。

范围：

```text
NOW 当前事项
日程时间结构
角色 / Skill 管理
我的 / Memory 与设置
全局 assistant 半屏 / 全屏
饮食助手主链路
Demo 数据与本地状态写回
```

验收标准：

1. 用户能看到当前事项。
2. 用户能接受或调整默认方案。
3. 用户能从日程进入 assistant 修改事件。
4. 用户能设置并启用 Skill。
5. 用户能查看最近判断并反馈。
6. 结果能写回页面。

不做：

```text
真实下单
复杂 Skill 市场
完整外部服务生态
常驻后台 agent
高风险自动代理
```

### P1：增强 Skill 与服务接入

目标：验证更多生活场景是否适合默认决策。

范围：

```text
更完整 MealSkill
NewsSkill 主动摘要
LearningSkill 学习计划
模型服务接入优化
外部服务状态管理
日程冲突处理增强
最近判断和反馈闭环增强
```

关键问题：

1. 不同 Skill 是否能复用同一套 assistant runtime？
2. 用户是否理解 Skill 是能力模块，而不是人格角色？
3. 反馈是否能提升后续判断稳定性？

### P2：扩展平台化

目标：从单 App 原型走向可扩展 assistant platform。

范围：

```text
Skill marketplace
Remote hosted skill
Provider ecosystem
Minimal control plane
Cross-skill insight
Advanced memory correction
Personal automation workflows
```

关键问题：

1. Skill 能否通过 manifest 方式外部分发？
2. 第三方能力能否接入但不破坏 assistant 主权？
3. Memory、Item 和 Writeback 能否成为稳定平台层？

## 5. 关键指标

### MVP 产品指标

```text
默认方案接受率
调整率
拒绝率
反馈完成率
重复使用率
次日留存
```

### Skill 级指标

MealSkill：

```text
午餐默认建议接受率
持续拒绝率
反馈闭环完成率
推荐后调整次数
```

NewsSkill：

```text
阅读完成率
摘要满意度
主题调整率
```

LearningSkill：

```text
任务完成率
阶段进度达成率
计划调整率
```

### 系统指标

```text
writeback 成功率
return sync 成功率
memory 候选提升准确率
用户纠错率
权限 / 服务阻断率
```

## 6. 对用户的叙事

用户不需要理解 runtime、writeback、manifest。

对用户来说，一句话是：

> 这是一个会慢慢了解你、在合适时间帮你做生活决策的 AI 助理。

用户价值：

1. 少做重复选择。
2. 少解释自己的偏好。
3. 当前事项更清楚。
4. 重要判断有依据。
5. 反馈后系统会变好。

## 7. 对开发者的叙事

对开发者来说，这个项目是一个 AI-native app 架构参考。

它展示如何把以下能力组织在一起：

```text
Memory
Item
Schedule
Skill
Provider
Runtime
Writeback
Projection
```

开发者可以关注：

1. 如何做统一 assistant runtime。
2. 如何设计可治理 Skill。
3. 如何管理 memory load / writeback policy。
4. 如何让 AI 结果写回页面而不是停留在 Chat。
5. 如何设计可扩展 provider 和 skill container。

## 8. 对投资人的叙事

对投资人来说，这不是一个餐食推荐 App，也不是一个日程工具。

这是一个更大的方向：

> AI as decision infrastructure for personal life.

短期从午餐、资讯、学习等低风险高频场景切入；长期扩展到买什么、健身、出行、家庭管理、专业咨询等更多个人决策场景。

核心壁垒不只是模型能力，而是：

1. 用户长期记忆和偏好沉淀。
2. 事项级生活结构承接。
3. 受治理的默认决策链路。
4. Skill / Provider 扩展体系。
5. 用户反馈驱动的持续学习。

## 9. 风险与边界

当前阶段需要克制：

1. 不做高风险自动代理。
2. 不伪装真实外部执行。
3. 不把模型推断直接写成长期记忆。
4. 不把所有功能塞进 Chat。
5. 不把 Skill 做成互相抢主权的人格。

真正的产品信任来自：

```text
默认给结果
关键处确认
失败可解释
用户能纠正
长期可回退
```

## 10. 开源 / GitHub 展示策略

GitHub 项目不应只展示代码，而要展示完整产品判断：

```text
Vision：为什么做
Product Thesis：为什么不是聊天 App
Demo：主链路如何成立
UX：页面如何承接
Architecture：长期如何扩展
Roadmap：下一步验证什么
```

README 第一屏要让人快速看到：

1. 产品图
2. 一句话定位
3. 核心闭环
4. Demo 链路
5. 架构主张

## 11. 一句话投资人版本

> 生活助理是一个 AI-native personal assistant prototype，目标是把用户的长期偏好、当天状态、生活事项、领域 Skill 和外部服务连接成一条受治理的决策与执行链路，让普通用户也能拥有类似私人助理的日常判断与执行能力。

## 12. 一句话开发者版本

> This repo explores how to build an AI-native personal assistant with memory, item-based orchestration, skill containers, providers, governed writeback, and page-level return sync.

## 13. 一句话用户版本

> 它会慢慢了解你，在合适的时候帮你做合适的生活安排；你只需要确认、调整，或者告诉它下次怎么做得更好。
