/**
 * Copyright (c) 2026 jeans-l / Liu / 221226. Released under the MIT License. See ../../LICENSE.md.
 * Origin: jeans-l
 * Signature: 221226
 * Maintainer: liu
 */

/**
 * 引导流程状态管理模块
 *
 * 负责：
 * - 定义表单选项常量（风格、身份、MBTI、时间预设等）
 * - 定义 AI 服务商配置（阿里、智谱、KIMI、DeepSeek、OpenAI 等）
 * - 创建和初始化表单状态
 * - 持久化和恢复状态到 localStorage
 * - 验证当前步骤的必填字段
 */

/** localStorage 存储键名 */
const ONBOARDING_STORAGE_KEY = "life-assistant.preview.onboarding";
const ONBOARDING_COMPLETE_KEY = "life-assistant.preview.onboarding-complete";

/** 助理表达风格选项 */
const TONE_OPTIONS = [
  { value: "warm-structured", label: "温和陪伴" },
  { value: "direct", label: "简洁直接" },
  { value: "proactive", label: "更主动提醒" },
];

/** 身份类型选项 */
const IDENTITY_OPTIONS = ["上班族", "学生", "自由职业", "其他"].map((value) => ({ value, label: value }));

/** MBTI 人格类型选项 */
const MBTI_OPTIONS = [
  "INTJ", "INTP", "ENTJ", "ENTP",
  "INFJ", "INFP", "ENFJ", "ENFP",
  "ISTJ", "ISTP", "ESTJ", "ESTP",
  "ISFJ", "ISFP", "ESFJ", "ESFP",
].map((value) => ({ value, label: value }));

/** 性别选项 */
const GENDER_OPTIONS = [
  { value: "女", label: "女" },
  { value: "男", label: "男" },
  { value: "", label: "不设置" },
];

/** 起床时间预设选项 */
const WAKE_OPTIONS = ["07:00", "07:30", "08:00"];

/** 睡觉时间预设选项 */
const SLEEP_OPTIONS = ["22:30", "23:00", "23:30"];

/** 午餐时间预设选项 */
const LUNCH_OPTIONS = ["11:30", "12:00", "12:30"];

/** 晚餐时间预设选项 */
const DINNER_OPTIONS = ["18:00", "18:30", "19:00"];

/** 饮食关注点选项 */
const DIET_FOCUS_OPTIONS = [
  { value: "daily", label: "日常" },
  { value: "fat_loss", label: "减脂" },
  { value: "none", label: "没什么特殊的" },
];

/** 忌口/过敏模式选项 */
const RESTRICTION_MODE_OPTIONS = [
  { value: "none", label: "没有" },
  { value: "has_restrictions", label: "有，需要告诉你" },
];

/** 常见忌口/过敏标签选项 */
const RESTRICTION_TAG_OPTIONS = ["香菜", "牛肉", "海鲜", "花生/坚果", "乳糖不耐"].map((value) => ({
  value,
  label: value,
}));

/** AI 服务商配置列表 */
const PROVIDER_CONFIGS = [
  // 国内首批
  {
    value: "ali",
    label: "通义",
    defaultModel: "qwen3.5-plus",
    defaultEndpoint: "https://dashscope.aliyuncs.com/compatible-mode/v1",
    endpointRequired: true,
    models: [
      { value: "qwen3.5-plus", label: "qwen3.5-plus (推荐)" },
      { value: "qwen3-max", label: "qwen3-max" },
      { value: "qwen3.6-plus", label: "qwen3.6-plus" },
    ]
  },
  {
    value: "doubao",
    label: "豆包",
    defaultModel: "doubao-seed-2.0-lite",
    defaultEndpoint: "https://ark.cn-beijing.volces.com/api/v3",
    endpointRequired: true,
    models: [
      { value: "doubao-seed-2.0-lite", label: "doubao-seed-2.0-lite (推荐)" },
      { value: "doubao-seed-2.0-pro", label: "doubao-seed-2.0-pro" },
      { value: "doubao-seed-2.0-mini", label: "doubao-seed-2.0-mini" },
    ]
  },
  {
    value: "deepseek",
    label: "DeepSeek",
    defaultModel: "deepseek-chat",
    defaultEndpoint: "https://api.deepseek.com",
    endpointRequired: true,
    models: [
      { value: "deepseek-chat", label: "deepseek-chat (推荐)" },
      { value: "deepseek-reasoner", label: "deepseek-reasoner" },
    ]
  },
  {
    value: "kimi",
    label: "Kimi",
    defaultModel: "kimi-k2.5",
    defaultEndpoint: "https://api.moonshot.cn/v1",
    endpointRequired: true,
    models: [
      { value: "kimi-k2.5", label: "kimi-k2.5 (推荐)" },
    ]
  },
  {
    value: "zhipu",
    label: "智谱",
    defaultModel: "glm-5-turbo",
    defaultEndpoint: "https://open.bigmodel.cn/api/paas/v4",
    endpointRequired: true,
    models: [
      { value: "glm-5-turbo", label: "glm-5-turbo (推荐)" },
      { value: "glm-5.1", label: "glm-5.1" },
    ]
  },
  // 国际固定
  {
    value: "openai",
    label: "ChatGPT",
    defaultModel: "gpt-5.4-mini",
    defaultEndpoint: "https://api.openai.com/v1",
    endpointRequired: false,
    models: [
      { value: "gpt-5.4-mini", label: "gpt-5.4-mini (推荐)" },
      { value: "gpt-5.4", label: "gpt-5.4" },
    ]
  },
  {
    value: "anthropic",
    label: "Claude",
    defaultModel: "claude-sonnet-4-6",
    defaultEndpoint: "https://api.anthropic.com/v1",
    endpointRequired: true,
    models: [
      { value: "claude-sonnet-4-6", label: "claude-sonnet-4-6 (推荐)" },
      { value: "claude-opus-4-7", label: "claude-opus-4-7" },
    ]
  },
  {
    value: "google",
    label: "Gemini",
    defaultModel: "gemini-2.5-flash",
    defaultEndpoint: "https://generativelanguage.googleapis.com/v1beta",
    endpointRequired: true,
    models: [
      { value: "gemini-2.5-flash", label: "gemini-2.5-flash (推荐)" },
      { value: "gemini-3", label: "gemini-3" },
    ]
  },
];

/** 服务商选项列表（用于选择芯片） */
const PROVIDER_OPTIONS = PROVIDER_CONFIGS.map(config => ({ value: config.value, label: config.label }));
const DEFAULT_PROVIDER = PROVIDER_CONFIGS[0];

/** 引导流程步骤 ID 列表 */
const SCREEN_IDS = ["welcome", "identity", "rhythm", "optional", "model-setup"];

/** 获取服务商显示名称 */
function getProviderLabel(providerId) {
  return PROVIDER_CONFIGS.find((item) => item.value === providerId)?.label || providerId || "";
}

/** 标准化服务商 ID，无效时返回默认值 */
function normalizeProviderId(value) {
  const validProviders = PROVIDER_CONFIGS.map(config => config.value);
  if (validProviders.includes(value)) return value;
  return DEFAULT_PROVIDER.value;
}

/** 创建默认表单数据 */
function createDefaultPreviewData() {
  return {
    assistantName: "生活助理",
    assistantTone: "warm-structured",
    displayName: "",
    homeLocation: "",
    identity: "",
    mbti: "",
    gender: "",
    wakeTime: "",
    sleepTime: "",
    lunchTime: "",
    dinnerTime: "",
    dietFocus: "",
    lunchBudgetMin: "",
    lunchBudgetMax: "",
    dinnerBudgetMin: "",
    dinnerBudgetMax: "",
    restrictionMode: "none",
    restrictionTags: [],
    restrictionCustom: "",
    modelSetupStatus: "pending",
    providerId: DEFAULT_PROVIDER.value,
    providerLabel: DEFAULT_PROVIDER.label,
    modelName: DEFAULT_PROVIDER.defaultModel,
    baseUrl: DEFAULT_PROVIDER.defaultEndpoint,
    apiKey: "",
  };
}

/** 标准化从 localStorage 恢复的状态数据，处理向后兼容 */
function normalizePersistedState(value) {
  if (!value || typeof value !== "object") return null;

  const persistedData = value.data || {};
  const providerId = normalizeProviderId(persistedData.providerId || persistedData.providerName);
  const providerConfig = PROVIDER_CONFIGS.find(c => c.value === providerId) || DEFAULT_PROVIDER;

  // 处理预算字段的向后兼容
  let lunchBudgetMin = persistedData.lunchBudgetMin || "";
  let lunchBudgetMax = persistedData.lunchBudgetMax || "";
  let dinnerBudgetMin = persistedData.dinnerBudgetMin || "";
  let dinnerBudgetMax = persistedData.dinnerBudgetMax || "";

  // 如果旧数据使用数组格式，转换为新格式
  if (Array.isArray(persistedData.lunchBudget)) {
    const [min, max] = persistedData.lunchBudget;
    lunchBudgetMin = String(min || 0);
    lunchBudgetMax = String(max || 35);
  }
  if (Array.isArray(persistedData.dinnerBudget)) {
    const [min, max] = persistedData.dinnerBudget;
    dinnerBudgetMin = String(min || 0);
    dinnerBudgetMax = String(max || 35);
  }

  const nextData = {
    ...createDefaultPreviewData(),
    ...persistedData,
    displayName: persistedData.displayName || persistedData.name || "",
    homeLocation: persistedData.homeLocation || persistedData.address || "",
    lunchBudgetMin,
    lunchBudgetMax,
    dinnerBudgetMin,
    dinnerBudgetMax,
    providerId,
    providerLabel: persistedData.providerLabel || persistedData.providerName || providerConfig.label,
    modelName: persistedData.modelName || providerConfig.defaultModel,
    baseUrl: persistedData.baseUrl || providerConfig.defaultEndpoint,
  };

  return {
    screenIndex:
      typeof value.screenIndex === "number" ? Math.max(0, Math.min(value.screenIndex, SCREEN_IDS.length - 1)) : 0,
    data: nextData,
    isMoreOpen: Boolean(value.isMoreOpen),
    customTime: {
      wakeTime: Boolean(value.customTime?.wakeTime),
      sleepTime: Boolean(value.customTime?.sleepTime),
      lunchTime: Boolean(value.customTime?.lunchTime),
      dinnerTime: Boolean(value.customTime?.dinnerTime),
    },
  };
}

/** 从 localStorage 读取持久化的引导状态 */
function readPersistedOnboardingState() {
  try {
    const raw = window.localStorage.getItem(ONBOARDING_STORAGE_KEY);
    if (!raw) return null;
    return normalizePersistedState(JSON.parse(raw));
  } catch {
    return null;
  }
}

/** 将当前状态持久化到 localStorage */
function persistOnboardingState(state) {
  try {
    window.localStorage.setItem(
      ONBOARDING_STORAGE_KEY,
      JSON.stringify({
        screenIndex: state.screenIndex,
        data: state.data,
        isMoreOpen: state.isMoreOpen,
        customTime: state.customTime,
      }),
    );
  } catch {
    // Preview persistence is best-effort only.
  }
}

/** 清除持久化的引导状态 */
function clearPersistedOnboardingState() {
  try {
    window.localStorage.removeItem(ONBOARDING_STORAGE_KEY);
  } catch {
    // Ignore preview persistence errors.
  }
}

/** 创建初始状态（尝试从 localStorage 恢复） */
function createInitialState() {
  const restored = readPersistedOnboardingState();
  const base = restored || {
    screenIndex: 0,
    data: createDefaultPreviewData(),
    isMoreOpen: false,
    customTime: {
      wakeTime: false,
      sleepTime: false,
      lunchTime: false,
      dinnerTime: false,
    },
  };

  return {
    ...base,
    openSelectField: null,
    errors: {},
    locationState: {
      status: "idle",
      message: restored ? "已恢复到上次填写位置。" : "",
    },
    connectionState: {
      status: "untested",
      message: "",
    },
  };
}

/** 根据步骤索引获取步骤 ID */
function getScreenId(screenIndex) {
  return SCREEN_IDS[screenIndex] || SCREEN_IDS[0];
}

/** 获取进度条元数据（标题和进度值） */
function getProgressMeta(screenIndex) {
  return {
    title: ["assistant identity", "基础身份", "日常节奏", "可选补充", "模型接入"][screenIndex] || "assistant identity",
    value: (screenIndex + 1) / SCREEN_IDS.length,
  };
}

/** 构建用餐时间显示文本 */
function buildMealChip(data) {
  const meals = [];
  if (data.lunchTime) meals.push(`午 ${data.lunchTime}`);
  if (data.dinnerTime) meals.push(`晚 ${data.dinnerTime}`);
  return meals.length ? meals.join(" / ") : "";
}

/** 构建引导完成时的摘要信息 */
function buildCompletionSummary(data) {
  const mealCopy = buildMealChip(data);

  let dietSummary = "";
  if (data.lunchBudgetMin || data.lunchBudgetMax) {
    const min = data.lunchBudgetMin || "0";
    const max = data.lunchBudgetMax || "不限";
    dietSummary = `${min === "0" ? "不限" : `${min}元`} - ${max === "0" ? "不限" : `${max}元`}`;
  }

  return {
    assistantName: data.assistantName || "生活助理",
    assistantTone: TONE_OPTIONS.find((item) => item.value === data.assistantTone)?.label || "温和陪伴",
    identitySummary: [data.displayName, data.homeLocation, data.identity, data.mbti].filter(Boolean).join(" / "),
    rhythmSummary: [
      data.wakeTime ? `${data.wakeTime} 起床` : "",
      data.sleepTime ? `${data.sleepTime} 睡觉` : "",
      mealCopy || "",
    ]
      .filter(Boolean)
      .join(" · "),
    dietSummary,
  };
}

/** 验证当前步骤的必填字段，返回错误信息对象 */
function validateScreen(state) {
  const screenId = getScreenId(state.screenIndex);
  const errors = {};

  if (screenId === "identity") {
    if (!String(state.data.displayName || "").trim()) {
      errors.displayName = "先告诉我该怎么称呼你。";
    }

    if (!String(state.data.homeLocation || "").trim()) {
      errors.homeLocation = "给我一个常驻地点，我才好把安排放稳。";
    }
  }

  if (screenId === "rhythm") {
    if (!String(state.data.wakeTime || "").trim()) {
      errors.wakeTime = "先给我一个大致起床时间。";
    }

    if (!String(state.data.sleepTime || "").trim()) {
      errors.sleepTime = "先给我一个大致睡觉时间。";
    }
  }

  return errors;
}

/** 检查当前步骤是否可以继续（无验证错误） */
function canProceedCurrentScreen(state) {
  return Object.keys(validateScreen(state)).length === 0;
}

/** 清除忌口/过敏的详细信息（当选择"没有"时） */
function clearRestrictionDetails(data) {
  return {
    ...data,
    restrictionTags: [],
    restrictionCustom: "",
  };
}

/** 切换数组中的值（用于多选芯片） */
function toggleArrayValue(values = [], nextValue) {
  if (values.includes(nextValue)) {
    return values.filter((item) => item !== nextValue);
  }

  return [...values, nextValue];
}

/** 判断是否应显示"次日睡觉"提示（睡觉时间早于起床时间） */
function shouldShowNextDaySleepHint(data) {
  if (!data.wakeTime || !data.sleepTime) return false;
  return data.sleepTime < data.wakeTime;
}

/** 保存引导完成状态到 localStorage */
function saveCompletionStatus(data) {
  try {
    window.localStorage.setItem(
      ONBOARDING_COMPLETE_KEY,
      JSON.stringify({
        ...data,
        modelSetupStatus: data.modelSetupStatus || "skipped",
        providerId: data.providerId || DEFAULT_PROVIDER.value,
        providerLabel: data.providerLabel || getProviderLabel(data.providerId || DEFAULT_PROVIDER.value),
        modelName: data.modelName || "",
        baseUrl: data.baseUrl || "",
        completedAt: new Date().toISOString(),
      }),
    );
  } catch {
    // Preview persistence is best-effort only.
  }
}

/** 从 localStorage 读取引导完成状态 */
function readCompletionStatus() {
  try {
    const raw = window.localStorage.getItem(ONBOARDING_COMPLETE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/** 清除引导完成状态 */
function clearCompletionStatus() {
  try {
    window.localStorage.removeItem(ONBOARDING_COMPLETE_KEY);
  } catch {
    // Ignore preview persistence errors.
  }
}
