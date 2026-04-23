/**
 * Copyright (c) 2026 jeans-l / Liu / 221226. Released under the MIT License. See ../../LICENSE.md.
 * Origin: jeans-l
 * Signature: 221226
 * Maintainer: liu
 */

/**
 * 引导流程屏幕渲染模块
 *
 * 负责渲染引导流程的各个步骤界面，包括：
 * - 进度条和已确认信息回顾
 * - 欢迎屏幕（助理命名和风格选择）
 * - 身份信息屏幕（昵称、位置、性别、身份类型、MBTI）
 * - 作息时间屏幕（起床、睡觉、用餐时间）
 * - 可选信息屏幕（饮食偏好、预算、忌口/过敏）
 * - 模型配置屏幕（服务商、API Key、模型选择）
 */

/** HTML 实体转义，防止 XSS */
function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

/** 渲染选项芯片组（支持单选/多选、不同样式） */
function renderOptionChips({
  field,
  values,
  selectedValue,
  selectedValues,
  action = "select-chip",
  multi = false,
  subtle = false,
  large = false,
}) {
  return values
    .map((item) => {
      const value = typeof item === "string" ? item : item.value;
      const label = typeof item === "string" ? item : item.label;
      const isSelected = multi
        ? Array.isArray(selectedValues) && selectedValues.includes(value)
        : selectedValue === value;

      return `
        <button
          type="button"
          class="preview-chip ${isSelected ? "is-selected" : ""} ${subtle ? "is-subtle" : ""} ${large ? "is-large" : ""}"
          data-action="${action}"
          data-field="${field}"
          data-value="${escapeHtml(value)}"
        >
          ${escapeHtml(label)}
        </button>
      `;
    })
    .join("");
}

/** 渲染字段错误提示 */
function renderFieldError(message) {
  if (!message) return "";
  return `<div class="preview-field-error">${escapeHtml(message)}</div>`;
}

/** 渲染与正式版一致的自定义下拉箭头 */
function renderSelectArrow() {
  return `
    <span class="preview-select-arrow ui-select-arrow" aria-hidden="true">
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    </span>
  `;
}

/** 渲染与正式版一致的自定义下拉 */
function renderCustomSelect({ field, value, options, placeholder = "请选择", openField }) {
  const selectedOption = options.find((option) => option.value === value);
  const isOpen = openField === field;

  return `
    <div class="preview-select-wrapper ui-select-wrapper" data-preview-select="${escapeHtml(field)}">
      <button
        type="button"
        class="preview-select-trigger ui-select ${isOpen ? "is-open" : ""}"
        data-action="toggle-select"
        data-field="${escapeHtml(field)}"
        aria-expanded="${isOpen ? "true" : "false"}"
      >
        <span class="ui-select-value">${escapeHtml(selectedOption?.label || placeholder)}</span>
        ${renderSelectArrow()}
      </button>
      <div
        class="preview-select-dropdown ui-select-dropdown ${isOpen ? "is-open" : ""}"
        style="visibility:${isOpen ? "visible" : "hidden"};opacity:${isOpen ? "1" : "0"};pointer-events:${isOpen ? "auto" : "none"};"
      >
        ${options.map((option) => `
          <button
            type="button"
            class="preview-select-option ui-select-option ${option.value === value ? "is-selected" : ""}"
            data-action="select-option"
            data-field="${escapeHtml(field)}"
            data-value="${escapeHtml(option.value)}"
          >
            ${escapeHtml(option.label)}
          </button>
        `).join("")}
      </div>
    </div>
  `;
}

/** 渲染进度条和已确认信息回顾区域 */
function renderProgress(state) {
  const { title, value } = getProgressMeta(state.screenIndex);

  return `
    <section class="preview-progress-shell">
      <div class="preview-progress-row">
        <span>${escapeHtml(title)}</span>
        <strong>${state.screenIndex + 1} / ${SCREEN_IDS.length}</strong>
      </div>
      <div class="preview-progress-bar">
        <span style="width:${value * 100}%"></span>
      </div>
    </section>
  `;
}

/** 渲染欢迎屏幕（助理命名和风格选择） */
function renderWelcome(state, animate) {
  return `
    <section class="preview-panel ${animate ? "is-entering" : ""}>
      <h1 class="preview-panel-title ui-panel-title">让我们先相互了解下吧</h1>

      <label class="preview-field">
        <span class="preview-label">给我起个名字吧</span>
        <input
          class="preview-input"
          name="assistantName"
          value="${escapeHtml(state.data.assistantName)}"
          placeholder="例如：生活助理"
        />
      </label>

      <div class="preview-field">
        <div class="preview-label-row ui-label-row">
          <span class="preview-label ui-label">你期望我怎么表达</span>
        </div>
        <div class="preview-chip-row">
          ${renderOptionChips({
            field: "assistantTone",
            values: TONE_OPTIONS,
            selectedValue: state.data.assistantTone,
            action: "select-tone",
            large: true,
          })}
        </div>
      </div>
    </section>
  `;
}

/** 渲染身份信息屏幕（昵称、位置、性别、身份类型、MBTI） */
function renderIdentity(state, animate) {
  return `
    <section class="preview-panel ${animate ? "is-entering" : ""}>
      <h1 class="preview-panel-title ui-panel-title">让我们先相互了解下吧</h1>

      <label class="preview-field">
        <span class="preview-label">我怎么称呼你</span>
        <input
          class="preview-input ${state.errors.displayName ? "has-error" : ""}"
          name="displayName"
          value="${escapeHtml(state.data.displayName)}"
          placeholder="例如：小宇"
        />
        ${renderFieldError(state.errors.displayName)}
      </label>

      <label class="preview-field">
        <span class="preview-label">位置</span>
        <div class="preview-inline-row">
          <input
            class="preview-input ${state.errors.homeLocation ? "has-error" : ""}"
            name="homeLocation"
            value="${escapeHtml(state.data.homeLocation)}"
            placeholder="例如：上海静安寺"
          />
          <button type="button" class="preview-secondary" data-action="use-location">
            ${state.locationState.status === "loading" ? "正在获取" : "自动定位"}
          </button>
        </div>
        ${renderFieldError(state.errors.homeLocation)}
        ${state.locationState.message
          ? `<div class="preview-inline-feedback is-${state.locationState.status === "idle" ? "success" : state.locationState.status}">${escapeHtml(
              state.locationState.message,
            )}</div>`
          : `<div class="preview-helper">用于推荐附近安排。</div>`}
      </label>

      <div class="preview-field">
        <div class="preview-label-row ui-label-row">
          <span class="preview-label ui-label">性别</span>
          <span class="preview-optional-tag ui-optional-tag is-soft">可选</span>
        </div>
        <div class="preview-chip-row">
          ${renderOptionChips({
            field: "gender",
            values: GENDER_OPTIONS,
            selectedValue: state.data.gender,
          })}
        </div>
      </div>

      <div class="preview-field">
        <div class="preview-label-row ui-label-row">
          <span class="preview-label ui-label">身份类型</span>
          <span class="preview-optional-tag ui-optional-tag is-soft">可选</span>
        </div>
        <div class="preview-chip-row">
          ${renderOptionChips({
            field: "identity",
            values: IDENTITY_OPTIONS,
            selectedValue: state.data.identity,
          })}
        </div>
      </div>

      <div class="preview-field">
        <div class="preview-label-row ui-label-row">
          <span class="preview-label ui-label">MBTI</span>
          <span class="preview-optional-tag ui-optional-tag is-soft">可选</span>
        </div>
        <div class="preview-chip-row">
          ${renderOptionChips({
            field: "mbti",
            values: MBTI_OPTIONS,
            selectedValue: state.data.mbti,
            subtle: true,
          })}
        </div>
      </div>
    </section>
  `;
}

/** 渲染时间字段（带预设选项和自定义输入） */
function renderTimeField({
  label,
  field,
  values,
  selectedValue,
  customOpen,
  hasError,
  helper,
}) {
  return `
    <div class="preview-field">
      <div class="preview-label-row ui-label-row">
        <span class="preview-label ui-label">${escapeHtml(label)}</span>
      </div>
      <div class="preview-chip-row">
        ${renderOptionChips({
          field,
          values,
          selectedValue,
        })}
        <button type="button" class="preview-chip is-subtle" data-action="toggle-custom-time" data-field="${field}">
          自定义
        </button>
      </div>
      ${customOpen
        ? `<input class="preview-input preview-inline-time ${hasError ? "has-error" : ""}" type="time" name="${field}" value="${escapeHtml(
            selectedValue,
          )}" />`
        : ""}
      ${renderFieldError(hasError ? helper : "")}
    </div>
  `;
}

/** 渲染用餐时间子字段（午餐/晚餐，可选） */
function renderMealSubfield({
  label,
  field,
  values,
  selectedValue,
  customOpen,
}) {
  return `
    <div class="preview-subfield">
      <div class="preview-subfield-head ui-label-row">
        <span>${escapeHtml(label)}</span>
        <span class="preview-optional-tag ui-optional-tag is-soft">可选</span>
      </div>
      <div class="preview-chip-row">
        ${renderOptionChips({
          field,
          values,
          selectedValue,
          subtle: true,
        })}
        <button type="button" class="preview-chip is-subtle" data-action="toggle-custom-time" data-field="${field}">
          自定义
        </button>
      </div>
      ${customOpen
        ? `<input class="preview-input preview-inline-time" type="time" name="${field}" value="${escapeHtml(selectedValue)}" />`
        : ""}
    </div>
  `;
}

/** 渲染作息时间屏幕（起床、睡觉、用餐时间） */
function renderRhythm(state, animate) {
  return `
    <section class="preview-panel ${animate ? "is-entering" : ""}>
      <h1 class="preview-panel-title ui-panel-title">再记一下你的日常节奏</h1>

      ${renderTimeField({
        label: "起床时间",
        field: "wakeTime",
        values: WAKE_OPTIONS,
        selectedValue: state.data.wakeTime,
        customOpen: state.customTime.wakeTime,
        hasError: Boolean(state.errors.wakeTime),
        helper: "先给我一个大致起床时间。",
      })}

      ${renderTimeField({
        label: "睡觉时间",
        field: "sleepTime",
        values: SLEEP_OPTIONS,
        selectedValue: state.data.sleepTime,
        customOpen: state.customTime.sleepTime,
        hasError: Boolean(state.errors.sleepTime),
        helper: "先给我一个大致睡觉时间。",
      })}

      ${shouldShowNextDaySleepHint(state.data)
        ? `<div class="preview-inline-feedback is-success">如果睡觉时间早于起床时间，会按次日理解。</div>`
        : ""}

      ${renderMealSubfield({
        label: "午餐时间",
        field: "lunchTime",
        values: LUNCH_OPTIONS,
        selectedValue: state.data.lunchTime,
        customOpen: state.customTime.lunchTime,
      })}

      ${renderMealSubfield({
        label: "晚餐时间",
        field: "dinnerTime",
        values: DINNER_OPTIONS,
        selectedValue: state.data.dinnerTime,
        customOpen: state.customTime.dinnerTime,
      })}
    </section>
  `;
}

/** 渲染可选信息屏幕（饮食偏好、预算、忌口/过敏） */
function renderOptional(state, animate) {
  return `
    <section class="preview-panel ${animate ? "is-entering" : ""}>
      <h1 class="preview-panel-title ui-panel-title">让我继续了解下你的饮食偏好</h1>

      <div class="preview-field">
        <div class="preview-label-row ui-label-row">
          <span class="preview-label ui-label">当前饮食主要关注什么</span>
          <span class="preview-optional-tag ui-optional-tag is-soft">可选</span>
        </div>
        <div class="preview-chip-row">
          ${renderOptionChips({
            field: "dietFocus",
            values: DIET_FOCUS_OPTIONS,
            selectedValue: state.data.dietFocus,
          })}
        </div>
      </div>

      <div class="preview-field">
        <div class="preview-label-row ui-label-row">
          <span class="preview-label ui-label">午餐预算一般多少</span>
          <span class="preview-optional-tag ui-optional-tag is-soft">可选</span>
        </div>
        <div class="preview-budget-input-row">
          <input
            class="preview-input"
            type="number"
            name="lunchBudgetMin"
            value="${escapeHtml(state.data.lunchBudgetMin || "")}"
            placeholder="最低"
          />
          <span class="preview-budget-separator">至</span>
          <input
            class="preview-input"
            type="number"
            name="lunchBudgetMax"
            value="${escapeHtml(state.data.lunchBudgetMax || "")}"
            placeholder="最高"
          />
          <span class="preview-budget-unit">元</span>
        </div>
      </div>

      <div class="preview-field">
        <div class="preview-label-row ui-label-row">
          <span class="preview-label ui-label">晚餐预算一般多少</span>
          <span class="preview-optional-tag ui-optional-tag is-soft">可选</span>
        </div>
        <div class="preview-budget-input-row">
          <input
            class="preview-input"
            type="number"
            name="dinnerBudgetMin"
            value="${escapeHtml(state.data.dinnerBudgetMin || "")}"
            placeholder="最低"
          />
          <span class="preview-budget-separator">至</span>
          <input
            class="preview-input"
            type="number"
            name="dinnerBudgetMax"
            value="${escapeHtml(state.data.dinnerBudgetMax || "")}"
            placeholder="最高"
          />
          <span class="preview-budget-unit">元</span>
        </div>
      </div>

      <div class="preview-field">
        <div class="preview-label-row ui-label-row">
          <span class="preview-label ui-label">有无忌口 / 过敏</span>
        </div>
        <div class="preview-chip-row">
          ${renderOptionChips({
            field: "restrictionMode",
            values: RESTRICTION_MODE_OPTIONS,
            selectedValue: state.data.restrictionMode,
          })}
        </div>
        ${state.data.restrictionMode === "has_restrictions"
          ? `
              <div class="preview-stack-block is-inline">
                <div class="preview-subfield-head ui-label-row">
                  <span class="preview-label ui-label is-small">常见忌口 / 过敏</span>
                  <span class="preview-optional-tag ui-optional-tag is-soft">可选</span>
                </div>
                <div class="preview-chip-row">
                  ${renderOptionChips({
                    field: "restrictionTags",
                    values: RESTRICTION_TAG_OPTIONS,
                    selectedValues: state.data.restrictionTags,
                    multi: true,
                    subtle: true,
                  })}
                </div>
                <div class="preview-subfield-head ui-label-row">
                  <span class="preview-label ui-label is-small">补充说明</span>
                  <span class="preview-optional-tag ui-optional-tag is-soft">可选</span>
                </div>
                <textarea class="preview-textarea" name="restrictionCustom" rows="3" placeholder="例如：甲壳类过敏、不吃内脏、晚餐尽量清淡">${escapeHtml(
                  state.data.restrictionCustom,
                )}</textarea>
              </div>
            `
          : `<div class="preview-helper">后续推荐会尽量避开这些。</div>`}
      </div>
    </section>
  `;
}

/** 渲染模型配置屏幕（服务商、API Key、模型选择） */
function renderModelSetup(state, animate) {
  const providerConfig = PROVIDER_CONFIGS.find(c => c.value === state.data.providerId) || PROVIDER_CONFIGS[0];
  
  return `
    <section class="preview-panel ${animate ? "is-entering" : ""}>
      <h1 class="preview-panel-title ui-panel-title">为助理装上大脑</h1>

      <div class="preview-field">
        <div class="preview-label-row ui-label-row">
          <span class="preview-label ui-label">服务商</span>
        </div>
        ${renderCustomSelect({
          field: "providerId",
          value: state.data.providerId,
          options: PROVIDER_OPTIONS,
          openField: state.openSelectField,
        })}
      </div>

      <div class="preview-field">
        <div class="preview-label-row ui-label-row">
          <span class="preview-label ui-label">API Key</span>
        </div>
        <input
          class="preview-input"
          type="password"
          name="apiKey"
          value="${escapeHtml(state.data.apiKey)}"
          placeholder="请输入 API Key"
        />
      </div>

      <div class="preview-field">
        <div class="preview-label-row ui-label-row">
          <span class="preview-label ui-label">Model</span>
        </div>
        ${renderCustomSelect({
          field: "modelName",
          value: state.data.modelName,
          options: providerConfig.models,
          openField: state.openSelectField,
        })}
      </div>

      ${providerConfig.endpointRequired ? `
        <div class="preview-field">
          <div class="preview-label-row ui-label-row">
            <span class="preview-label ui-label">Base URL</span>
            <span class="preview-optional-tag ui-optional-tag is-soft">可选</span>
          </div>
          <input
            class="preview-input"
            type="url"
            name="baseUrl"
            value="${escapeHtml(state.data.baseUrl)}"
          />
        </div>
      ` : ""}

      <div class="preview-inline-feedback is-${state.connectionState.status === "failure" ? "error" : state.connectionState.status === "success" ? "success" : "loading"}>
        ${escapeHtml(
          state.connectionState.message ||
          "也可以稍后再设置。跳过后，当前仅支持浏览与基础手动管理。",
        )}
      </div>
    </section>
  `;
}

/** 渲染底部操作按钮区域（根据当前步骤显示不同按钮组合） */
function renderActions(state) {
  const screenId = getScreenId(state.screenIndex);
  const canProceed = canProceedCurrentScreen(state);

  if (screenId === "welcome") {
    return `
      <div class="preview-action-stack">
        <button type="button" class="preview-primary is-block" data-action="next">继续</button>
      </div>
    `;
  }

  if (screenId === "identity" || screenId === "rhythm" || screenId === "optional") {
    return `
      <div class="preview-action-inline-row">
        <button type="button" class="preview-secondary" data-action="back">上一步</button>
        <button type="button" class="preview-primary is-block" data-action="next" ${canProceed ? "" : "disabled"}>
          继续
        </button>
      </div>
    `;
  }

  if (screenId === "model-setup") {
    const providerConfig = PROVIDER_CONFIGS.find(c => c.value === state.data.providerId) || PROVIDER_CONFIGS[0];
    const hasModelConfig = (
      state.data.providerId.trim().length > 0 &&
      state.data.apiKey.trim().length > 0 &&
      state.data.modelName.trim().length > 0 &&
      (!providerConfig.endpointRequired || state.data.baseUrl.trim().length > 0) &&
      state.connectionState.status === "success"
    );
    return `
      <div class="preview-action-inline-row">
        <button type="button" class="preview-secondary" data-action="back">上一步</button>
        <button type="button" class="preview-primary is-block" data-action="complete-with-model" ${hasModelConfig ? "" : "disabled"}>
          开始服务
        </button>
      </div>
      <div style="margin-top: 12px; text-align: center;">
        <button type="button" class="preview-ghost" data-action="complete-without-model">
          稍后设置
        </button>
      </div>
    `;
  }

  return `
    <div class="preview-action-stack">
      <div class="preview-action-meta">
        <button type="button" class="preview-ghost" data-action="back">上一步</button>
      </div>
      <button type="button" class="preview-primary is-block" data-action="complete">完成</button>
    </div>
  `;
}

/** 渲染预览页面外壳结构（顶部栏、滚动内容区、底部操作栏） */
function renderPreviewShell() {
  return `
    <div class="preview-page">
      <div class="preview-shell">
        <header class="preview-topbar">
          <div data-region="progress"></div>
        </header>

        <div class="preview-scroll-body">
          <main class="preview-screen-shell" data-region="screen"></main>
        </div>

        <footer class="preview-action-bar">
          <div data-region="actions"></div>
        </footer>
      </div>
    </div>
  `;
}

/** 渲染进度区域（对外接口） */
function renderPreviewProgress(state) {
  return renderProgress(state);
}

/** 根据当前步骤渲染对应屏幕内容 */
function renderPreviewScreen(state, options = {}) {
  const animate = Boolean(options.animate);
  const screenId = getScreenId(state.screenIndex);

  if (screenId === "welcome") return renderWelcome(state, animate);
  if (screenId === "identity") return renderIdentity(state, animate);
  if (screenId === "rhythm") return renderRhythm(state, animate);
  if (screenId === "optional") return renderOptional(state, animate);
  if (screenId === "model-setup") return renderModelSetup(state, animate);
  return renderOptional(state, animate);
}

/** 渲染操作按钮区域（对外接口） */
function renderPreviewActions(state) {
  return renderActions(state);
}
