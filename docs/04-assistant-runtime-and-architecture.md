# 04｜Assistant Runtime & Architecture

> 这份文档用于对外解释生活助理的运行主链和目标架构。重点是让开发者、投资人和潜在合作者理解：这个项目不是页面 demo，而是一套 AI-native personal assistant harness。

## 1. 架构总判断

生活助理的架构核心是：

> Assistant 是宿主，Skill 是插件化能力包，Provider 是外部能力来源，Memory + Item 是真源，Writeback Decision 是唯一正式写回主权。

这套架构的目的不是为了复杂，而是为了保证 AI 助理进入真实生活状态时仍然可控、可解释、可扩展。

## 2. 统一主循环

所有入口最终进入同一条 assistant runtime 主链：

```text
Trigger
→ Entry
→ Route
→ Context Load
→ Domain Judgment
→ Validation
→ State Recheck
→ Policy Decision
→ Execution or Handoff
→ Writeback Decision
→ Return Sync
→ Correction
```

不是每次都要走满所有阶段，但阶段顺序不能反过来。

## 3. 三类产品入口

生活助理有三类用户体感入口：

```text
用户对话
用户直接操作
Assistant 自驱
```

### 用户对话

用户通过全局 assistant 输入框、快捷动作或半屏对话发起请求。

默认进入 `chat mode`，先完成用户可见的理解、澄清和收敛。

### 用户直接操作

用户在页面内直接编辑，比如修改一个日程时间。

页面先完成明确字段保存，然后 assistant 做轻量影响判断，判断是否需要提醒、重排或进入对话。

### Assistant 自驱

由时间窗口、外部事件、通知点击或周期纠偏触发。

默认进入 `behavior mode` 或 `correction mode`，不默认打扰用户。需要确认或冲突无法自动裁决时，再回到 `chat mode`。

## 4. Execution Mode

runtime 中有三种 execution mode：

```text
Chat Mode
Behavior Mode
Correction Mode
```

它们不是三套系统，而是 route 阶段之后的不同执行表面。

### Chat Mode

用于用户可见对话。重点是理解、引导、解释、确认和低摩擦选择。

### Behavior Mode

用于围绕事项的判断、校验、状态复核、策略裁决和执行移交。

### Correction Mode

用于候选复核、记忆提升、回退、过期和长期纠偏。

## 5. Memory Load Policy

assistant 不会一次性读取全部记忆，而是按阶段读取最小切片。

默认顺序：

```text
trigger
→ identity / profile
→ daily / today
→ interaction / conversationContext
→ skill-local
→ evidence（按闸门追加）
```

Evidence 只在以下情况追加读取：

```text
conflict
promote
rollback
review
correction
```

这样可以避免记忆过载，也避免把弱信号误当长期偏好。

## 6. Writeback Policy

写回不是模型说了就写。

所有新增信息都先成为 candidate，再进入 writeback decision。

```text
candidate
→ writeback decision
→ hold / promote / rollback / expire
→ memory / item / projection
→ return sync
```

四种裁决结果：

```text
hold：证据不足，暂存候选
promote：证据足够，提升到目标层
rollback：新证据推翻旧结论，回退
expire：过期清除
```

## 7. Item + Memory 是真源

页面不是数据真源。

```text
Item：assistant 正式接住的一件事
Memory：长期默认、当天状态、本轮上下文、领域记忆和历史证据
Schedule Event：item 在时间结构里的投影
Projection：页面同步和恢复层
```

页面可以编辑投影对象，但正式状态收敛必须回到 item + memory。

## 8. Assistant / Skill / Provider

### Assistant

Assistant 是统一 runtime owner，负责入口承接、路由、上下文装配、治理、执行协调、写回裁决和页面同步。

### Skill

Skill 是领域能力包，负责形成领域方案或领域结果。

Skill 可以给出：

```text
proposal
execution advice
writeback intent
surface contribution
```

但 Skill 不直接写 memory、item 或页面。

### Provider

Provider 是外部能力来源，负责候选、执行和状态回流。

例如：

```text
ModelProvider：模型推理能力
ExternalServiceProvider：外卖、日历、定位、天气等外部服务
```

Provider 不是智能主体，不拥有判断主权。

## 9. 目标技术架构

```text
Presentation Shell
→ Application Use Cases
→ Client Assistant Gateway
→ Assistant Host Kernel
→ Registries / Runtime / Policy Engines
→ Repositories / Adapters
→ Local Data Stores / Platform APIs / External Providers
```

各层职责：

```text
Presentation Shell：展示、交互、页面承接
Application Use Cases：页面业务编排、触发 Gateway
Client Assistant Gateway：统一 runtime 入口
Assistant Host Kernel：安装、路由、上下文装配、分发、写回、surface 收口
Registries / Runtime / Policy Engines：skill/provider 注册、执行容器、治理与写回决策
Repositories / Adapters：item/memory/projection 持久化与平台差异吸收
External Providers：外部候选、执行、回流
```

## 10. 双容器模型

长期架构采用双容器：

```text
Assistant Container
Skill Container
```

### Assistant Container

负责：统一入口、Route、Context Assembly、Policy、Writeback、Return Sync、Surface 收口。

### Skill Container

负责：Manifest、Capability、Route Contribution、Context Contract、Proposal Schema、Provider Requirements、Surface Contribution、Writeback Hints。

## 11. Manifest 驱动扩展

Skill 扩展的单一事实源是：

```text
SkillPackageManifest
```

它至少声明：

```text
id / vendor / version
capabilities
routeContributions
requiredContext
proposalSchema
surfaceSlots
providerRequirements
writebackHints
executionMode
sandboxPolicy
signature
```

不允许再出现并列的硬编码技能枚举或手写路由事实源。

## 12. 混合执行模型

Skill 支持两种执行模式：

```text
Local Sandbox Skill
Remote Hosted Skill
```

无论哪种执行方式，Skill 都只返回结构化结果，不拥有 repository、provider token 或页面状态主权。

## 13. 五条架构红线

1. Assistant Host 统一编排。
2. Manifest 驱动扩展。
3. 外部 Skill 不持有真源句柄。
4. Provider 不是智能主语。
5. Projection / Surface 只消费写回裁决结果。

## 14. 一句话总结

生活助理的架构不是为了把 App 做复杂，而是为了让 AI 助理在真实生活状态中保持：

```text
可控
可解释
可扩展
可写回
可纠偏
```
