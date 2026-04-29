# 技术架构：Assistant Host + Skill Container + 单一写回主权

> 本文件独立说明生活助理的目标技术架构。重点不是具体接口字段，而是长期不可破坏的架构边界：assistant 是宿主，skill 是能力包，provider 是外部能力来源，memory + item 是真源，writeback decision 是唯一正式写回主权。

---

## 1. 架构目标

生活助理不是一个普通前端 App 加一个 LLM 接口。

它需要支持：

1. 多入口触发。
2. 多页面承接。
3. 多 Skill 调用。
4. 多 Provider 接入。
5. Memory 分层读取。
6. 统一写回裁决。
7. 页面 Return Sync。
8. 后续插件化扩展。

因此目标架构必须同时满足两个要求：

1. **当前足够简单**：P0 能以 React H5 + PWA + Capacitor 快速落地。
2. **长期可扩展**：Skill、Provider、Model 和远程能力未来能接入，但不破坏 assistant 主权。

---

## 2. 技术路线

正式技术路线：

```text
React H5
+ PWA
+ Capacitor
+ Local-first storage
+ Client Assistant Gateway
+ Optional Minimal Control Plane
```

含义：

1. 首期主工程仍是前端主工程。
2. 移动端通过 Capacitor 打包。
3. 本地优先保存 item、memory、projection 等数据。
4. 用户可自行配置模型 provider。
5. 服务端不默认接管用户真源数据。
6. 后续可以引入最小控制面管理 Skill / Provider 元数据。

---

## 3. 总体分层

目标系统分为七层：

```text
Presentation Shell
→ Application Use Cases
→ Client Assistant Gateway
→ Assistant Host Kernel
→ Registries / Runtime / Policy Engines
→ Repositories / Adapters
→ Local Data Stores / Platform APIs / External Providers
```

职责表：

| 层 | 主要职责 | 不负责 |
|---|---|---|
| Presentation Shell | 页面展示、交互、承接 | 不做 runtime 编排 |
| Application Use Cases | 页面业务动作、触发 gateway | 不定义 skill 路由和写回主权 |
| Client Assistant Gateway | 统一 runtime 入口 | 不变成页面层 |
| Assistant Host Kernel | 路由、上下文、skill 分发、写回裁决 | 不直接成为数据真源 |
| Registries / Runtime / Policy Engines | skill/provider 注册、执行、治理 | 不直连 UI |
| Repositories / Adapters | item/memory/projection 持久化 | 不拥有编排主权 |
| Platform / Providers | 本地能力、外部服务 | 不拥有全局判断主权 |

---

## 4. 一页架构图

```text
UI / Pages
  NOW / Schedule / Role / Me / Assistant Surface
        ↓
Application Use Cases
        ↓
Client Assistant Gateway
        ↓
Assistant Host Kernel
  ├─ Route Planner
  ├─ Context Assembly Planner
  ├─ Skill Runtime Dispatcher
  ├─ Provider Registry
  ├─ Writeback Policy Engine
  └─ Surface Registry
        ↓
Repositories / Adapters
  ├─ Item Repository
  ├─ Memory Repository
  ├─ Schedule Repository
  ├─ Decision Records
  └─ Projection Store
        ↓
Local Data Stores / Platform APIs / External Providers
```

核心理解：

1. UI 不直接调用 Skill。
2. UI 不直接写 memory 真源。
3. Skill 不直接写 repository。
4. Provider 不做全局判断。
5. Projection 只承接已裁决结果。

---

## 5. 双容器模型

长期架构采用双容器模型：

```text
Assistant Container + Skill Container
```

### 5.1 Assistant Container

Assistant Container 是宿主容器。

它负责：

1. 统一承接所有入口。
2. 执行 route。
3. 组装 governed context。
4. 分发 Skill 调用。
5. 选择 Provider。
6. 执行 validation 和 policy。
7. 统一 writeback decision。
8. 生成 return sync。
9. 管理 surface 承接。
10. 在没有 Skill 时提供明确 unsupported 或降级结果。

Assistant Container 不是普通 Skill，也不是页面。

---

### 5.2 Skill Container

Skill Container 是能力包执行单元。

它负责：

1. 声明能力。
2. 声明上下文需求。
3. 声明输出 schema。
4. 形成领域 proposal。
5. 返回领域状态和领域动作。
6. 声明 Provider 需求。
7. 返回写回候选。

Skill Container 不能：

1. 直接写 memory。
2. 直接写 item。
3. 直接改页面。
4. 持有 Provider token。
5. 绕过 assistant 执行外部动作。

---

## 6. Manifest 驱动扩展

长期所有 Skill / Provider 扩展都应由 Manifest 驱动。

SkillPackageManifest 至少包含：

1. id。
2. vendor。
3. version。
4. compatibility。
5. capabilities。
6. scenario summary。
7. route contributions。
8. required context。
9. proposal schema。
10. surface slots。
11. provider requirements。
12. writeback hints。
13. execution mode。
14. sandbox policy。
15. signature。

原则：

1. Manifest 是扩展单一事实源。
2. 不允许同时存在多个手写路由表。
3. 不允许硬编码 Skill 枚举成为长期事实源。
4. 外部 Skill 必须先注册 Manifest，再进入 runtime。

---

## 7. Assistant Host Kernel

Assistant Host Kernel 是 Client Assistant Gateway 内部的宿主内核。

它包含：

### 7.1 Package Installer / Verifier

负责：

1. Skill / Provider 包发现。
2. 安装。
3. 签名校验。
4. 版本兼容检查。
5. 撤回处理。

P0 可以先不做完整实现，但架构上保留位置。

---

### 7.2 Host Registry

负责维护当前激活的：

1. Skill。
2. Provider。
3. Surface contribution。
4. Writeback contribution。

---

### 7.3 Route Planner

负责决定一次请求进入哪条路径：

1. Chat Mode。
2. Behavior Mode。
3. Correction Mode。
4. Provider action。
5. Page sync。

---

### 7.4 Context Assembly Planner

负责将页面上下文、memory 切片、skill required context 组装成 governed context。

原则：

1. 不传全量 memory。
2. 不暴露内部 repository handle。
3. 只给 Skill 当前任务需要的上下文。

---

### 7.5 Skill Runtime Dispatcher

负责在不同 Skill 执行环境之间分发。

支持：

1. Local Sandbox Skill。
2. Remote Hosted Skill。

---

### 7.6 Provider Registry

负责：

1. Provider 声明。
2. 权限状态。
3. 可用性。
4. 外部状态回流。
5. Adapter 实例选择。

---

### 7.7 Writeback Policy Engine

负责将以下输入收敛为正式写回裁决：

1. Skill 写回建议。
2. Assistant 判断。
3. 用户反馈。
4. 页面编辑事件。
5. Provider 执行结果。
6. Correction 结果。

---

### 7.8 Surface Registry

负责把 Skill 的前台承接声明映射到页面可展示内容。

原则：

1. Skill 可以贡献 domain block。
2. Skill 不能决定最终 UI 状态。
3. 最终页面状态来自已裁决 projection。

---

## 8. Skill 执行模型

### 8.1 Local Sandbox Skill

适用于：

1. 内置 Skill。
2. 受信任本地 Skill。
3. 低延迟场景。
4. 本地上下文强绑定能力。

约束：

1. 运行在受限沙箱。
2. 不直接拿 repository handle。
3. 不直接拿 token。
4. 输出结构化结果。

---

### 8.2 Remote Hosted Skill

适用于：

1. 外部服务商托管能力。
2. 需要自有模型或自有服务的 Skill。
3. 需要独立升级和撤回的能力包。

约束：

1. 宿主只发送 governed context。
2. 不透传 provider token。
3. 远程 Skill 返回结构化 envelope。
4. 远程 Skill 不拥有写回主权。

---

## 9. Provider 架构

Provider 分两类。

### 9.1 ModelProvider

负责：

1. LLM 可用性判断。
2. 推理调用。
3. 鉴权。
4. 超时。
5. 重试。
6. 模型选择。

它只回答：

> 当前宿主能否获得模型推理能力？

---

### 9.2 ExternalServiceProvider

负责：

1. 候选拉取。
2. 外部执行。
3. 状态回流。
4. 授权状态。
5. 外部能力声明。

它只回答：

> 外部系统能提供什么候选、执行什么动作、回流什么状态？

Provider 不是智能主体，不决定优先级，不替代 Skill 做领域判断。

---

## 10. 数据主权

正式真源：

```text
item + memory
```

页面承接层：

```text
projection
```

关键边界：

1. item 是 assistant 正式管理的一件事。
2. memory 是上下文与学习系统。
3. schedule event 是 item 的时间投影。
4. projection 是页面派生状态。
5. decisionRecords 是判断证据。
6. Skill result 是候选，不是真源。

数据主链：

```text
item + memory
→ governed context
→ skill result / assistant judgment
→ writeback policy engine
→ writeback decision
→ repository update
→ projection / return sync
→ UI
```

---

## 11. 单一写回主权

正式写回只发生在 Writeback Policy Engine。

不允许：

1. Skill 直接写 repository。
2. Provider 直接改 item 状态。
3. UI 直接改长期 memory。
4. Projection 反向决定真源。
5. LLM 输出直接成为长期偏好。

允许：

1. 页面保存明确字段。
2. 页面编辑事件同步给 assistant。
3. assistant 判断是否影响后续。
4. 写回引擎决定是否进入真源。
5. 页面消费 return sync。

---

## 12. P0 实现建议

P0 不需要一次做完完整插件系统。

建议实现：

1. 固定内置 Skill registry。
2. 本地 mock Provider。
3. 本地 memory store。
4. 本地 item store。
5. 简化 Assistant Gateway。
6. 简化 writeback decision。
7. 明确 demo fixture 和正式 runtime 分离。

P0 需要坚持的边界：

1. Demo 数据不混进正式 runtime。
2. Skill 输出不直接改页面。
3. 页面同步走 return sync。
4. Memory 写回保留候选概念。
5. 服务未接入时明确能力受限。

---

## 13. Minimal Control Plane

长期可以引入最小控制面。

它负责：

1. Skill / Provider 元数据目录。
2. 版本发布。
3. 兼容矩阵。
4. 签名和公钥。
5. 撤回状态。
6. 扩展发现。

它不负责：

1. 不持有 item + memory 真源。
2. 不接管 writeback decision。
3. 不成为第二个 runtime owner。
4. 不渲染页面。
5. 不接管用户私有数据。

---

## 14. 架构红线

长期不可破坏的五条红线：

### 14.1 Assistant Host 统一编排

Client Assistant Gateway + Assistant Host Kernel 是唯一 runtime owner。

### 14.2 Manifest 驱动扩展

Skill / Provider 扩展必须由 Manifest 驱动，不能靠散落的硬编码配置。

### 14.3 外部 Skill 不持有真源句柄

外部 Skill 不能直接访问 repository、projection store、provider token 或平台能力句柄。

### 14.4 Provider 不是智能主语

Provider 只提供候选、执行和回流，不拥有判断主权。

### 14.5 Projection 只从写回裁决派生

前台承接和页面刷新只能消费已裁决结果。

---

## 15. 架构验收标准

一个实现是否符合目标架构，至少看十点：

1. 页面是否只负责展示和触发，而不是直接编排 Skill。
2. assistant 是否统一接住所有入口。
3. Skill 是否通过 registry / manifest 参与路由。
4. Skill 是否只返回结构化结果。
5. Provider token 是否没有暴露给 Skill。
6. Memory 是否按最小切片读取。
7. 写回是否经过统一裁决。
8. Projection 是否只是页面派生。
9. Demo fixture 是否和正式 runtime 分离。
10. 未接入能力是否明确降级，而不是伪装完成。

---

## 16. 一句话总结

生活助理的技术架构核心是：

> 用 Assistant Host 统一编排，用 Skill Container 插拔领域能力，用 Provider 接入外部服务，用 Memory + Item 保持真源，用 Writeback Decision 管住所有结果如何进入真实状态。
