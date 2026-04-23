/**
 * Copyright (c) 2026 jeans-l / Liu / 221226. Released under the MIT License. See ../../LICENSE.md.
 * Origin: jeans-l
 * Signature: 221226
 * Maintainer: liu
 */

/**
 * 引导流程预览应用
 *
 * 用于在静态预览环境中模拟完整引导流程，支持：
 * - 多步骤表单渲染和切换
 * - 表单数据持久化到 localStorage
 * - 地理定位模拟
 * - 模型连接测试模拟
 */
class PreviewOnboardingApp {
  constructor(root) {
    this.root = root;
    this.state = createInitialState();
    this.handleClick = this.handleClick.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleDocumentClick = this.handleDocumentClick.bind(this);
  }

  /** 挂载应用到 DOM，初始化事件监听 */
  mount() {
    this.root.innerHTML = renderPreviewShell();
    this.progressRegion = this.root.querySelector('[data-region="progress"]');
    this.screenRegion = this.root.querySelector('[data-region="screen"]');
    this.actionsRegion = this.root.querySelector('[data-region="actions"]');
    this.scrollBody = this.root.querySelector(".preview-scroll-body");

    this.root.addEventListener("click", this.handleClick);
    this.root.addEventListener("input", this.handleInput);
    this.root.addEventListener("change", this.handleInput);
    this.root.addEventListener("focusout", this.handleBlur);
    document.addEventListener("click", this.handleDocumentClick);

    this.renderAll({ animateScreen: true });
  }

  /** 持久化当前状态到 localStorage */
  persist() {
    persistOnboardingState(this.state);
  }

  /** 渲染所有区域（进度、屏幕、操作按钮） */
  renderAll({ animateScreen = false, preserveScroll = false } = {}) {
    const nextScrollTop = preserveScroll && this.scrollBody ? this.scrollBody.scrollTop : 0;

    this.progressRegion.innerHTML = renderPreviewProgress(this.state);
    this.screenRegion.innerHTML = renderPreviewScreen(this.state, { animate: animateScreen });
    this.actionsRegion.innerHTML = renderPreviewActions(this.state);

    if (preserveScroll && this.scrollBody) {
      this.scrollBody.scrollTop = nextScrollTop;
    }

    this.persist();
  }

  /** 仅渲染进度和操作按钮区域 */
  renderProgressAndActions() {
    this.progressRegion.innerHTML = renderPreviewProgress(this.state);
    this.actionsRegion.innerHTML = renderPreviewActions(this.state);
    this.persist();
  }

  /** 重新渲染当前屏幕内容 */
  rerenderScreen({ preserveScroll = true, animateScreen = false } = {}) {
    const nextScrollTop = preserveScroll && this.scrollBody ? this.scrollBody.scrollTop : 0;
    this.screenRegion.innerHTML = renderPreviewScreen(this.state, { animate: animateScreen });
    if (preserveScroll && this.scrollBody) {
      this.scrollBody.scrollTop = nextScrollTop;
    }
    this.persist();
  }

  /** 切换到指定步骤 */
  setScreen(screenIndex) {
    this.state.screenIndex = Math.max(0, Math.min(screenIndex, SCREEN_IDS.length - 1));
    this.state.errors = {};
    this.state.openSelectField = null;
    this.renderAll({ animateScreen: true });

    if (this.scrollBody) {
      this.scrollBody.scrollTop = 0;
    }
  }

  /** 处理输入框、文本域和下拉选择的变更事件 */
  handleInput(event) {
    const target = event.target;
    if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement)) return;

    const { name } = target;
    if (!name) return;

    // 处理服务商变更时的联动逻辑
    if (name === "providerId") {
      const providerId = target.value;
      const providerConfig = PROVIDER_CONFIGS.find(c => c.value === providerId) || PROVIDER_CONFIGS[0];
      this.state.data.providerId = providerConfig.value;
      this.state.data.providerLabel = providerConfig.label;
      this.state.data.modelName = providerConfig.defaultModel;
      this.state.data.baseUrl = providerConfig.defaultEndpoint;
      this.state.connectionState = { status: "untested", message: "" };
      this.renderAll({ preserveScroll: true });
      return;
    }

    // 直接存储其他字段
    this.state.data[name] = target.value;

    if (name === "homeLocation") {
      this.state.locationState = { status: "idle", message: "" };
    }

    if (name === "modelName" || name === "baseUrl" || name === "apiKey") {
      this.state.connectionState = { status: "untested", message: "" };
    }

    if (this.state.errors[name]) {
      delete this.state.errors[name];
    }

    this.renderProgressAndActions();
  }

  /** 处理失去焦点事件，用于 API Key 输入完成后自动触发验证 */
  handleBlur(event) {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) return;

    const { name } = target;
    if (!name) return;

    // API Key 输入框失去焦点且尚未验证成功时，自动触发连接测试
    if (name === "apiKey" && target.value.trim().length > 0 && this.state.connectionState.status !== "success") {
      void this.testModelConnection();
    }
  }

  /** 处理所有按钮点击事件，根据 data-action 分发到对应处理函数 */
  handleClick(event) {
    const target = event.target.closest("[data-action]");
    if (!target) return;

    const action = target.dataset.action;
    if (target instanceof HTMLButtonElement && target.disabled) return;

    if (action === "select-tone") {
      this.state.data.assistantTone = target.dataset.value || "warm-structured";
      this.renderAll({ preserveScroll: true });
      return;
    }

    if (action === "select-chip") {
      this.selectChip(target.dataset.field, target.dataset.value);
      return;
    }

    if (action === "toggle-custom-time") {
      this.toggleCustomTime(target.dataset.field);
      return;
    }

    if (action === "toggle-select") {
      this.toggleSelectMenu(target.dataset.field);
      return;
    }

    if (action === "select-option") {
      this.selectDropdownOption(target.dataset.field, target.dataset.value);
      return;
    }

    if (action === "use-location") {
      void this.useLocation();
      return;
    }

    if (action === "next") {
      this.goNext();
      return;
    }

    if (action === "back") {
      this.setScreen(this.state.screenIndex - 1);
      return;
    }

    if (action === "toggle-more") {
      this.state.isMoreOpen = !this.state.isMoreOpen;
      this.rerenderScreen({ preserveScroll: true });
      return;
    }

    if (action === "skip-optional" || action === "complete") {
      this.completeFlow();
      return;
    }

    if (action === "complete-with-model") {
      this.completeFlowWithModel();
      return;
    }

    if (action === "complete-without-model") {
      this.completeFlowWithoutModel();
      return;
    }

    if (action === "jump-screen") {
      const nextScreenIndex = Number(target.dataset.screenIndex || "0");
      this.setScreen(nextScreenIndex);
    }
  }

  /** 处理文档点击，用于关闭展开中的自定义下拉 */
  handleDocumentClick(event) {
    if (!this.state.openSelectField) return;
    if (!(event.target instanceof Element)) return;
    if (event.target.closest("[data-preview-select]")) return;

    this.state.openSelectField = null;
    this.rerenderScreen({ preserveScroll: true });
  }

  /** 处理选项芯片的选择事件 */
  selectChip(field, value) {
    if (!field || value == null) return;

    if (field === "restrictionTags") {
      this.state.data[field] = toggleArrayValue(this.state.data[field], value);
      this.renderAll({ preserveScroll: true });
      return;
    }

    if (field === "restrictionMode") {
      this.state.data.restrictionMode = value;
      if (value !== "has_restrictions") {
        this.state.data = clearRestrictionDetails(this.state.data);
        this.state.data.restrictionMode = value;
      }
      this.renderAll({ preserveScroll: true });
      return;
    }

    if (field === "providerId") {
      const providerId = value;
      const providerConfig = PROVIDER_CONFIGS.find(c => c.value === providerId) || PROVIDER_CONFIGS[0];
      this.state.data.providerId = providerConfig.value;
      this.state.data.providerLabel = providerConfig.label;
      this.state.data.modelName = providerConfig.defaultModel;
      this.state.data.baseUrl = providerConfig.defaultEndpoint;
      this.state.connectionState = { status: "untested", message: "" };
      this.renderAll({ preserveScroll: true });
      return;
    }

    this.state.data[field] = value;

    if (field === "modelName") {
      this.state.connectionState = { status: "untested", message: "" };
    }

    if (this.state.errors[field]) {
      delete this.state.errors[field];
    }

    this.renderAll({ preserveScroll: true });
  }

  /** 切换自定义下拉展开态 */
  toggleSelectMenu(field) {
    if (!field) return;
    this.state.openSelectField = this.state.openSelectField === field ? null : field;
    this.rerenderScreen({ preserveScroll: true });
  }

  /** 处理自定义下拉选项选择 */
  selectDropdownOption(field, value) {
    if (!field || value == null) return;

    if (field === "providerId") {
      const providerConfig = PROVIDER_CONFIGS.find((config) => config.value === value) || PROVIDER_CONFIGS[0];
      this.state.data.providerId = providerConfig.value;
      this.state.data.providerLabel = providerConfig.label;
      this.state.data.modelName = providerConfig.defaultModel;
      this.state.data.baseUrl = providerConfig.defaultEndpoint;
      this.state.connectionState = { status: "untested", message: "" };
      this.state.openSelectField = null;
      this.renderAll({ preserveScroll: true });
      return;
    }

    if (field === "modelName") {
      this.state.data.modelName = value;
      this.state.connectionState = { status: "untested", message: "" };
      this.state.openSelectField = null;
      this.renderAll({ preserveScroll: true });
    }
  }

  /** 切换自定义时间输入框的显示/隐藏 */
  toggleCustomTime(field) {
    if (!field || !Object.hasOwn(this.state.customTime, field)) return;
    this.state.customTime[field] = !this.state.customTime[field];
    this.rerenderScreen({ preserveScroll: true });
  }

  /** 模拟地理定位功能（预览环境使用模拟数据） */
  async useLocation() {
    this.state.locationState = {
      status: "loading",
      message: "正在获取当前位置，你也可以继续手动填写。",
    };
    this.rerenderScreen({ preserveScroll: true });

    await new Promise((resolve) => {
      window.setTimeout(resolve, 650);
    });

    this.state.data.homeLocation = this.state.data.homeLocation || "上海静安寺";
    this.state.locationState = {
      status: "success",
      message: "当前位置已模拟记录。如有需要，仍可改成更常用的地点。",
    };

    if (this.state.errors.homeLocation) {
      delete this.state.errors.homeLocation;
    }

    this.renderAll({ preserveScroll: true });
  }

  /** 模拟模型连接测试（预览环境使用模拟逻辑） */
  async testModelConnection() {
    this.state.connectionState = {
      status: "loading",
      message: "正在模拟测试连接，请稍候。",
    };
    this.renderAll({ preserveScroll: true });

    await new Promise((resolve) => {
      window.setTimeout(resolve, 480);
    });

    if (!this.state.data.modelName.trim()) {
      this.state.connectionState = {
        status: "failure",
        message: "先填一个模型标识，我才能帮你模拟连接测试。",
      };
      this.renderAll({ preserveScroll: true });
      return;
    }

    if (this.state.data.providerId === "compatible" && !this.state.data.baseUrl.trim()) {
      this.state.connectionState = {
        status: "failure",
        message: "兼容服务模式下，请补一个 Base URL 再测试。",
      };
      this.renderAll({ preserveScroll: true });
      return;
    }

    this.state.connectionState = {
      status: "success",
      message: "连接测试已通过，进入 App 后 assistant 可直接进入可服务态。",
    };
    this.renderAll({ preserveScroll: true });
  }

  /** 验证当前步骤并进入下一步 */
  goNext() {
    if (!canProceedCurrentScreen(this.state)) {
      this.state.errors = validateScreen(this.state);
      this.renderAll({ preserveScroll: true });
      return;
    }

    this.setScreen(this.state.screenIndex + 1);
  }

  /** 完成引导流程（跳过模型配置） */
  completeFlow() {
    persistOnboardingState(this.state);
    saveCompletionStatus({
      ...this.state.data,
      modelSetupStatus: "skipped",
    });

    window.setTimeout(() => {
      clearPersistedOnboardingState();
      window.location.assign("./preview-app-tabs.html");
    }, 120);
  }

  /** 完成引导流程并保存模型配置 */
  completeFlowWithModel() {
    // 检查连接测试是否成功
    if (this.state.connectionState.status !== "success") {
      this.state.connectionState = {
        status: "failure",
        message: "请先完成 API Key 验证后再开始服务。",
      };
      this.renderAll({ preserveScroll: true });
      return;
    }

    this.state.data.modelSetupStatus = "completed";
    persistOnboardingState(this.state);
    saveCompletionStatus({
      ...this.state.data,
      modelSetupStatus: "completed",
      providerId: this.state.data.providerId,
      providerLabel: this.state.data.providerLabel || getProviderLabel(this.state.data.providerId),
      modelName: this.state.data.modelName,
      baseUrl: this.state.data.baseUrl,
    });

    window.setTimeout(() => {
      clearPersistedOnboardingState();
      window.location.assign("./preview-app-tabs.html");
    }, 120);
  }

  /** 完成引导流程但不配置模型 */
  completeFlowWithoutModel() {
    this.state.data.modelSetupStatus = "skipped";
    persistOnboardingState(this.state);
    saveCompletionStatus({
      ...this.state.data,
      modelSetupStatus: "skipped",
      providerId: this.state.data.providerId,
      providerLabel: this.state.data.providerLabel || getProviderLabel(this.state.data.providerId),
      modelName: "",
      baseUrl: "",
    });

    window.setTimeout(() => {
      clearPersistedOnboardingState();
      window.location.assign("./preview-app-tabs.html");
    }, 120);
  }
}

window.PreviewOnboardingApp = PreviewOnboardingApp;
window.mountPreviewOnboarding = function mountPreviewOnboarding(root) {
  const app = new PreviewOnboardingApp(root);
  app.mount();
  window.previewOnboardingApp = app;
  return app;
};
