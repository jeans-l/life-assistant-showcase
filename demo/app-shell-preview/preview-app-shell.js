/**
 * Copyright (c) 2026 jeans-l / Liu / 221226. Released under the MIT License. See ../../LICENSE.md.
 * Origin: jeans-l
 * Signature: 221226
 * Maintainer: liu
 */

const APP_TIME = "10:00";
const APP_BATTERY = "100%";
const APP_DATE = "4月10日";
const APP_DAY = "周五";
const APP_TEMPERATURE = "24°C";
const APP_OUTFIT = "适合短袖 + 薄外套";
const SCHEDULE_MONTH = "2026年4月";
const ONBOARDING_COMPLETE_STORAGE_KEY = "life-assistant.preview.onboarding-complete";

// 治理状态枚举
const GovernanceStates = {
  EXECUTE: "execute",
  WAIT_CONFIRMATION: "wait-confirmation",
  HANDOFF_ONLY: "handoff-only",
  BLOCKED: "blocked",
};

const GovernanceStateMeta = {
  [GovernanceStates.EXECUTE]: {
    icon: "✓",
    color: "#22c55e",
    label: "可以直接执行",
    description: "这次操作可以自动完成。",
  },
  [GovernanceStates.WAIT_CONFIRMATION]: {
    icon: "!",
    color: "#f59e0b",
    label: "需要你确认",
    description: "这次操作需要你确认后才会执行。",
  },
  [GovernanceStates.HANDOFF_ONLY]: {
    icon: "→",
    color: "#3b82f6",
    label: "需要外部服务",
    description: "这次操作需要外部服务配合，assistant 会帮你转交。",
  },
  [GovernanceStates.BLOCKED]: {
    icon: "✕",
    color: "#ef4444",
    label: "暂时无法执行",
    description: "当前条件不满足，无法执行这次操作。",
  },
};

const MEAL_OPTIONS = [
  {
    id: "super-bowl",
    title: "蜜汁鸡腿超级碗",
    merchant: "超级碗",
    sourceLabel: "常吃",
    freshnessBasis: "预计 30 分钟内送达",
    profile: "工作日午餐 · 清淡高蛋白",
    tags: ["鸡腿肉", "谷物饭", "羽衣甘蓝"],
    price: "¥35",
    arrival: "预计 28 分钟送达",
    visualVariant: "default",
  },
  {
    id: "lemon-bowl",
    title: "柠檬鸡腿能量碗",
    merchant: "朝暮食堂",
    sourceLabel: "更快",
    freshnessBasis: "预计 25 分钟内送达",
    profile: "更轻一点 · 适合会前",
    tags: ["鸡腿肉", "糙米", "西兰花"],
    price: "¥32",
    arrival: "预计 24 分钟送达",
    visualVariant: "lighter",
  },
  {
    id: "tofu-bowl",
    title: "豆腐谷物轻食碗",
    merchant: "Super Bowl",
    sourceLabel: "备选",
    freshnessBasis: "预计 26 分钟内送达",
    profile: "更稳妥的轻口味备选",
    tags: ["豆腐", "藜麦", "甘蓝"],
    price: "¥30",
    arrival: "预计 26 分钟送达",
    visualVariant: "lighter",
  },
];

const BASE_TASKS = [
  {
    id: "lunch",
    kind: "meal",
    title: "午餐",
    status: "待处理",
    timeLabel: "12:00-13:00",
    note: "已保留常用餐具备注",
    support: "先拍板一份稳妥的，再按口味微调。",
    state: "pending",
  },
  {
    id: "review",
    kind: "task",
    title: "整理周报",
    status: "待处理",
    timeLabel: "15:00 前",
    note: "下午前补齐 3 个要点就可以",
    support: "先收住这件事，后面会更轻松。",
    state: "pending",
  },
  {
    id: "walk",
    kind: "task",
    title: "晚间散步",
    status: "已保留",
    timeLabel: "18:30",
    note: "如果临时加班，晚点再决定也可以",
    support: "先不用展开，傍晚前再看就好。",
    state: "pending",
  },
];

const BASE_DAYS = [
  {
    id: "tue",
    label: "7",
    weekday: "周二",
    topLabel: "4 月 7 日 周二",
    summary: "上午较轻，下午和晚上有几件生活安排。",
    allDay: [],
    events: [
      {
        id: "laundry",
        title: "洗衣送洗",
        time: "10:05-10:50",
        startHour: 10,
        startMinute: 5,
        endHour: 10,
        endMinute: 50,
        startMinuteTotal: 605,
        endMinuteTotal: 650,
        lane: 0,
        laneSpan: 1,
        status: "已确认",
        tone: "soft",
        colorTone: "soft",
        note: "顺路把上周的外套一起送去。",
        location: "小区洗衣房",
        organizer: "你自己",
        attendees: ["自己"],
        reminder: "提前 10 分钟",
        owner: "你自己添加",
      },
      {
        id: "brunch",
        title: "午餐提前预定",
        time: "11:20-12:05",
        startHour: 11,
        startMinute: 20,
        endHour: 12,
        endMinute: 5,
        startMinuteTotal: 680,
        endMinuteTotal: 725,
        lane: 0,
        laneSpan: 1,
        status: "待处理",
        tone: "current",
        colorTone: "solid",
        note: "想吃热一点的，最好 30 分钟内送到。",
        location: "楼下轻食店",
        organizer: "生活助理",
        attendees: ["自己"],
        reminder: "提前 5 分钟",
        owner: "生活助理建议",
      },
      {
        id: "pharmacy",
        title: "去药房补常备药",
        time: "14:10-14:45",
        startHour: 14,
        startMinute: 10,
        endHour: 14,
        endMinute: 45,
        startMinuteTotal: 850,
        endMinuteTotal: 885,
        lane: 0,
        laneSpan: 1,
        status: "已确认",
        tone: "default",
        colorTone: "soft",
        note: "顺手补一盒维生素和创可贴。",
        location: "静安药房",
        organizer: "你自己",
        attendees: ["自己"],
        reminder: "提前 5 分钟",
        owner: "你自己添加",
      },
      {
        id: "family-call",
        title: "和家里通话",
        time: "19:40-20:20",
        startHour: 19,
        startMinute: 40,
        endHour: 20,
        endMinute: 20,
        startMinuteTotal: 1180,
        endMinuteTotal: 1220,
        lane: 0,
        laneSpan: 1,
        status: "待开始",
        tone: "soft",
        colorTone: "soft",
        note: "顺便确认周末回家时间。",
        location: "家里",
        organizer: "你自己",
        attendees: ["妈妈"],
        reminder: "提前 10 分钟",
        owner: "你自己添加",
      },
    ],
  },
  {
    id: "wed",
    label: "8",
    weekday: "周三",
    topLabel: "4 月 8 日 周三",
    summary: "今天外出和傍晚运动会更密一点。",
    allDay: [{ title: "猫粮到货", colorTone: "blue" }],
    events: [
      {
        id: "body-check",
        title: "体检报告复查",
        time: "10:40-11:35",
        startHour: 10,
        startMinute: 40,
        endHour: 11,
        endMinute: 35,
        startMinuteTotal: 640,
        endMinuteTotal: 695,
        lane: 0,
        laneSpan: 1,
        status: "待处理",
        tone: "current",
        colorTone: "solid",
        note: "带上上次的检验单，顺便问一下睡眠问题。",
        location: "瑞慈体检中心",
        organizer: "你自己",
        attendees: ["自己"],
        reminder: "提前 5 分钟",
        owner: "你自己添加",
      },
      {
        id: "fruit-pickup",
        title: "取水果和酸奶",
        time: "11:35-12:05",
        startHour: 11,
        startMinute: 35,
        endHour: 12,
        endMinute: 5,
        startMinuteTotal: 695,
        endMinuteTotal: 725,
        lane: 0,
        laneSpan: 1,
        status: "待处理",
        tone: "default",
        colorTone: "solid",
        note: "顺手把明天早餐要用的也一起拿了。",
        location: "盒马自提点",
        organizer: "生活助理",
        attendees: ["自己"],
        reminder: "提前 5 分钟",
        owner: "生活助理建议",
      },
      {
        id: "groceries",
        title: "补给采购",
        time: "14:05-15:35",
        startHour: 14,
        startMinute: 5,
        endHour: 15,
        endMinute: 35,
        startMinuteTotal: 845,
        endMinuteTotal: 935,
        lane: 0,
        laneSpan: 1,
        status: "已确认",
        tone: "default",
        colorTone: "soft",
        note: "以冰箱补货为主，先买蛋白和蔬菜。",
        location: "山姆会员店",
        organizer: "你自己",
        attendees: ["自己"],
        reminder: "提前 5 分钟",
        owner: "你自己添加",
      },
      {
        id: "gift-store",
        title: "挑生日礼物",
        time: "15:20-16:00",
        startHour: 15,
        startMinute: 20,
        endHour: 16,
        endMinute: 0,
        startMinuteTotal: 920,
        endMinuteTotal: 960,
        lane: 1,
        laneSpan: 1,
        status: "待确认",
        tone: "warning",
        colorTone: "outline",
        note: "先看看香氛和小摆件，预算别超 200。",
        location: "静安嘉里中心",
        organizer: "生活助理",
        attendees: ["自己"],
        reminder: "提前 5 分钟",
        owner: "生活助理建议",
      },
      {
        id: "gym",
        title: "去健身房",
        time: "18:15-19:15",
        startHour: 18,
        startMinute: 15,
        endHour: 18,
        endMinute: 75,
        startMinuteTotal: 1095,
        endMinuteTotal: 1155,
        lane: 0,
        laneSpan: 1,
        status: "已确认",
        tone: "default",
        colorTone: "solid",
        note: "今天做背部和 20 分钟有氧。",
        location: "Anytime Fitness",
        organizer: "你自己",
        attendees: ["自己"],
        reminder: "提前 5 分钟",
        owner: "你自己添加",
      },
      {
        id: "mom-call",
        title: "和妈妈视频",
        time: "19:35-20:20",
        startHour: 19,
        startMinute: 35,
        endHour: 20,
        endMinute: 20,
        startMinuteTotal: 1175,
        endMinuteTotal: 1220,
        lane: 0,
        laneSpan: 1,
        status: "待开始",
        tone: "soft",
        colorTone: "soft",
        note: "顺便确认周末家里要带的东西。",
        location: "家里",
        organizer: "你自己",
        attendees: ["妈妈"],
        reminder: "提前 5 分钟",
        owner: "你自己添加",
      },
    ],
  },
  {
    id: "thu",
    label: "9",
    weekday: "周四",
    topLabel: "4 月 9 日 周四",
    summary: "今天偏生活补给，傍晚运动前后会更密。",
    allDay: [{ title: "水电费待缴", colorTone: "blue" }],
    events: [
      {
        id: "breakfast-prep",
        title: "备明天早餐",
        time: "10:50-11:25",
        startHour: 10,
        startMinute: 50,
        endHour: 11,
        endMinute: 25,
        startMinuteTotal: 650,
        endMinuteTotal: 685,
        lane: 0,
        laneSpan: 1,
        status: "待处理",
        tone: "warning",
        colorTone: "outline",
        note: "牛奶、鸡蛋和燕麦别忘了补。",
        location: "家里",
        organizer: "生活助理",
        attendees: ["自己"],
        reminder: "提前 5 分钟",
        owner: "生活助理建议",
      },
      {
        id: "parcel",
        title: "拿快递",
        time: "11:30-12:00",
        startHour: 11,
        startMinute: 30,
        endHour: 12,
        endMinute: 0,
        startMinuteTotal: 690,
        endMinuteTotal: 720,
        lane: 0,
        laneSpan: 1,
        status: "已确认",
        tone: "soft",
        colorTone: "soft",
        note: "有猫粮和洗护用品两件。",
        location: "丰巢快递柜",
        organizer: "你自己",
        attendees: ["自己"],
        reminder: "提前 5 分钟",
        owner: "你自己添加",
      },
      {
        id: "coffee-plan",
        title: "咖啡店写周计划",
        time: "14:00-15:10",
        startHour: 14,
        startMinute: 0,
        endHour: 15,
        endMinute: 10,
        startMinuteTotal: 840,
        endMinuteTotal: 910,
        lane: 0,
        laneSpan: 1,
        status: "已确认",
        tone: "soft",
        colorTone: "soft",
        note: "把周末要做的 3 件事先写清楚。",
        location: "Manner 咖啡",
        organizer: "你自己",
        attendees: ["自己"],
        reminder: "提前 5 分钟",
        owner: "你自己添加",
      },
      {
        id: "bookstore",
        title: "去书店挑礼物",
        time: "14:20-15:00",
        startHour: 14,
        startMinute: 20,
        endHour: 15,
        endMinute: 0,
        startMinuteTotal: 860,
        endMinuteTotal: 900,
        lane: 1,
        laneSpan: 1,
        status: "待确认",
        tone: "warning",
        colorTone: "outline",
        note: "如果咖啡店坐不住，就直接过去。",
        location: "西西弗书店",
        organizer: "生活助理",
        attendees: ["自己"],
        reminder: "提前 5 分钟",
        owner: "生活助理建议",
      },
      {
        id: "pilates-commute",
        title: "去普拉提馆",
        time: "17:40-18:10",
        startHour: 17,
        startMinute: 40,
        endHour: 18,
        endMinute: 10,
        startMinuteTotal: 1060,
        endMinuteTotal: 1090,
        lane: 0,
        laneSpan: 1,
        status: "已确认",
        tone: "soft",
        colorTone: "soft",
        note: "提前 5 分钟到，顺路买瓶水。",
        location: "地铁 2 号线",
        organizer: "你自己",
        attendees: ["自己"],
        reminder: "提前 5 分钟",
        owner: "你自己添加",
      },
      {
        id: "pilates",
        title: "普拉提",
        time: "18:20-19:20",
        startHour: 18,
        startMinute: 20,
        endHour: 19,
        endMinute: 20,
        startMinuteTotal: 1100,
        endMinuteTotal: 1160,
        lane: 0,
        laneSpan: 1,
        status: "已确认",
        tone: "default",
        colorTone: "solid",
        note: "今天做核心和拉伸，别排太满。",
        location: "梵几普拉提",
        organizer: "你自己",
        attendees: ["自己"],
        reminder: "提前 5 分钟",
        owner: "你自己添加",
      },
      {
        id: "stretch",
        title: "睡前拉伸",
        time: "20:00-20:40",
        startHour: 20,
        startMinute: 0,
        endHour: 20,
        endMinute: 40,
        startMinuteTotal: 1200,
        endMinuteTotal: 1240,
        lane: 0,
        laneSpan: 1,
        status: "待开始",
        tone: "soft",
        colorTone: "soft",
        note: "做完就可以早点休息。",
        location: "家里",
        organizer: "生活助理",
        attendees: ["自己"],
        reminder: "提前 10 分钟",
        owner: "生活助理建议",
      },
    ],
  },
];

const BASE_ROLES = [
  {
    id: "food",
    name: "饮食助理",
    summary: "帮你在预算和时间内快速定一餐。",
    scene: "午餐快到了，但还不想花时间挑。",
    positioning: "在饭点前帮你把预算、口味和送达时间一起收住。",
    boundary: ["预算内推荐", "清淡 / 热食偏好", "送达时间优先"],
    boundaryNote: "负责定餐与轻量替代，不负责长期饮食方案和营养管理。",
    examples: ["35 元内来两份热食", "今天想吃清淡一点", "优先更快送达"],
    timing: "工作日午餐、晚餐前最好用。",
    settingsEntry: "去我的 > 偏好管理调整预算、忌口和常用口味。",
    dependency: "餐厅推荐已可用",
    availability: "可用",
    enabled: true,
    result: "昨天 12:08 帮你把午餐压到 32 元。",
    accent: "blue",
    badge: "FOOD",
    skills: ["预算内", "轻食", "热食", "送达快"],
    stats: ["预算 25-40", "午餐常用", "清淡优先", "10 分钟内定"],
  },
  {
    id: "news",
    name: "News 简报",
    summary: "把今天值得看的新闻压成几条。",
    scene: "没时间刷太多，但想知道今天发生了什么。",
    positioning: "把分散资讯压成几条可快速扫读的重点。",
    boundary: ["重点新闻", "行业摘要", "按时间段推送"],
    boundaryNote: "负责筛重点和压缩摘要，不负责替你做深度研究判断。",
    examples: ["给我 3 条今天大事", "中午看科技新闻", "晚上来个收盘简报"],
    timing: "通勤、午休、下班前最好用。",
    settingsEntry: "去我的 > 提醒与隐私调整主动提醒频率和简报强度。",
    dependency: "资讯源已可用",
    availability: "可用",
    enabled: true,
    result: "今天早上已经给过一次 3 条简报。",
    accent: "blue",
    badge: "NEWS",
    skills: ["3 条快读", "科技", "热点", "晚间总结"],
    stats: ["早晚各 1 次", "3 分钟读完", "热点优先", "可追踪"],
  },
  {
    id: "fitness",
    name: "健身教练",
    summary: "按你的状态给出更好坚持的训练建议。",
    scene: "想练一下，但不想自己重新编计划。",
    positioning: "在你有空动一动时，先给一套更容易坚持的训练安排。",
    boundary: ["居家训练", "器械训练", "恢复日安排"],
    boundaryNote: "负责训练建议和节奏安排，不替代专业医疗或康复建议。",
    examples: ["今晚来个 20 分钟居家训练", "给我一份背部训练", "今天适合恢复吗"],
    timing: "下班前、周末前最好用。",
    settingsEntry: "去我的 > 目标与阶段调整阶段标签和训练节奏。",
    dependency: "训练模板已可用",
    availability: "可用",
    enabled: true,
    result: "上周已经帮你排过一次恢复日训练。",
    accent: "purple",
    badge: "FIT",
    skills: ["20 分钟", "器械", "居家", "恢复日"],
    stats: ["每周 3 次", "减脂中", "恢复优先", "难度可调"],
  },
  {
    id: "travel",
    name: "出行助手",
    summary: "帮你把通勤、打车和到达时间算稳。",
    scene: "要出门前，想知道现在怎么走更稳。",
    positioning: "在出门前把路线、出发时间和迟到风险一起算稳。",
    boundary: ["打车时间", "地铁通勤", "出发提醒"],
    boundaryNote: "负责路线与到达时间判断，不替你处理票务和复杂行程预订。",
    examples: ["现在出发会不会迟到", "帮我选地铁还是打车", "提前多久提醒我"],
    timing: "出门前 30 分钟最好用。",
    settingsEntry: "去我的 > 系统记忆与习惯调整通勤方式和出发偏好。",
    dependency: "定位与通勤偏好已可用",
    availability: "可用",
    enabled: false,
    result: "昨天帮你把出门提醒提前了 10 分钟。",
    accent: "orange",
    badge: "GO",
    skills: ["打车", "地铁", "ETA", "提醒"],
    stats: ["通勤 40 分钟", "地铁优先", "迟到预警", "出门提醒"],
  },
];

const THREADS = {
  today: [
    { role: "assistant", text: "我先给你留一份更稳妥的午餐方案。" },
    { role: "system", text: "12:00 前下单会更从容。" },
  ],
  schedule: [
    { role: "assistant", text: "我先帮你看看今天的生活安排会不会太挤。" },
    { role: "system", text: "如果你愿意，我可以顺一下出门和运动时间。" },
  ],
  roles: [
    { role: "assistant", text: "你想做什么，我来帮你挑更合适的助理。" },
    { role: "system", text: "选好后可以直接开始。" },
  ],
  me: [
    { role: "assistant", text: "你可以直接告诉我想改哪一项。" },
    { role: "system", text: "改完会马上更新到相关设置里。" },
  ],
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function readOnboardingSnapshot() {
  try {
    const raw = window.localStorage.getItem(ONBOARDING_COMPLETE_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function formatPreviewBudget(value) {
  if (Array.isArray(value) && value.length >= 2) {
    const [start, end] = value.map(Number);
    if (Number.isFinite(start) && Number.isFinite(end)) {
      return `${start === 0 ? "不限" : `${start}元`} - ${end}元`;
    }
  }

  if (typeof value === "string" && value.includes(",")) {
    const [start, end] = value.split(",").map(Number);
    if (Number.isFinite(start) && Number.isFinite(end)) {
      return `${start === 0 ? "不限" : `${start}元`} - ${end}元`;
    }
  }

  return value || "25-40";
}

function getProviderDisplayName(snapshot) {
  if (snapshot?.providerLabel) return snapshot.providerLabel;
  if (snapshot?.providerName) return snapshot.providerName;
  if (snapshot?.providerId === "openai") return "OpenAI";
  if (snapshot?.providerId === "compatible") return "自定义兼容服务";
  return "未知";
}

function buildProfileSummary(snapshot) {
  const name = snapshot?.displayName || snapshot?.name || "小宇";
  const address = snapshot?.homeLocation || snapshot?.address || "上海静安寺";
  const identity = snapshot?.identity || "上班族";
  const mbti = snapshot?.mbti || "";
  const assistantName = snapshot?.assistantName || "生活助理";
  const assistantTone = snapshot?.assistantTone || "warm-structured";
  const wakeTime = snapshot?.wakeTime || "07:30";
  const sleepTime = snapshot?.sleepTime || "23:00";
  const lunchTime = snapshot?.lunchTime || "12:00";
  const dinnerTime = snapshot?.dinnerTime || "18:30";
  const stageTags = Array.isArray(snapshot?.stageTags) ? snapshot.stageTags : ["恢复作息中"];
  const budget = formatPreviewBudget(snapshot?.lunchBudget);
  // 使用 dietFocus 和 restrictionTags，与实际 onboarding 一致
  const dietFocus = snapshot?.dietFocus || "";
  const dietFocusLabel = dietFocus === "fat_loss" ? "减脂" : dietFocus === "daily" ? "日常" : "";
  const restrictionTags = Array.isArray(snapshot?.restrictionTags) ? snapshot.restrictionTags : [];
  // 显示饮食关注点或忌口标签
  const dietary = dietFocusLabel || (restrictionTags.length > 0 ? restrictionTags : []);
  const gender = snapshot?.gender || "";
  const toneLabel =
    assistantTone === "direct" ? "简洁直接" : assistantTone === "proactive" ? "更主动提醒" : "温和陪伴";

  return {
    name,
    address,
    identity,
    mbti,
    assistantName,
    assistantTone: toneLabel,
    wakeTime,
    sleepTime,
    lunchTime,
    dinnerTime,
    stageTags,
    budget,
    dietary,
    gender,
  };
}

function deriveModelState(snapshot) {
  // 无 snapshot 或未完成模型设置
  if (!snapshot || snapshot.modelSetupStatus !== "completed") {
    return {
      modelStatus: "not_configured",
      modelStatusNote: snapshot?.modelSetupStatus === "skipped" ? "已跳过模型接入" : "尚未完成模型接入",
      showModelPrompt: true,
      providerName: null,
      modelName: null,
    };
  }

  // 已完成模型设置
  return {
    modelStatus: "available",
    modelStatusNote: `${getProviderDisplayName(snapshot)} / ${snapshot.modelName || "未知"} · 已连接`,
    showModelPrompt: false,
    providerName: getProviderDisplayName(snapshot),
    modelName: snapshot.modelName,
  };
}

function createInitialState() {
  let snapshot = null;
  try {
    snapshot = readOnboardingSnapshot();
  } catch (e) {
    snapshot = null;
  }
  // 强制 fallback 到 mock 数据，保证 demo 总能渲染
  if (!snapshot || typeof snapshot !== 'object') snapshot = {};
  const profile = buildProfileSummary(snapshot);
  const modelState = deriveModelState(snapshot);

  // 检查 mock 数据完整性，防止全空
  const safeTasks = Array.isArray(BASE_TASKS) && BASE_TASKS.length ? clone(BASE_TASKS) : [
    { id: "demo", kind: "task", title: "演示任务", status: "待处理", timeLabel: "12:00-13:00", note: "这是一个演示任务。", support: "演示支持信息。", state: "pending" }
  ];
  const safeDays = Array.isArray(BASE_DAYS) && BASE_DAYS.length ? clone(BASE_DAYS) : [
    { id: "demo", label: "1", weekday: "周一", topLabel: "4 月 1 日 周一", summary: "演示日程。", allDay: [], events: [] }
  ];
  const safeRoles = Array.isArray(BASE_ROLES) && BASE_ROLES.length ? clone(BASE_ROLES) : [
    { id: "demo", name: "演示角色", summary: "演示角色摘要。", scene: "演示场景。", positioning: "演示定位。", boundary: ["演示边界"], boundaryNote: "演示边界说明。", examples: ["演示例子"], timing: "演示时机。", settingsEntry: "演示设置入口。", dependency: "演示依赖。", availability: "可用", enabled: true, result: "演示结果。", accent: "blue", badge: "DEMO", skills: ["演示技能"], stats: ["演示统计"] }
  ];

  return {
    activeTab: "today",
    profile,
    tasks: safeTasks,
    mealOptions: clone(MEAL_OPTIONS),
    currentMealIndex: 0,
    includeUtensils: true,
    days: safeDays,
    selectedDayId: safeDays[0]?.id || "demo",
    roles: safeRoles,
    selectedRoleId: safeRoles[0]?.id || "demo",
    ...modelState,
    privacyNote: "主动提醒设为「仅关键变更」，隐私边界未改动。",
    pendingAssistantAction: null,
    pendingModelSetupAction: null,
    scheduleState: {
      view: "collapsed",
      editingEventId: null,
      editingFields: {},
      lastSyncResult: null,
    },
    sheet: null,
    toast: snapshot && profile && profile.name ? `欢迎回来，${profile.name}。` : "",
  };
}

const CALENDAR_START_HOUR = 10;
const CALENDAR_END_HOUR = 20;
const CALENDAR_HOUR_HEIGHT = 68;

function sunIcon() {
  return `
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="16" r="6.5"></circle>
      <path d="M16 2.75v3.5M16 25.75v3.5M6.58 6.58l2.46 2.46M22.96 22.96l2.46 2.46M2.75 16h3.5M25.75 16h3.5M6.58 25.42l2.46-2.46M22.96 9.04l2.46-2.46"></path>
    </svg>
  `;
}

function micIcon() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="8.2" y="3.1" width="7.6" height="12" rx="3.8"></rect>
      <path d="M5.9 11.8a6.1 6.1 0 0 0 12.2 0M12 17.9v3.1M9.2 21h5.6"></path>
    </svg>
  `;
}

function sendIcon() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m4.5 12 14.5-6-4.4 6 4.4 6z"></path>
    </svg>
  `;
}

function backIcon() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m14.75 6.25-5.5 5.75 5.5 5.75"></path>
    </svg>
  `;
}

function moreIcon() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="5.5" cy="12" r="1.5"></circle>
      <circle cx="12" cy="12" r="1.5"></circle>
      <circle cx="18.5" cy="12" r="1.5"></circle>
    </svg>
  `;
}

function trashIcon() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4.75 6.75h14.5"></path>
      <path d="M9.25 6.75V5a1.25 1.25 0 0 1 1.25-1.25h3A1.25 1.25 0 0 1 14.75 5v1.75"></path>
      <path d="M7.25 9.25v8.5a1.5 1.5 0 0 0 1.5 1.5h6.5a1.5 1.5 0 0 0 1.5-1.5v-8.5"></path>
      <path d="M10 10.5v6"></path>
      <path d="M14 10.5v6"></path>
    </svg>
  `;
}

function searchIcon() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5"></circle>
      <path d="m16 16 4.25 4.25"></path>
    </svg>
  `;
}

function calendarIcon() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3.5" y="5.5" width="17" height="15" rx="2.5"></rect>
      <path d="M7.5 3.75v3.5M16.5 3.75v3.5M3.5 9.5h17"></path>
    </svg>
  `;
}

function shareIcon() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M14 5h5v5"></path>
      <path d="M10 14 19 5"></path>
      <path d="M19 13v5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 18V7A1.5 1.5 0 0 1 6.5 5H12"></path>
    </svg>
  `;
}

function editIcon() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m4.5 16.75 8.95-8.95 4.5 4.5-8.95 8.95L4.5 22z"></path>
      <path d="m12.85 8.4 2.3-2.3a1.6 1.6 0 0 1 2.25 0l.5.5a1.6 1.6 0 0 1 0 2.25l-2.3 2.3"></path>
    </svg>
  `;
}

function plusIcon() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 5v14M5 12h14"></path>
    </svg>
  `;
}

function qrIcon() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4z"></path>
      <path d="M15 15h2v2h-2zM19 15h1v5h-5v-1M14 19h2"></path>
    </svg>
  `;
}

function chevronRightIcon() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m9 5 7 7-7 7"></path>
    </svg>
  `;
}

function videoIcon() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3.5" y="6.5" width="11" height="11" rx="2.5"></rect>
      <path d="m14.5 10 5-2.5v9l-5-2.5"></path>
    </svg>
  `;
}

function phoneIcon() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m7.25 4.5 2.2 4.4-1.7 1.8a13.2 13.2 0 0 0 5.55 5.55l1.8-1.7 4.4 2.2-1.1 3.8a2 2 0 0 1-2 1.45A15.9 15.9 0 0 1 3 7.6a2 2 0 0 1 1.45-2z"></path>
    </svg>
  `;
}

function locationIcon() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 20.5s6-5.55 6-10.25a6 6 0 1 0-12 0c0 4.7 6 10.25 6 10.25Z"></path>
      <circle cx="12" cy="10.25" r="2.4"></circle>
    </svg>
  `;
}

function peopleIcon() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="9" cy="9" r="2.5"></circle>
      <circle cx="16.5" cy="10" r="2"></circle>
      <path d="M4.5 18c0-2.6 2.15-4.5 4.5-4.5S13.5 15.4 13.5 18M14.5 17.5c.4-1.7 1.7-3 3.5-3 1.4 0 2.6.7 3.2 2"></path>
    </svg>
  `;
}

function noteIcon() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 3.75h8l4 4v12.5H6z"></path>
      <path d="M14 3.75v4h4M9 12h6M9 15.5h6"></path>
    </svg>
  `;
}

function bellIcon() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6.75 16.5h10.5l-1.15-1.8V10.8A4.1 4.1 0 0 0 12 6.7a4.1 4.1 0 0 0-4.1 4.1v3.9z"></path>
      <path d="M10.2 18.5a2 2 0 0 0 3.6 0"></path>
    </svg>
  `;
}

function userIcon() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="8.25" r="3.25"></circle>
      <path d="M5 19c1.6-3 4.1-4.5 7-4.5S17.4 16 19 19"></path>
    </svg>
  `;
}

function messageTabIcon() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 17.5h8.5l3.5 2v-2h.5A2.5 2.5 0 0 0 21 15V7a2.5 2.5 0 0 0-2.5-2.5h-12A2.5 2.5 0 0 0 4 7v8A2.5 2.5 0 0 0 6.5 17.5"></path>
    </svg>
  `;
}

function sparklesIcon() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m12 3 1.3 3.7L17 8l-3.7 1.3L12 13l-1.3-3.7L7 8l3.7-1.3z"></path>
      <path d="m18.5 13.5.7 2 .8.3-2 .7-.7 2-.7-2-2-.7 2-.3zM6 14.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z"></path>
    </svg>
  `;
}

function checkCircleIcon() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="8.25"></circle>
      <path d="m8.7 12.1 2.1 2.15 4.45-4.65"></path>
    </svg>
  `;
}

function serviceIcon() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4.5 10.5A7.5 7.5 0 0 1 19 8.25c0 4.95-4.2 8.5-7 10.25-2.8-1.75-7-5.3-7-8z"></path>
      <path d="m8.5 10.7 2.15 2.2 5-5"></path>
    </svg>
  `;
}

function boxIcon() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m12 3.75 7 4v8.5l-7 4-7-4v-8.5z"></path>
      <path d="m5 7.75 7 4 7-4M12 11.75v8.5"></path>
    </svg>
  `;
}

function photoIcon() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="5.5" width="16" height="13" rx="2.5"></rect>
      <circle cx="9" cy="10" r="1.5"></circle>
      <path d="m6.5 16 3.8-3.8 2.7 2.7 2-2 2.5 3.1"></path>
    </svg>
  `;
}

function gearIcon() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m12 3.8 1 1.9 2.2.3.8 2 1.9 1-.6 2.1 1.1 1.8-1.6 1.5-.2 2.2-2.2.5-1.4 1.7-2-.8-2 .8-1.4-1.7-2.2-.5-.2-2.2L4.2 13l1.1-1.8-.6-2.1 1.9-1 .8-2 2.2-.3z"></path>
      <circle cx="12" cy="12" r="2.7"></circle>
    </svg>
  `;
}

function mealIllustration() {
  return `
    <svg viewBox="0 0 116 116" aria-hidden="true">
      <defs>
        <linearGradient id="mealGlow" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stop-color="#fef5dc"></stop>
          <stop offset="100%" stop-color="#d9edd8"></stop>
        </linearGradient>
      </defs>
      <rect x="10" y="10" width="96" height="96" rx="28" fill="url(#mealGlow)"></rect>
      <ellipse cx="58" cy="61" rx="34" ry="24" fill="#fffaf2"></ellipse>
      <ellipse cx="58" cy="63" rx="31" ry="20" fill="#f7f3ea"></ellipse>
      <circle cx="44" cy="57" r="8.5" fill="#d89a5c"></circle>
      <circle cx="59" cy="55" r="8.5" fill="#e3d9a8"></circle>
      <circle cx="72" cy="60" r="8" fill="#b9d68d"></circle>
      <path d="M37 71c8.5-8 18.8-10.6 31-8.2" fill="none" stroke="#648d57" stroke-linecap="round" stroke-width="4"></path>
      <path d="M48 44c4.4-6.7 12.2-8.2 18.6-3.4" fill="none" stroke="#edb171" stroke-linecap="round" stroke-width="4"></path>
    </svg>
  `;
}

function formatClock(hour) {
  return `${String(hour).padStart(2, "0")}:00`;
}

function getCurrentMeal(state) {
  return state.mealOptions[state.currentMealIndex] || state.mealOptions[0];
}

function getTaskById(state, id) {
  return state.tasks.find((task) => task.id === id) || null;
}

function getCurrentTask(state) {
  return state.tasks.find((task) => task.state !== "completed") || null;
}

function getUpcomingTasks(state, limit = 2) {
  const current = getCurrentTask(state);
  if (!current) return [];

  const currentIndex = state.tasks.findIndex((task) => task.id === current.id);
  return state.tasks
    .slice(currentIndex + 1)
    .filter((task) => task.state !== "completed")
    .slice(0, limit);
}

function getPendingCount(state) {
  return state.tasks.filter((task) => task.state !== "completed").length;
}

function getConfirmCount(state) {
  return state.tasks.filter((task) => task.status === "待处理" && task.state !== "completed").length;
}

function findSelectedDay(state) {
  return state.days.find((day) => day.id === state.selectedDayId) || state.days[0];
}

function getVisibleScheduleDays(state) {
  return state.days.slice(0, 3);
}

function findEventById(state, id) {
  for (const day of state.days) {
    const event = day.events.find((entry) => entry.id === id);
    if (event) return { day, event };
  }
  return null;
}

function findSelectedRole(state) {
  return state.roles.find((role) => role.id === state.selectedRoleId) || state.roles[0];
}

function getConflictEvent(state) {
  const visibleDays = getVisibleScheduleDays(state);
  const match = visibleDays
    .flatMap((day) => day.events.map((event) => ({ day, event })))
    .find(({ event }) => event.status === "待处理" || event.status === "待确认" || event.tone === "warning");
  if (match) return match.event;
  return findSelectedDay(state).events[0];
}

// ============ User Direct Edit Helpers ============

const EDITABLE_FIELDS = ["title", "time", "location", "note", "reminder"];

function simulateUserDirectEdit(event, changes) {
  // 简化判断逻辑：
  // - 只改标题、备注、提醒 -> keep-current
  // - 改时间且影响后续安排 -> enter-replan
  // - 改地点且需要外部服务 -> enter-replan

  const simpleFields = ["title", "note", "reminder"];
  const changedComplexFields = Object.keys(changes).filter(
    (key) => !simpleFields.includes(key) && changes[key] !== event[key]
  );

  if (changedComplexFields.length === 0) {
    return {
      outcome: "keep-current",
      reason: "单事件明确字段修改，不影响后续安排",
    };
  }

  // 复杂修改判断
  const hasTimeChange = changes.time && changes.time !== event.time;
  const hasLocationChange = changes.location && changes.location !== event.location;

  if (hasTimeChange && wouldAffectSubsequentEvents(event, changes.time)) {
    return {
      outcome: "enter-replan",
      reason: "时间变更影响后续安排",
    };
  }

  if (hasLocationChange && requiresExternalService(changes.location)) {
    return {
      outcome: "enter-replan",
      reason: "地点变更需要外部服务协调",
    };
  }

  return {
    outcome: "keep-current",
    reason: "修改范围可控",
  };
}

function wouldAffectSubsequentEvents(event, newTime) {
  // 简化：假设跨小时的时间变更会影响后续
  const oldHour = parseInt(event.time?.split(":")[0]) || 12;
  const newHour = parseInt(newTime?.split(":")[0]) || 12;
  return Math.abs(oldHour - newHour) >= 2;
}

function requiresExternalService(location) {
  // 简化：包含特定关键词需要外部服务
  const externalKeywords = ["外卖", "配送", "快递"];
  return externalKeywords.some((kw) => location?.includes(kw));
}

function getScheduleLaneCount(day) {
  return day.events.reduce((max, event) => Math.max(max, (event.lane || 0) + (event.laneSpan || 1)), 1);
}

function getStatusTone(status) {
  if (status === "待处理" || status === "待确认" || status === "待开始" || status === "待出发") return "default";
  if (status === "有冲突" || status === "未配置") return "warning";
  if (status === "已确认" || status === "可用" || status === "已启用" || status === "已连接" || status === "已完成") return "confirmed";
  if (status === "失败") return "danger";
  return "default";
}

function getUtensilLabel(state) {
  return state.includeUtensils ? "需要餐具" : "不要餐具";
}

function getModelSummary(state) {
  if (state.modelStatus === "not_configured") {
    return {
      label: "未配置",
      tone: "warning",
      summary: "尚未完成模型接入",
      detail: "当前仍可完整体验 demo；完成连接后，正式运行时也能继续使用这些能力。",
    };
  }

  if (state.modelStatus === "failed") {
    return {
      label: "失败",
      tone: "danger",
      summary: "最近一次连接失败",
      detail: "重新连接后，就可以继续正常使用。",
    };
  }

  return {
    label: "可用",
    tone: "confirmed",
    summary: "当前 provider 与模型可正常调用",
    detail: state.modelStatusNote,
  };
}

function getRoleStatusMeta(role, modelReady) {
  if (!modelReady) {
    return {
      label: "可先预览",
      actionLabel: role.enabled ? "先看详情" : "启用并预览",
    };
  }

  if (!role.enabled) {
    return {
      label: "未启用",
      actionLabel: "启用并使用",
    };
  }

  return {
    label: "已启用",
    actionLabel: "立即使用",
  };
}

function getPendingActionLabel(action) {
  if (action === "composer_submit") return "继续刚才的输入";
  if (action === "role_invoke") return "继续这个角色调用";
  if (action === "ask_assistant") return "继续交给助理";
  return "继续刚才的操作";
}

function buildAssistantEntryContext(state, scope = state.activeTab, id = "", sourceAction = "ask_assistant", selection = "") {
  if (scope === "today") {
    const item = getTaskById(state, id) || getCurrentTask(state);
    const isMeal = item?.kind === "meal";
    return {
      scope,
      id: item?.id || "",
      sourcePage: "今天",
      sourceItem: item?.title || "当前事项",
      source_action: sourceAction,
      source_page: "today",
      source_item_id: item?.id || "",
      current_constraints: [item?.title ? `当前事项：${item.title}` : "", item?.timeLabel ? `时间：${item.timeLabel}` : "", selection ? `用户补充：${selection}` : ""]
        .filter(Boolean)
        .join("；"),
      task: isMeal ? "帮我改一下这份午餐" : "帮我继续处理这件事",
      suggestions: isMeal
        ? ["换个更轻的", "不要餐具", "给我两个更快送达的"]
        : ["帮我拆成两步", "先给我一个提纲", "提醒我别拖过 15:00"],
      impact: isMeal ? "会直接更新当前事项。" : "会直接更新这件事的处理建议。",
      returnTarget: "顶部区域 + 当前事项主卡 + 次级承接区",
    };
  }

  if (scope === "schedule") {
    const picked = findEventById(state, id);
    const event = picked?.event || getConflictEvent(state);
    return {
      scope,
      id: event?.id || "",
      sourcePage: "日程",
      sourceItem: event?.title || "当前事件",
      source_action: sourceAction,
      source_page: "schedule",
      source_item_id: event?.id || "",
      current_constraints: [event?.title ? `当前事件：${event.title}` : "", picked?.day?.topLabel || findSelectedDay(state).topLabel, selection ? `用户补充：${selection}` : ""]
        .filter(Boolean)
        .join("；"),
      task: "帮我调整这段安排",
      suggestions: ["帮我顺一下今天下午", "把重叠的会错开一点", "先看哪一条最该处理"],
      impact: "会同步更新时间安排。",
      returnTarget: "当前日期时间栅格 + 相关事件块 + 当前打开详情",
    };
  }

  if (scope === "roles") {
    const role = state.roles.find((entry) => entry.id === id) || findSelectedRole(state);
    return {
      scope,
      id: role?.id || "",
      sourcePage: "角色",
      sourceItem: role?.name || "当前角色",
      source_action: sourceAction,
      source_page: "role",
      source_item_id: role?.id || "",
      current_constraints: [role?.name ? `角色：${role.name}` : "", role?.scene ? `场景：${role.scene}` : "", selection ? `用户补充：${selection}` : ""]
        .filter(Boolean)
        .join("；"),
      task: `用${role?.name || "这个角色"}帮我处理`,
      suggestions: ["直接开始", "先看看适不适合我", "按我现在的情况给建议"],
      impact: "会直接用这个角色继续处理。",
      returnTarget: "当前角色状态 + 最近一次调用结果",
    };
  }

  const meTitleMap = {
    profile: "身份与摘要",
    services: "已接入服务",
    preferences: "偏好管理",
    memory: "系统记忆与习惯",
    goals: "目标与阶段",
    records: "记录与依据",
    privacy: "提醒与隐私",
    settings: "设置",
  };

  return {
    scope,
    id: id || "model",
    sourcePage: "我的",
    sourceItem: meTitleMap[id] || "偏好与设置",
    source_action: sourceAction,
    source_page: "me",
    source_item_id: id || "",
    current_constraints: [meTitleMap[id] || "偏好与设置", selection ? `用户补充：${selection}` : ""].filter(Boolean).join("；"),
    task: id === "records" ? "帮我看看最近为什么这样判断" : "帮我改一下这些设置",
    suggestions: id === "services"
      ? ["帮我看看当前服务状态", "把默认值调稳一点", "重新检查一下连接"]
      : id === "privacy"
        ? ["把提醒再收敛一点", "只保留关键提醒", "解释一下这些边界"]
        : ["解释最近一次提醒", "把默认值调稳一点", "帮我改成更合适的状态"],
    impact: "会更新相关设置摘要。",
    returnTarget: "当前模块摘要 + 受影响子页状态",
  };
}

function getAssistantContext(state, scope = state.activeTab, id = "", sourceAction = "ask_assistant", selection = "") {
  return buildAssistantEntryContext(state, scope, id, sourceAction, selection);
}

function determineGovernanceState(context, modelStatus) {
  // 1. Preview 中即使模型未配置，也允许继续演示主链
  if (modelStatus === "not_configured") {
    return {
      state: GovernanceStates.WAIT_CONFIRMATION,
      reason: "当前是 demo 演示模式：会继续展示完整链路，同时保留模型未接入提示。",
      nextSteps: [
        { label: "去看设置", action: "open-detail", actionArgs: { scope: "me", id: "services" } },
        { label: "继续体验", action: "apply-assistant", primary: true },
      ],
    };
  }

  // 2. 需要外部授权 -> handoff-only
  if (context?.requiresExternalAuth) {
    return {
      state: GovernanceStates.HANDOFF_ONLY,
      reason: "需要外部服务授权",
      nextSteps: [
        { label: "前往设置", action: "open-detail", actionArgs: { scope: "me", id: "services" } },
        { label: "取消", action: "close-sheet" },
      ],
    };
  }

  // 3. 高风险操作 -> wait-confirmation
  if (context?.riskLevel === "high" || context?.riskLevel === "critical") {
    return {
      state: GovernanceStates.WAIT_CONFIRMATION,
      reason: "这次操作影响较大，需要你确认",
      nextSteps: [
        { label: "查看详情", action: "open-detail", actionArgs: { scope: context.scope || "today", id: context.id || "" } },
        { label: "确认执行", action: "apply-assistant", primary: true },
        { label: "取消", action: "close-sheet" },
      ],
    };
  }

  // 4. 来自 user_direct_edit 的复杂修改 -> wait-confirmation
  if (context?.source_action === "user_direct_edit") {
    return {
      state: GovernanceStates.WAIT_CONFIRMATION,
      reason: context.syncResult?.reason || "这次修改影响后续安排",
      nextSteps: [
        { label: "返回编辑", action: "open-schedule-editor", actionArgs: { id: context.eventId || context.id || "" } },
        { label: "让助理处理", action: "apply-assistant", primary: true },
        { label: "先关闭", action: "close-sheet" },
      ],
    };
  }

  // 5. 默认 -> execute
  return {
    state: GovernanceStates.EXECUTE,
    reason: "可以直接执行",
    nextSteps: [{ label: "执行", action: "apply-assistant", primary: true }],
  };
}

function renderStatusPill(label, tone = "default") {
  return `<span class="status-pill ${tone === "warning" ? "is-warning" : tone === "confirmed" ? "is-confirmed" : tone === "danger" ? "is-danger" : ""}">${label}</span>`;
}

function renderThread(messages) {
  return `
    <div class="thread-list">
      ${messages
        .map(
          (message) => `
            <article class="thread-bubble is-${message.role}">
              <p>${message.text}</p>
            </article>
          `,
        )
        .join("")}
    </div>
  `;
}

function renderTopArea(topArea) {
  if (!topArea || topArea.variant === "none") return "";

  if (topArea.variant === "section") {
    return `
      <header class="section-top">
        <div>
          <p class="calendar-date is-section">${topArea.title}</p>
          ${topArea.subtitle ? `<h3>${topArea.subtitle}</h3>` : ""}
        </div>
        ${topArea.trailing ? `<div class="top-pill">${topArea.trailing}</div>` : ""}
      </header>
    `;
  }

  return `
    <header class="home-top">
      <div>
        <p class="calendar-date">${topArea.date}</p>
        <h3>${topArea.day}</h3>
        <button class="location-trigger" type="button" data-action="open-detail" data-scope="me" data-id="profile">
          <span class="location-trigger-icon">${locationIcon()}</span>
          <span class="location-trigger-label">${topArea.location}</span>
          <span class="location-trigger-caret"></span>
        </button>
      </div>
      <div class="weather-card">
        ${sunIcon()}
        <strong>${topArea.temperature}</strong>
        <span class="weather-note">${topArea.outfit}</span>
      </div>
    </header>
  `;
}

function renderTabIcon(tabId) {
  if (tabId === "today") return checkCircleIcon();
  if (tabId === "schedule") return calendarIcon();
  if (tabId === "roles") return sparklesIcon();
  return userIcon();
}

function renderScheduleAllDayItem(item) {
  if (!item) return "";
  const title = typeof item === "string" ? item : item.title;
  const tone = typeof item === "string" ? "" : item.colorTone || "";
  return `<span class="schedule-all-day-pill ${tone ? `is-${tone}` : ""}">${title}</span>`;
}

function renderScheduleDayColumn(day) {
  const laneCount = getScheduleLaneCount(day);
  const totalHeight = (CALENDAR_END_HOUR - CALENDAR_START_HOUR + 1) * CALENDAR_HOUR_HEIGHT;

  return `
    <div class="schedule-day-column" style="height:${totalHeight}px">
      ${Array.from({ length: CALENDAR_END_HOUR - CALENDAR_START_HOUR + 1 }, (_, index) => CALENDAR_START_HOUR + index)
        .map(
          (hour) => `
            <div class="schedule-hour-line" style="top:${(hour - CALENDAR_START_HOUR) * CALENDAR_HOUR_HEIGHT}px"></div>
          `,
        )
        .join("")}
      ${day.events
        .map((event) => {
          const top = ((event.startMinuteTotal - CALENDAR_START_HOUR * 60) / 60) * CALENDAR_HOUR_HEIGHT;
          const height = Math.max(((event.endMinuteTotal - event.startMinuteTotal) / 60) * CALENDAR_HOUR_HEIGHT - 6, 42);

          return `
            <button
              class="schedule-event-card is-${event.colorTone || "soft"} ${day.id === "wed" ? "is-core" : ""}"
              type="button"
              data-action="open-detail"
              data-scope="schedule"
              data-id="${event.id}"
              style="--lanes:${laneCount};--lane:${event.lane || 0};--span:${event.laneSpan || 1};top:${top}px;height:${height}px;"
            >
              <strong>${event.title}</strong>
              <span>${event.location || event.time}</span>
            </button>
          `;
        })
        .join("")}
    </div>
  `;
}

function renderSettingsRow(row) {
  return `
    <button
      class="settings-row ${row.emphasis ? "is-emphasis" : ""}"
      type="button"
      data-action="open-detail"
      data-scope="me"
      data-id="${row.id}"
    >
      <span class="settings-row-icon ${row.iconTone ? `is-${row.iconTone}` : ""}">
        ${row.icon}
      </span>
      <span class="settings-row-copy">
        <strong>${row.title}</strong>
        ${row.copy ? `<span>${row.copy}</span>` : ""}
      </span>
      <span class="settings-row-arrow">${chevronRightIcon()}</span>
    </button>
  `;
}

function renderSummaryStrips(strips) {
  if (!Array.isArray(strips) || !strips.length) return "";
  return `
    <div class="home-summary-stack">
      ${strips
        .map(
          (strip) => `
            <div class="summary-strip ${strip.tone ? `is-${strip.tone}` : ""}">
              <span class="summary-label">${strip.label}</span>
              <strong>${strip.value}</strong>
            </div>
          `,
        )
        .join("")}
    </div>
  `;
}

function renderMealTaskCard(card) {
  if (!card.task) {
    return `
      <article class="focus-card">
        <div class="focus-empty-state">
          <p class="focus-empty-title">今天的主事项已经收住了。</p>
          <p class="focus-empty-copy">你可以去看完整日程、看看有哪些角色，或者继续交给助理补一句要求。</p>
          <div class="action-row">
            <button class="secondary-button" type="button" data-action="switch-tab" data-tab="schedule">去看日程</button>
            <button class="secondary-button" type="button" data-action="switch-tab" data-tab="roles">去看角色</button>
            <button class="primary-button" type="button" data-action="open-assistant" data-scope="today">交给助理</button>
          </div>
        </div>
      </article>
    `;
  }

  return `
    <article class="focus-card">
      <div class="focus-card-top">
        <div>
          <p class="focus-eyebrow">当前事项</p>
          <h4>${card.task.title}</h4>
          <p class="focus-status-line">${card.task.status} · ${card.task.timeLabel}</p>
        </div>
        <button
          class="task-delete-button"
          type="button"
          data-action="open-overlay"
          data-kind="delete-current"
          data-id="${card.task.id}"
          aria-label="删除当前事项"
        >
          ${trashIcon()}
        </button>
      </div>
      <p class="focus-note">${card.task.note}</p>

      <section class="meal-sheet">
        <div class="meal-visual" data-variant="${card.meal.visualVariant}">
          ${mealIllustration()}
        </div>
        <div class="meal-copy">
          <h5>${card.meal.title}</h5>
          <p>${card.meal.merchant} · ${card.meal.sourceLabel}</p>
          <p class="meal-inline-copy">${card.meal.profile}</p>
          <p class="meal-inline-copy">${getUtensilLabel(card.state)} · ${card.meal.tags.join(" / ")}</p>
          <div class="meal-price-row">
            <strong>${card.meal.price}</strong>
            <span>${card.meal.arrival}</span>
          </div>
        </div>
      </section>

      <div class="action-row">
        <button class="secondary-button" type="button" data-action="open-overlay" data-kind="delay-today">延后</button>
        <button class="secondary-button" type="button" data-action="open-detail" data-scope="today" data-id="${card.task.id}">查看详情</button>
        <button class="primary-button" type="button" data-action="open-assistant" data-scope="today" data-id="${card.task.id}">继续</button>
      </div>

      <p class="focus-copy">${card.task.support}</p>
    </article>
  `;
}

function renderGenericTaskCard(card) {
  return `
    <article class="focus-card">
      <div class="focus-card-top">
        <div>
          <p class="focus-eyebrow">当前事项</p>
          <h4>${card.task.title}</h4>
          <p class="focus-status-line">${card.task.status} · ${card.task.timeLabel}</p>
        </div>
        <button
          class="task-delete-button"
          type="button"
          data-action="open-overlay"
          data-kind="delete-current"
          data-id="${card.task.id}"
          aria-label="删除当前事项"
        >
          ${trashIcon()}
        </button>
      </div>
      <p class="focus-note">${card.task.note}</p>
      <div class="action-row">
        <button class="secondary-button" type="button" data-action="open-overlay" data-kind="delay-today">延后</button>
        <button class="secondary-button" type="button" data-action="open-detail" data-scope="today" data-id="${card.task.id}">查看详情</button>
        <button class="primary-button" type="button" data-action="complete-today" data-id="${card.task.id}">完成</button>
      </div>
      <p class="focus-copy">${card.task.support}</p>
    </article>
  `;
}

function renderScheduleWorkspace(card) {
  const visibleDays = card.visibleDays;

  return `
    <section class="schedule-shell">
      <header class="schedule-page-top">
        <div class="schedule-month-group">
          <div class="schedule-avatar">${card.profileInitial}</div>
          <div>
            <div class="schedule-month-row">
              <strong>${card.monthTitle}</strong>
              <span class="schedule-month-caret"></span>
            </div>
            <span class="schedule-week-note">第 15 周</span>
          </div>
        </div>
        <div class="schedule-page-actions">
          <button class="ghost-icon is-plain" type="button" aria-label="搜索">
            ${searchIcon()}
          </button>
          <button class="ghost-icon is-plain" type="button" aria-label="切换日历视图">
            ${calendarIcon()}
          </button>
        </div>
      </header>

      <div class="schedule-subtabs">
        <button class="schedule-subtab is-active" type="button">日历</button>
        <button class="schedule-subtab" type="button">提醒</button>
      </div>

      <div class="schedule-date-strip">
        <div class="schedule-axis-meta">
          <span>GMT+8</span>
        </div>
        ${visibleDays
          .map(
            (day) => `
              <button
                class="schedule-date-chip ${day.id === card.selectedDayId ? "is-active" : ""}"
                type="button"
                data-action="select-day"
                data-id="${day.id}"
              >
                <span>${day.weekday}</span>
                <strong>${day.label}</strong>
              </button>
            `,
          )
          .join("")}
      </div>

      <div class="schedule-all-day-grid">
        <div class="schedule-axis-label">全天</div>
        ${visibleDays
          .map(
            (day) => `
              <div class="schedule-all-day-cell">
                ${day.allDay.length ? day.allDay.map((item) => renderScheduleAllDayItem(item)).join("") : `<span class="schedule-all-day-empty">-</span>`}
              </div>
            `,
          )
          .join("")}
      </div>

      <div class="schedule-grid-board">
        <div class="schedule-hours">
          ${card.hours.map((hour) => `<span>${formatClock(hour)}</span>`).join("")}
        </div>
        <div class="schedule-days-board">
          ${visibleDays
            .map(
              (day) => `
                <div class="schedule-day-track ${day.id === card.selectedDayId ? "is-active" : ""}">
                  ${renderScheduleDayColumn(day)}
                </div>
              `,
            )
            .join("")}
        </div>
      </div>

      <button class="schedule-fab" type="button" data-action="open-overlay" data-kind="quick-create" aria-label="新建日程">
        ${plusIcon()}
      </button>
    </section>
  `;
}

function renderRoleListCard(role) {
  return `
    <article class="role-list-card ${role.id === role.selectedRoleId ? "is-selected" : ""}">
      <button class="role-card-main" type="button" data-action="open-detail" data-scope="roles" data-id="${role.id}">
        <div class="title-row">
          <h4>${role.name}</h4>
          ${renderStatusPill(role.enabled ? "已启用" : "待启用", role.enabled ? "confirmed" : "warning")}
        </div>
        <p>${role.summary}</p>
        <div class="detail-row role-card-scene">
          <strong>适用场景</strong>
          <span>${role.scene}</span>
        </div>
      </button>
      <button class="primary-button role-card-action" type="button" data-action="role-primary" data-id="${role.id}">
        ${role.enabled ? "立即调用" : "启用并继续"}
      </button>
    </article>
  `;
}

function renderRolesWorkspace(card) {
  return `
    <section class="role-gallery">
      <header class="role-gallery-head">
        <div>
          <span class="section-kicker">Skill 助理</span>
          <h4>选一个直接开始</h4>
        </div>
        <button class="capsule-button" type="button" data-action="open-assistant" data-scope="roles" data-id="${card.role.id}">帮我选一个</button>
      </header>

      <div class="role-skill-list">
        ${card.roles
          .map((role) => {
            const statusMeta = getRoleStatusMeta(role, card.modelReady);
            return `
              <article class="role-skill-card is-${role.accent} ${role.id === card.selectedRoleId ? "is-selected" : ""}">
                <button class="role-skill-main" type="button" data-action="open-detail" data-scope="roles" data-id="${role.id}">
                  <div class="role-skill-badge">${role.badge}</div>
                  <div class="role-skill-copy">
                    <div class="role-skill-top">
                      <strong>${role.name}</strong>
                      <span class="role-skill-status ${role.enabled && card.modelReady ? "is-active" : ""}">${statusMeta.label}</span>
                    </div>
                    <p>${role.summary}</p>
                    <p class="role-skill-scene">${role.scene}</p>
                    <p class="role-skill-meta">${role.result}</p>
                    <div class="role-skill-tags">
                      ${role.skills.slice(0, 3).map((item) => `<span>${item}</span>`).join("")}
                    </div>
                  </div>
                </button>
                <button class="role-skill-action" type="button" data-action="role-primary" data-id="${role.id}">
                  ${statusMeta.actionLabel}
                </button>
              </article>
            `;
          })
          .join("")}
      </div>
    </section>
  `;
}

function renderIdentityWorkspace(card) {
  return `
    <section class="settings-home">
      <button class="settings-profile-card" type="button" data-action="open-detail" data-scope="me" data-id="profile">
        <div class="settings-avatar">${card.profile.name.slice(0, 1)}</div>
        <div class="settings-profile-copy">
          <strong>${card.profile.name}</strong>
          <span>${card.profile.address} · ${card.profile.identity}</span>
          <small>${card.profile.assistantName} · ${card.profile.assistantTone}</small>
        </div>
        <span class="settings-profile-qr">${qrIcon()}</span>
        <span class="settings-row-arrow">${chevronRightIcon()}</span>
      </button>

      ${card.groups
        .map(
          (group) => `
            <section class="settings-group">
              ${group.map((row) => renderSettingsRow(row)).join("")}
            </section>
          `,
        )
        .join("")}
    </section>
  `;
}

function renderSummarySectionCard(card) {
  return `
    <article class="secondary-card">
      <div class="secondary-card-top">
        <div>
          <h4>${card.title}</h4>
          ${card.subtitle ? `<p class="card-caption">${card.subtitle}</p>` : ""}
        </div>
      </div>
      <div class="detail-list">
        ${card.rows
          .map(
            (row) => `
              <button
                class="detail-row is-button"
                type="button"
                data-action="open-detail"
                data-scope="me"
                data-id="${row.id}"
              >
                <strong>${row.title}</strong>
                <span>${row.copy}</span>
              </button>
            `,
          )
          .join("")}
      </div>
    </article>
  `;
}

function renderPrimaryCard(card) {
  if (card.variant === "mealTask") return renderMealTaskCard(card);
  if (card.variant === "genericTask") return renderGenericTaskCard(card);
  if (card.variant === "scheduleWorkspace") return renderScheduleWorkspace(card);
  if (card.variant === "rolesWorkspace") return renderRolesWorkspace(card);
  if (card.variant === "identityWorkspace") return renderIdentityWorkspace(card);
  return "";
}

function renderUpcomingCard(card) {
  return `
    <article class="secondary-card">
      <div class="secondary-card-top">
        <div>
          <h4>${card.title}</h4>
          ${card.subtitle ? `<p class="card-caption">${card.subtitle}</p>` : ""}
        </div>
      </div>
      <div class="timeline-list">
        ${card.items
          .map(
            (item) => `
              <button class="timeline-row" type="button" data-action="open-detail" data-scope="today" data-id="${item.id}">
                <div>
                  <strong>${item.title}</strong>
                  <p>${item.note}</p>
                </div>
                <span>${item.timeLabel}</span>
              </button>
            `,
          )
          .join("")}
      </div>
    </article>
  `;
}

function renderRecordsCard(card) {
  return renderSummarySectionCard(card);
}

function renderSecondaryCards(cards) {
  if (!Array.isArray(cards) || !cards.length) return "";
  return cards
    .map((card) => {
      if (card.variant === "upcoming") return renderUpcomingCard(card);
      if (card.variant === "summarySection") return renderSummarySectionCard(card);
      if (card.variant === "records") return renderRecordsCard(card);
      return "";
    })
    .join("");
}

function renderTabBar(activeTab) {
  const tabs = [
    { id: "today", title: "今天" },
    { id: "schedule", title: "日程" },
    { id: "roles", title: "角色" },
    { id: "me", title: "我的" },
  ];

  return `
    <nav class="tabbar" aria-label="底部导航">
      ${tabs
        .map(
          (tab) => `
            <button class="tabbar-item ${tab.id === activeTab ? "is-active" : ""}" type="button" data-action="switch-tab" data-tab="${tab.id}">
              <span class="tabbar-icon">${renderTabIcon(tab.id)}</span>
              <span class="tabbar-title">${tab.title}</span>
            </button>
          `,
        )
        .join("")}
    </nav>
  `;
}

function renderDock(view) {
  return `
    <footer class="home-dock">
      <form class="assistant-composer is-home" data-form="dock" aria-label="${view.assistantContextLabel}">
        <input
          type="text"
          name="dock-command"
          autocomplete="off"
          placeholder="${view.composerPlaceholder}"
        />
        <button class="composer-icon" type="button" data-action="voice-hint" aria-label="语音输入">
          ${micIcon()}
        </button>
        <button class="composer-send" type="submit" aria-label="发送指令">
          ${sendIcon()}
        </button>
      </form>

      ${renderTabBar(view.id)}
    </footer>
  `;
}

function buildTodayView(state) {
  const current = getCurrentTask(state);
  const meal = getCurrentMeal(state);

  return {
    id: "today",
    topArea: {
      variant: "dateWeather",
      date: APP_DATE,
      day: `${APP_DAY} · ${state.profile.name}`,
      location: state.profile.address,
      temperature: APP_TEMPERATURE,
      outfit: APP_OUTFIT,
    },
    summaryStrips: [],
    // 模型未配置时显示提示卡片
    modelPromptCard: state.showModelPrompt
      ? {
          title: "尚未完成模型接入",
          description: "当前仅支持浏览与基础手动管理。完成模型接入后，assistant 才能真正替你判断和推荐。",
          action: "去设置",
        }
      : null,
    primaryCard: !current
      ? { variant: "mealTask", task: null, meal, state }
      : current.kind === "meal"
        ? { variant: "mealTask", task: current, meal, state }
        : { variant: "genericTask", task: current },
    secondaryCards: [
      {
        variant: "upcoming",
        title: "接下来",
        subtitle: `还有 ${getUpcomingTasks(state).length} 件事在后面`,
        items: getUpcomingTasks(state),
      },
    ],
    composerPlaceholder: current?.kind === "meal"
      ? "直接说这件午餐怎么改"
      : "补一句要求，或直接说「继续安排」",
    assistantContextLabel: `今天 · ${current?.title || "当前事项"}`,
  };
}

function buildScheduleView(state) {
  const day = findSelectedDay(state);

  return {
    id: "schedule",
    topArea: {
      variant: "none",
    },
    summaryStrips: [],
    primaryCard: {
      variant: "scheduleWorkspace",
      day,
      visibleDays: getVisibleScheduleDays(state),
      monthTitle: SCHEDULE_MONTH,
      selectedDayId: state.selectedDayId,
      hours: Array.from({ length: CALENDAR_END_HOUR - CALENDAR_START_HOUR + 1 }, (_, index) => CALENDAR_START_HOUR + index),
      profileInitial: state.profile.name.slice(0, 1),
    },
    secondaryCards: [],
    composerPlaceholder: "例如：把周三下午顺一下",
    assistantContextLabel: `日程 · ${day.topLabel}`,
  };
}

function buildRolesView(state) {
  const role = findSelectedRole(state);

  return {
    id: "roles",
    topArea: {
      variant: "none",
    },
    summaryStrips: [],
    primaryCard: {
      variant: "rolesWorkspace",
      role,
      roles: state.roles,
      selectedRoleId: state.selectedRoleId,
      modelReady: state.modelStatus === "available",
    },
    secondaryCards: [],
    composerPlaceholder: "直接说你想做什么",
    assistantContextLabel: "角色 · Skill 助理",
  };
}

function buildMeView(state) {
  const model = getModelSummary(state);

  return {
    id: "me",
    topArea: {
      variant: "none",
    },
    summaryStrips: [],
    primaryCard: {
      variant: "identityWorkspace",
      profile: state.profile,
      groups: [
        [
          { id: "services", title: "已接入服务", copy: model.summary, icon: serviceIcon(), iconTone: "blue", emphasis: true },
        ],
        [
          { id: "preferences", title: "偏好管理", copy: `${state.profile.dietary.join(" / ") || "暂未补充"} · 预算 ${state.profile.budget}`, icon: boxIcon(), iconTone: "blue" },
          { id: "memory", title: "系统记忆与习惯", copy: `${state.profile.wakeTime} 起床 · ${state.profile.sleepTime} 睡觉`, icon: calendarIcon(), iconTone: "blue" },
          { id: "goals", title: "目标与阶段", copy: state.profile.stageTags.join(" / "), icon: sparklesIcon(), iconTone: "blue" },
        ],
        [
          { id: "records", title: "记录与依据", copy: "看看昨天午餐排序和最近一次提醒。", icon: noteIcon(), iconTone: "blue" },
          { id: "privacy", title: "提醒与隐私", copy: state.privacyNote, icon: bellIcon(), iconTone: "blue" },
          { id: "settings", title: "设置", copy: `${state.profile.assistantName} · ${state.profile.assistantTone}`, icon: gearIcon(), iconTone: "blue" },
        ],
      ],
    },
    secondaryCards: [],
    composerPlaceholder: "直接说想改哪一项",
    assistantContextLabel: "我的 · 偏好与设置",
  };
}

const TAB_VIEW_BUILDERS = {
  today: buildTodayView,
  schedule: buildScheduleView,
  roles: buildRolesView,
  me: buildMeView,
};

function buildActiveView(state) {
  return TAB_VIEW_BUILDERS[state.activeTab](state);
}

function renderModelPromptCard(card) {
  if (!card) return "";
  return `
    <div class="model-prompt-card" style="background: #fef3c7; border-radius: 12px; padding: 16px; margin-bottom: 16px; display: flex; align-items: center; gap: 12px;">
      <div style="font-size: 24px;">⚠️</div>
      <div style="flex: 1;">
        <strong style="color: #92400e;">${card.title}</strong>
        <p style="margin: 4px 0 0; color: #a16207; font-size: 14px;">${card.description}</p>
      </div>
      <button class="card-action" data-action="open-detail" data-scope="me" data-id="services" style="background: #f59e0b; color: white; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-size: 14px;">
        ${card.action}
      </button>
    </div>
  `;
}

function renderHomeScreen(state) {
  const view = buildActiveView(state);

  return `
    <div class="status-bar">
      <span>${APP_TIME}</span>
      <span class="status-center" aria-hidden="true"></span>
      <span>${APP_BATTERY}</span>
    </div>

    <section class="screen-scroll">
      ${renderTopArea(view.topArea)}
      ${renderSummaryStrips(view.summaryStrips)}
      ${renderModelPromptCard(view.modelPromptCard)}
      ${renderPrimaryCard(view.primaryCard)}
      ${renderSecondaryCards(view.secondaryCards)}
    </section>

    ${renderDock(view)}
  `;
}

function renderOverviewCard(title, status, rows, hint) {
  return `
    <article class="overview-card">
      <div class="overview-top">
        <div>
          <span class="section-kicker">事项概览</span>
          <div class="title-row">
            <h4>${title}</h4>
            ${renderStatusPill(status.label, status.tone)}
          </div>
        </div>
      </div>
      <div class="overview-grid">
        ${rows
          .map(
            (row) => `
              <div>
                <span>${row.label}</span>
                <strong>${row.value}</strong>
              </div>
            `,
          )
          .join("")}
      </div>
      <p class="overview-hint">${hint}</p>
    </article>
  `;
}

function renderTodayDetail(state, itemId) {
  const item = getTaskById(state, itemId) || getCurrentTask(state);
  const meal = getCurrentMeal(state);

  if (item?.kind !== "meal") {
    return `
      <section class="plain-detail-card">
        <span class="section-kicker">事项详情</span>
        <h4>${item.title}</h4>
        <div class="plain-detail-meta">
          <span>${item.timeLabel}</span>
          <span>${item.status}</span>
        </div>
        <div class="plain-detail-rows">
          <div>
            <strong>当前说明</strong>
            <p>${item.note}</p>
          </div>
          <div>
            <strong>建议</strong>
            <p>${item.support}</p>
          </div>
        </div>
        <div class="action-row">
          <button class="secondary-button" type="button" data-action="open-overlay" data-kind="delay-today">延后</button>
          <button class="primary-button" type="button" data-action="complete-today" data-id="${item.id}">完成</button>
        </div>
      </section>
    `;
  }

  return `
    <section class="plain-detail-card">
      <span class="section-kicker">当前事项</span>
      <h4>${item.title}</h4>
      <div class="plain-detail-meta">
        <span>${item.timeLabel}</span>
        <span>${item.status}</span>
      </div>

      <div class="plan-card-body is-meal-detail">
        <div class="meal-visual" data-variant="${meal.visualVariant}">
          ${mealIllustration()}
        </div>
        <div class="meal-copy">
          <h5>${meal.title}</h5>
          <p>${meal.merchant}</p>
          <span class="meal-source-badge">${meal.sourceLabel}</span>
          <p class="meal-freshness-note">${meal.freshnessBasis}</p>
          <div class="meal-tags">
            <span class="meal-tag">${getUtensilLabel(state)}</span>
            ${meal.tags.map((tag) => `<span class="meal-tag is-muted">${tag}</span>`).join("")}
          </div>
          <div class="meal-price-row">
            <strong>${meal.price}</strong>
            <span>${meal.arrival}</span>
          </div>
        </div>
      </div>

      <div class="chip-grid">
        <button class="chip is-wide" type="button" data-action="toggle-utensils">${state.includeUtensils ? "不要餐具" : "加上餐具"}</button>
        <button class="chip is-wide" type="button" data-action="complete-today" data-id="${item.id}">完成当前事项</button>
      </div>
    </section>
  `;
}

function renderScheduleDetail(state, itemId) {
  const picked = findEventById(state, itemId);
  const event = picked?.event || getConflictEvent(state);
  const day = picked?.day || findSelectedDay(state);
  const companions = Array.isArray(event.attendees) ? event.attendees.filter((name) => name && name !== "自己") : [];
  const companionSummary = companions.length ? companions.join(" · ") : "这次主要你自己处理";

  return `
    <div class="detail-layer">
      <section class="detail-screen schedule-detail-screen">
        <header class="schedule-detail-nav">
          <button class="ghost-icon is-plain" type="button" data-action="close-sheet" aria-label="返回">
            ${backIcon()}
          </button>
          <div class="schedule-detail-actions">
            <button class="ghost-icon is-plain" type="button" aria-label="分享">${shareIcon()}</button>
            <button class="ghost-icon is-plain" type="button" aria-label="编辑">${editIcon()}</button>
            <button class="ghost-icon is-plain" type="button" aria-label="更多">${moreIcon()}</button>
          </div>
        </header>

        <section class="detail-scroll schedule-detail-scroll">
          <div class="schedule-detail-headline">
            <span class="schedule-detail-color"></span>
            <div>
              <h2>${event.title}</h2>
              <p>${day.topLabel} ${event.time} (GMT+8)</p>
            </div>
          </div>

          <div class="schedule-detail-cta">
            <button class="schedule-video-button" type="button">
              ${locationIcon()}
              <span>查看地点</span>
            </button>
            <p>${event.location || "暂未填写地点"}</p>
          </div>

          <div class="schedule-detail-list">
            <div class="schedule-detail-row">
              <span class="schedule-detail-row-icon">${locationIcon()}</span>
              <div class="schedule-detail-row-copy">
                <strong>${event.location || "暂未填写地点"}</strong>
                <p>地点</p>
              </div>
            </div>
            <div class="schedule-detail-row">
              <span class="schedule-detail-row-icon">${peopleIcon()}</span>
              <div class="schedule-detail-row-copy">
                <strong>${companionSummary}</strong>
                <p>${companions.length ? "同行 / 相关人" : "相关人"}</p>
              </div>
            </div>
            <div class="schedule-detail-row">
              <span class="schedule-detail-row-icon">${noteIcon()}</span>
              <div class="schedule-detail-row-copy">
                <strong>提前准备</strong>
                <p>${event.note}</p>
              </div>
            </div>
            <div class="schedule-detail-row">
              <span class="schedule-detail-row-icon">${bellIcon()}</span>
              <div class="schedule-detail-row-copy">
                <strong>${event.reminder}</strong>
                <p>提醒</p>
              </div>
            </div>
            <div class="schedule-detail-row">
              <span class="schedule-detail-row-icon">${calendarIcon()}</span>
              <div class="schedule-detail-row-copy">
                <strong>${event.owner}</strong>
                <p>记录来源</p>
              </div>
            </div>
          </div>
        </section>

        <footer class="schedule-detail-footer">
          <button class="schedule-accept-button" type="button" data-action="close-sheet">我知道了</button>
          <button class="secondary-button" type="button" data-action="open-schedule-editor" data-id="${event.id}" style="margin-left: 8px;">编辑</button>
        </footer>
      </section>
    </div>
  `;
}

function renderScheduleEditor(state, eventId) {
  const picked = findEventById(state, eventId);
  const event = picked?.event;
  const day = picked?.day;

  if (!event) {
    return `<div class="detail-layer"><section class="detail-screen"><p>事件不存在</p></section></div>`;
  }

  return `
    <div class="detail-layer">
      <section class="detail-screen schedule-editor-screen">
        <header class="schedule-detail-nav">
          <button class="ghost-icon is-plain" type="button" data-action="cancel-schedule-edit" aria-label="取消">
            ${backIcon()}
          </button>
          <strong>编辑事项</strong>
          <button class="ghost-icon is-plain" type="button" data-action="save-schedule-edit" data-id="${event.id}" aria-label="保存" style="color: #22c55e;">
            保存
          </button>
        </header>

        <section class="detail-scroll schedule-detail-scroll" style="padding: 16px;">
          <div class="form-field" style="margin-bottom: 16px;">
            <label style="display: block; font-size: 13px; color: #6b7280; margin-bottom: 4px;">标题</label>
            <input type="text" id="edit-title" value="${event.title}" style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 16px;" />
          </div>

          <div class="form-field" style="margin-bottom: 16px;">
            <label style="display: block; font-size: 13px; color: #6b7280; margin-bottom: 4px;">时间</label>
            <input type="text" id="edit-time" value="${event.time}" placeholder="如 12:00-13:00" style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 16px;" />
          </div>

          <div class="form-field" style="margin-bottom: 16px;">
            <label style="display: block; font-size: 13px; color: #6b7280; margin-bottom: 4px;">地点</label>
            <input type="text" id="edit-location" value="${event.location || ''}" placeholder="添加地点" style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 16px;" />
          </div>

          <div class="form-field" style="margin-bottom: 16px;">
            <label style="display: block; font-size: 13px; color: #6b7280; margin-bottom: 4px;">备注</label>
            <textarea id="edit-note" placeholder="添加备注" style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 16px; min-height: 80px; resize: vertical;">${event.note || ''}</textarea>
          </div>

          <div class="form-field" style="margin-bottom: 16px;">
            <label style="display: block; font-size: 13px; color: #6b7280; margin-bottom: 4px;">提醒</label>
            <select id="edit-reminder" style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 16px; background: white;">
              <option value="无" ${event.reminder === '无' ? 'selected' : ''}>无</option>
              <option value="提前 5 分钟" ${event.reminder === '提前 5 分钟' ? 'selected' : ''}>提前 5 分钟</option>
              <option value="提前 10 分钟" ${event.reminder === '提前 10 分钟' ? 'selected' : ''}>提前 10 分钟</option>
              <option value="提前 30 分钟" ${event.reminder === '提前 30 分钟' ? 'selected' : ''}>提前 30 分钟</option>
              <option value="提前 1 小时" ${event.reminder === '提前 1 小时' ? 'selected' : ''}>提前 1 小时</option>
            </select>
          </div>

          <p style="font-size: 12px; color: #9ca3af; margin-top: 16px;">
            修改时间或地点可能影响后续安排，助理会帮你判断。
          </p>
        </section>
      </section>
    </div>
  `;
}

function renderRolesDetail(state, itemId) {
  const role = state.roles.find((entry) => entry.id === itemId) || findSelectedRole(state);
  const statusMeta = getRoleStatusMeta(role, state.modelStatus === "available");

  return `
    <section class="role-detail-card is-${role.accent}">
      <div class="role-detail-hero">
        <div class="role-detail-progress"><span></span></div>
        <div class="role-detail-stats">
          ${role.stats.map((item) => `<span>${item}</span>`).join("")}
        </div>
      </div>

      <div class="role-detail-body">
        <p class="role-detail-kicker">AI 助理 · ${role.name}</p>
        <h4>${role.scene}</h4>
        <p class="role-detail-copy">${role.summary}</p>
        <div class="role-detail-chip-grid">
          ${role.skills.map((item) => `<span>${item}</span>`).join("")}
        </div>
        <div class="detail-list">
          <div class="detail-row">
            <strong>角色定位</strong>
            <span>${role.positioning}</span>
          </div>
          <div class="detail-row">
            <strong>能力边界</strong>
            <span>${role.boundaryNote}</span>
          </div>
          <div class="detail-row">
            <strong>典型任务</strong>
            <span>${role.examples.join("；")}</span>
          </div>
          <div class="detail-row">
            <strong>适用时机</strong>
            <span>${role.timing}</span>
          </div>
          <div class="detail-row">
            <strong>相关设置入口</strong>
            <span>${state.modelStatus === "available" ? role.settingsEntry : "先去我的 > 已接入服务完成模型接入。"}</span>
          </div>
          <div class="detail-row">
            <strong>最近结果</strong>
            <span>${role.result}</span>
          </div>
        </div>
        <div class="action-row">
          <button class="primary-button" type="button" data-action="role-primary" data-id="${role.id}">
            ${statusMeta.actionLabel}
          </button>
          <button class="secondary-button" type="button" data-action="open-assistant" data-scope="roles" data-id="${role.id}">让助理补充</button>
        </div>
      </div>
    </section>
  `;
}

function renderMeDetail(state, itemId) {
  const model = getModelSummary(state);
  const pending = state.pendingAssistantAction;

  // 模型配置选项
  const providerOptions = [
    { value: "openai", label: "OpenAI" },
    { value: "anthropic", label: "Anthropic" },
    { value: "azure", label: "Azure OpenAI" },
    { value: "custom", label: "自定义" },
  ];

  const modelOptions = {
    openai: [
      { value: "gpt-5.4", label: "GPT-5.4" },
      { value: "gpt-4o", label: "GPT-4o" },
      { value: "gpt-4-turbo", label: "GPT-4 Turbo" },
    ],
    anthropic: [
      { value: "claude-sonnet-4.6", label: "Claude Sonnet 4.6" },
      { value: "claude-opus-4.6", label: "Claude Opus 4.6" },
      { value: "claude-haiku-4.5", label: "Claude Haiku 4.5" },
    ],
    azure: [
      { value: "gpt-4o", label: "GPT-4o (Azure)" },
      { value: "gpt-35-turbo", label: "GPT-3.5 Turbo (Azure)" },
    ],
    custom: [
      { value: "custom", label: "自定义模型" },
    ],
  };

  const currentProvider = state.providerName?.toLowerCase() || "openai";
  const currentModel = state.modelName || "gpt-5.4";

  const detailMap = {
    profile: {
      kicker: "身份与摘要",
      title: "身份与摘要",
      rows: [
        { label: "当前状态", value: "已同步称呼、地点和基础身份。" },
        { label: "当前摘要", value: `${state.profile.name} · ${state.profile.address} · ${state.profile.identity}${state.profile.mbti ? ` · ${state.profile.mbti}` : ""}` },
        { label: "影响", value: "会影响首页称呼、提醒时间和默认语气。" },
        { label: "最推荐动作", value: "如果最近生活状态变了，先改这里。" },
      ],
    },
    services: {
      kicker: "已接入服务",
      title: "已接入服务",
      rows: [
        { label: "当前状态", value: model.summary },
        { label: "当前值", value: model.detail },
        { label: "影响", value: "影响助理是否可用，以及响应是否稳定。" },
        { label: "最推荐动作", value: "先确认当前 provider、模型和连接状态。" },
        ...(pending
          ? [
              {
                label: "待继续操作",
                value: `${pending.sourcePage} · ${pending.sourceItem} · ${getPendingActionLabel(pending.source_action)}`,
              },
            ]
          : []),
      ],
    },
    preferences: {
      kicker: "偏好管理",
      title: "偏好管理",
      rows: [
        { label: "当前状态", value: "默认偏好已经在推荐里生效。" },
        { label: "当前值", value: `${state.profile.dietary.join(" / ") || "暂未补充"} · 午餐预算 ${state.profile.budget}` },
        { label: "影响", value: "会影响餐食推荐、预算排序和默认选择。" },
        { label: "最推荐动作", value: "先改最稳定的一项口味或预算。" },
      ],
    },
    memory: {
      kicker: "系统记忆与习惯",
      title: "系统记忆与习惯",
      rows: [
        { label: "当前状态", value: "已记住长期节奏和通勤方式。" },
        { label: "当前值", value: `${state.profile.wakeTime} 起床 · ${state.profile.sleepTime} 睡觉` },
        { label: "影响", value: "会影响提醒时机、出发时间和默认安排顺序。" },
        { label: "最推荐动作", value: "如果最近作息变化明显，优先改这里。" },
      ],
    },
    goals: {
      kicker: "目标与阶段",
      title: "目标与阶段",
      rows: [
        { label: "当前状态", value: "当前阶段会参与默认判断。" },
        { label: "当前值", value: state.profile.stageTags.join(" / ") || "暂未设置" },
        { label: "影响", value: "会影响建议重点和任务优先级。" },
        { label: "最推荐动作", value: "先标记你最近最像的阶段。" },
      ],
    },
    records: {
      kicker: "记录与依据",
      title: "记录与依据",
      rows: [
        { label: "当前状态", value: "保留最近一次午餐排序、提醒和修改痕迹。" },
        { label: "当前值", value: "昨天 12:08 的午餐排序、最近一次提醒调整、最近一次删除操作。" },
        { label: "影响", value: "这里会解释系统为什么这么判断，而不是再跑一次流程。" },
        { label: "最推荐动作", value: "想知道为什么时，先来这里看依据。" },
      ],
    },
    privacy: {
      kicker: "提醒与隐私",
      title: "提醒与隐私",
      rows: [
        { label: "当前状态", value: "提醒边界已收敛到关键变更。" },
        { label: "当前值", value: state.privacyNote },
        { label: "影响", value: "会影响主动提醒频率和隐私边界。" },
        { label: "最推荐动作", value: "如果最近觉得打扰，先调提醒强度。" },
      ],
    },
    settings: {
      kicker: "设置",
      title: "设置",
      rows: [
        { label: "当前状态", value: "默认助理名称、语气和模型设置都已保存。" },
        { label: "当前值", value: `${state.profile.assistantName} · ${state.profile.assistantTone}` },
        { label: "影响", value: "会影响默认交互方式和长期默认值。" },
        { label: "最推荐动作", value: "需要改模型或默认口吻时，从这里进入。" },
      ],
    },
  };
  const detail = detailMap[itemId] || detailMap.settings;

  // 模型设置表单（仅 services 页面显示）
  const modelConfigForm =
    itemId === "services"
      ? `
        <div class="model-config-form" style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #e5e7eb;">
          <h5 style="font-size: 14px; font-weight: 600; margin: 0 0 12px; color: #374151;">模型配置</h5>

          <div class="form-field" style="margin-bottom: 12px;">
            <label style="display: block; font-size: 13px; color: #6b7280; margin-bottom: 4px;">服务商 (Provider)</label>
            <select id="model-provider" style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; background: white;">
              ${providerOptions.map(opt => `<option value="${opt.value}" ${opt.value === currentProvider ? "selected" : ""}>${opt.label}</option>`).join("")}
            </select>
          </div>

          <div class="form-field" style="margin-bottom: 12px;">
            <label style="display: block; font-size: 13px; color: #6b7280; margin-bottom: 4px;">模型</label>
            <select id="model-name" style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; background: white;">
              ${(modelOptions[currentProvider] || modelOptions.openai).map(opt => `<option value="${opt.value}" ${opt.value === currentModel ? "selected" : ""}>${opt.label}</option>`).join("")}
            </select>
          </div>

          <div class="form-field" style="margin-bottom: 12px;">
            <label style="display: block; font-size: 13px; color: #6b7280; margin-bottom: 4px;">AI Base URL</label>
            <input type="text" id="model-base-url" placeholder="https://api.openai.com/v1" style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px;" />
            <p style="font-size: 12px; color: #9ca3af; margin: 4px 0 0;">可自定义服务入口地址</p>
          </div>

          <div class="form-field" style="margin-bottom: 12px;">
            <label style="display: block; font-size: 13px; color: #6b7280; margin-bottom: 4px;">API Key</label>
            <input type="password" id="model-api-key" placeholder="sk-..." style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px;" />
            <p style="font-size: 12px; color: #9ca3af; margin: 4px 0 0;">仅存储在本地，不会上传</p>
          </div>

          <div class="form-field" style="margin-bottom: 12px;">
            <button type="button" data-action="test-model-connection" style="padding: 8px 16px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; background: #f9fafb; cursor: pointer;">
              测试连接
            </button>
            <span id="test-result" style="margin-left: 8px; font-size: 13px;"></span>
          </div>

          <!-- 进阶配置折叠 -->
          <details style="margin-top: 16px;">
            <summary style="font-size: 13px; color: #6b7280; cursor: pointer;">进阶配置</summary>
            <div style="margin-top: 12px;">
              <div class="form-field" style="margin-bottom: 12px;">
                <label style="display: block; font-size: 13px; color: #6b7280; margin-bottom: 4px;">LLM 模式</label>
                <select id="llm-mode" style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; background: white;">
                  <option value="auto">自动</option>
                  <option value="chat">对话模式</option>
                  <option value="completion">补全模式</option>
                </select>
              </div>
              <div class="form-field">
                <label style="display: block; font-size: 13px; color: #6b7280; margin-bottom: 4px;">超时时间（秒）</label>
                <input type="number" id="model-timeout" value="30" style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px;" />
              </div>
            </div>
          </details>
        </div>
      `
      : "";

  const serviceActions =
    itemId === "services"
      ? `
          <div class="action-row settings-detail-actions">
            ${
              state.modelStatus === "available"
                ? `<button class="secondary-button" type="button" data-action="open-overlay" data-kind="disconnect-model">断开模型</button>`
                : `<button class="primary-button" type="button" data-action="connect-model">${state.modelStatus === "failed" ? "重新测试连接" : "保存配置"}</button>`
            }
            ${pending ? `<button class="secondary-button" type="button" data-action="resume-pending">继续刚才操作</button>` : ""}
          </div>
        `
      : "";

  return `
    <section class="settings-detail-card">
      <span class="section-kicker">${detail.kicker}</span>
      <h4>${detail.title}</h4>
      <div class="detail-list">
        ${detail.rows
          .map(
            (row) => `
              <div class="detail-row">
                <strong>${row.label}</strong>
                <span>${row.value}</span>
              </div>
            `,
          )
          .join("")}
      </div>
      ${modelConfigForm}
      ${serviceActions}
    </section>
  `;
}

function renderDetailScreen(state) {
  const scope = state.sheet.scope;
  const itemId = state.sheet.id;

  if (scope === "schedule") {
    return renderScheduleDetail(state, itemId);
  }

  const titleMap = {
    today: "当前事项详情",
    roles: "角色详情",
    me: {
      profile: "身份与摘要",
      services: "已接入服务",
      preferences: "偏好管理",
      memory: "系统记忆与习惯",
      goals: "目标与阶段",
      records: "记录与依据",
      privacy: "提醒与隐私",
      settings: "设置",
    }[itemId] || "设置详情",
  };

  let content = "";
  if (scope === "today") content = renderTodayDetail(state, itemId);
  if (scope === "roles") content = renderRolesDetail(state, itemId);
  if (scope === "me") content = renderMeDetail(state, itemId);

  return `
    <div class="detail-layer">
      <section class="detail-screen">
        <header class="detail-nav">
          <button class="nav-icon" type="button" data-action="close-sheet" aria-label="返回上一级">
            ${backIcon()}
          </button>
          <strong>${titleMap[scope]}</strong>
          <button class="nav-icon" type="button" data-action="open-assistant" data-scope="${scope}" data-id="${itemId}" aria-label="交给助理">
            ${moreIcon()}
          </button>
        </header>

        <section class="detail-scroll">
          ${content}
        </section>

        <footer class="detail-dock">
          <div class="chip-row">
            <button class="chip" type="button" data-action="close-sheet">返回</button>
            <button class="chip" type="button" data-action="open-assistant" data-scope="${scope}" data-id="${itemId}">交给助理</button>
          </div>
          <form class="assistant-composer" data-form="detail" data-scope="${scope}" data-id="${itemId}">
            <input type="text" name="detail-command" autocomplete="off" placeholder="直接补一句要求" />
            <button class="composer-icon" type="button" data-action="voice-hint" aria-label="语音输入">
              ${micIcon()}
            </button>
            <button class="composer-send" type="submit" aria-label="发送指令">
              ${sendIcon()}
            </button>
          </form>
        </footer>
      </section>
    </div>
  `;
}

function renderOverlaySheet(state) {
  const currentTask = state.sheet.id ? getTaskById(state, state.sheet.id) : getCurrentTask(state);
  const copyByKind = {
    "delay-today": {
      title: "延后当前事项",
      body: "把当前事项顺延 30 分钟，再保留后面的安排不变。",
      confirm: "确认延后",
    },
    "delete-current": {
      title: "删除当前事项",
      body: `删除"${currentTask?.title || "当前事项"}"，不会影响其他默认设置。`,
      confirm: "确认删除",
      danger: true,
    },
    "disconnect-model": {
      title: "断开模型接入",
      body: "断开后，这里的模型能力会暂时不可用。",
      confirm: "确认断开",
      danger: true,
    },
    "quick-create": {
      title: "快速新建",
      body: "先加一条占位安排，细节稍后再补。",
      confirm: "新建一条事件",
    },
    "model-gate": {
      title: "需要先接入模型",
      body: "这个操作要先用到推理能力。先去「我的 > 已接入服务」完成模型接入，回来还能继续刚才的操作。",
      confirm: "去设置模型",
    },
  };

  const copy = copyByKind[state.sheet.kind];

  return `
    <div class="sheet-overlay" data-action="close-sheet"></div>
    <section class="confirm-sheet">
      <div class="sheet-handle"></div>
      <p class="delete-sheet-title">${copy.title}</p>
      <p class="delete-sheet-copy">${copy.body}</p>
      <button
        class="sheet-action ${copy.danger ? "is-danger" : ""}"
        type="button"
        data-action="confirm-overlay"
        data-kind="${state.sheet.kind}"
      >
        ${copy.confirm}
      </button>
      <button class="sheet-action" type="button" data-action="close-sheet">取消</button>
    </section>
  `;
}

function renderAssistantSheet(state) {
  // 获取基础上下文
  const baseContext = getAssistantContext(state, state.sheet.scope, state.sheet.id);
  // 合并来自 user_direct_edit 等场景的额外上下文
  const sheetContext = state.sheet.context || {};
  const context = { ...baseContext, ...sheetContext };

  const selection = state.sheet.selection || context.suggestions[0];
  const governanceDecision = determineGovernanceState(context, state.modelStatus);
  const governanceMeta = GovernanceStateMeta[governanceDecision.state];

  return `
    <div class="sheet-overlay" data-action="close-sheet"></div>
    <section class="assistant-sheet">
      <div class="sheet-handle"></div>
      <div class="sheet-head">
        <div>
          <span class="section-kicker">助理</span>
          <h4>${context.task}</h4>
          <p>${context.sourcePage} · ${context.sourceItem}</p>
        </div>
        <button class="nav-icon" type="button" data-action="close-sheet" aria-label="关闭助理对话">
          ${backIcon()}
        </button>
      </div>

      <!-- 治理状态卡片 -->
      <div class="governance-status-card" style="background: ${governanceMeta.color}15; border: 1px solid ${governanceMeta.color}30; border-radius: 12px; padding: 12px 16px; margin: 0 16px 16px; display: flex; align-items: center; gap: 12px;">
        <div style="width: 32px; height: 32px; border-radius: 50%; background: ${governanceMeta.color}; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">
          ${governanceMeta.icon}
        </div>
        <div style="flex: 1;">
          <strong style="color: ${governanceMeta.color}; font-size: 14px;">${governanceMeta.label}</strong>
          <p style="margin: 2px 0 0; color: #666; font-size: 13px;">${governanceDecision.reason}</p>
        </div>
      </div>

      <div class="assistant-section">
        <div class="assistant-context-card">
          <div class="assistant-context-row">
            <span>来源</span>
            <strong>${context.sourcePage} · ${context.sourceItem}</strong>
          </div>
          <div class="assistant-context-row">
            <span>返回后会更新</span>
            <strong>${context.returnTarget}</strong>
          </div>
          <p>${context.impact}</p>
        </div>
      </div>

      <div class="assistant-section">
        <span class="section-kicker">试试这些说法</span>
        <div class="chip-grid">
          ${context.suggestions
            .map(
              (item) => `
                <button
                  class="chip ${item === selection ? "is-active" : ""}"
                  type="button"
                  data-action="choose-assistant"
                  data-value="${item}"
                >
                  ${item}
                </button>
              `,
            )
            .join("")}
        </div>
      </div>

      <div class="assistant-section">
        <span class="section-kicker">刚刚聊到</span>
        ${renderThread([
          ...THREADS[context.scope],
          { role: "user", text: selection },
        ])}
      </div>

      <div class="assistant-section">
        <form class="assistant-composer" data-form="assistant" data-scope="${context.scope}" data-id="${context.id}">
          <input type="text" name="assistant-command" autocomplete="off" placeholder="直接补一句要求" />
          <button class="composer-icon" type="button" data-action="voice-hint" aria-label="语音输入">
            ${micIcon()}
          </button>
          <button class="composer-send" type="submit" aria-label="发送指令">
            ${sendIcon()}
          </button>
        </form>
      </div>

      <div class="sheet-actions" style="display: flex; gap: 8px; flex-wrap: wrap;">
        ${governanceDecision.nextSteps
          .map(
            (step) => `
              <button
                class="${step.primary ? "primary-button" : "secondary-button"} ${governanceDecision.nextSteps.length === 1 ? "is-wide" : ""}"
                type="button"
                data-action="${step.action}"
                ${step.actionArgs ? `data-scope="${step.actionArgs.scope || ""}" data-id="${step.actionArgs.id || ""}"` : ""}
              >
                ${step.label}
              </button>
            `,
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderToast(state) {
  if (!state.toast) return "";

  return `
    <div class="preview-toast is-visible" aria-live="polite">
      <span>${state.toast}</span>
      <button type="button" data-action="dismiss-toast" aria-label="关闭提示">知道了</button>
    </div>
  `;
}

function renderSheet(state) {
  if (!state.sheet) return "";
  if (state.sheet.type === "detail") return renderDetailScreen(state);
  if (state.sheet.type === "overlay") return renderOverlaySheet(state);
  if (state.sheet.type === "assistant") return renderAssistantSheet(state);
  if (state.sheet.type === "schedule-editor") return renderScheduleEditor(state, state.sheet.id);
  return "";
}

function renderApp(state) {
  return `
    <main class="app-preview-page">
      <section class="device-shell">
        <div class="device-main">
          ${renderHomeScreen(state)}
        </div>
        ${renderSheet(state)}
        ${renderToast(state)}
      </section>
    </main>
  `;
}

class PreviewAppShell {
  constructor(root) {
    this.root = root;
    this.state = createInitialState();
    this.toastTimer = null;
    this.handleClick = this.handleClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  mount() {
    this.root.addEventListener("click", this.handleClick);
    this.root.addEventListener("submit", this.handleSubmit);
    this.render();
  }

  render() {
    this.root.innerHTML = renderApp(this.state);
  }

  showToast(message) {
    if (this.toastTimer) {
      window.clearTimeout(this.toastTimer);
    }

    this.state.toast = message;
    this.render();
    this.toastTimer = window.setTimeout(() => {
      this.state.toast = "";
      this.render();
    }, 2200);
  }

  dismissToast() {
    if (this.toastTimer) {
      window.clearTimeout(this.toastTimer);
    }
    this.state.toast = "";
    this.render();
  }

  closeSheet() {
    this.state.sheet = null;
    this.render();
  }

  switchTab(tab) {
    this.state.activeTab = tab;
    this.state.sheet = null;
    if (tab === "roles") {
      this.state.selectedRoleId = this.state.selectedRoleId || "food";
    }
    this.render();
  }

  openDetail(scope, id) {
    if (scope === "roles" && id) {
      this.state.selectedRoleId = id;
    }
    this.state.sheet = { type: "detail", scope, id };
    this.render();
  }

  openOverlay(kind, id = "") {
    this.state.sheet = { type: "overlay", kind, id };
    this.render();
  }

  openAssistant(scope, id, selection = "", sourceAction = "ask_assistant", options = {}) {
    const context = getAssistantContext(this.state, scope, id, sourceAction, selection);
    if (!options.bypassGate && this.state.modelStatus === "failed") {
      this.state.pendingAssistantAction = {
        scope: context.scope,
        id: context.id,
        selection,
        sourcePage: context.sourcePage,
        sourceItem: context.sourceItem,
        source_action: context.source_action,
        source_page: context.source_page,
        source_item_id: context.source_item_id,
        current_constraints: context.current_constraints,
        returnTarget: context.returnTarget,
      };
      this.state.sheet = { type: "overlay", kind: "model-gate", id: context.id };
      this.render();
      return;
    }
    this.state.sheet = {
      type: "assistant",
      scope,
      id: context.id,
      selection: selection || context.suggestions[0],
    };
    this.render();
  }

  swapMeal() {
    this.state.currentMealIndex = (this.state.currentMealIndex + 1) % this.state.mealOptions.length;
    this.render();
    this.showToast(`已换成"${getCurrentMeal(this.state).title}"。`);
  }

  toggleUtensils() {
    this.state.includeUtensils = !this.state.includeUtensils;
    this.render();
    this.showToast(this.state.includeUtensils ? "已重新加上餐具备注。" : "这次午餐已改成不要餐具。");
  }

  toggleRole(id) {
    const role = this.state.roles.find((entry) => entry.id === id);
    if (!role) return;

    role.enabled = !role.enabled;
    role.availability = role.enabled ? "可用" : "需接入";
    this.render();
    this.showToast(`${role.name}${role.enabled ? "已启用" : "已停用"}。`);
  }

  selectDay(id) {
    this.state.selectedDayId = id;
    this.render();
  }

  selectRole(id) {
    this.state.selectedRoleId = id;
    this.render();
  }

  runRolePrimary(id) {
    const role = this.state.roles.find((entry) => entry.id === id);
    if (!role) return;
    const wasEnabled = role.enabled;
    this.state.selectedRoleId = id;
    if (this.state.modelStatus === "available" && !wasEnabled) {
      role.enabled = true;
      role.availability = "可用";
    }
    this.openAssistant("roles", id, wasEnabled ? "直接开始" : "用这个帮我处理", "role_invoke");
  }

  completeToday(id) {
    const task = getTaskById(this.state, id) || getCurrentTask(this.state);
    if (!task) return;

    task.state = "completed";
    task.status = "已完成";
    this.state.sheet = null;
    this.render();
    this.showToast(`已完成"${task.title}"，今天页会把下一条事项顶到主位。`);
  }

  confirmOverlay(kind) {
    if (kind === "delay-today") {
      const task = this.state.sheet?.id ? getTaskById(this.state, this.state.sheet.id) : getCurrentTask(this.state);
      if (task) {
        task.timeLabel = "12:30-13:00";
        task.note = "已顺延 30 分钟，但仍保留评审会缓冲";
      }
      this.state.sheet = null;
      this.render();
      this.showToast("当前事项已延后 30 分钟。");
      return;
    }

    if (kind === "delete-current") {
      const task = this.state.sheet?.id ? getTaskById(this.state, this.state.sheet.id) : getCurrentTask(this.state);
      if (task) {
        this.state.tasks = this.state.tasks.filter((entry) => entry.id !== task.id);
      }
      this.state.sheet = null;
      this.render();
      this.showToast(`已删除"${task?.title || "当前事项"}"。`);
      return;
    }

    if (kind === "disconnect-model") {
      this.state.modelStatus = "not_configured";
      this.state.modelStatusNote = "模型接入已断开，等待重新选择 provider 与模型";
      this.state.sheet = null;
      this.render();
      this.showToast("模型接入已断开，只影响「我的 > 已接入服务」。");
      return;
    }

    if (kind === "model-gate") {
      this.state.activeTab = "me";
      this.state.sheet = { type: "detail", scope: "me", id: "services" };
      this.render();
      return;
    }

    if (kind === "quick-create") {
      const day = findSelectedDay(this.state);
      const lane = Math.max(0, getScheduleLaneCount(day) - 1);
      day.events.push({
        id: `new-${day.id}`,
        title: "新建事件",
        time: "19:20-19:50",
        startHour: 19,
        startMinute: 20,
        endHour: 19,
        endMinute: 50,
        startMinuteTotal: 1160,
        endMinuteTotal: 1190,
        lane,
        laneSpan: 1,
        status: "待确认",
        tone: "current",
        colorTone: "solid",
        note: "先占个时间，细节稍后再补。",
        location: "待补地点",
        organizer: this.state.profile.name,
        attendees: [this.state.profile.name],
        reminder: "提前 5 分钟",
        owner: this.state.profile.name,
      });
      this.state.sheet = null;
      this.render();
      this.showToast("已新增一条占位事件。");
      return;
    }
  }

  applyAssistant() {
    if (!this.state.sheet) return;

    const context = getAssistantContext(this.state, this.state.sheet.scope, this.state.sheet.id);
    const selection = this.state.sheet.selection || context.suggestions[0];

    if (context.scope === "today") {
      const task = getTaskById(this.state, context.id) || getCurrentTask(this.state);
      if (task?.kind === "meal") {
        if (selection.includes("更轻")) {
          this.state.currentMealIndex = 1;
        }
        if (selection.includes("餐具")) {
          this.state.includeUtensils = false;
        }
      }

      if (task) {
        task.note = `已按"${selection}"更新这件事。`;
        task.support = "如果还要继续改，直接补一句就可以。";
      }
    }

    if (context.scope === "schedule") {
      const picked = findEventById(this.state, context.id);
      const event = picked?.event || getConflictEvent(this.state);
      if (event) {
        event.status = "待确认";
        event.tone = "current";
        event.colorTone = "solid";
        event.note = `已按"${selection}"给出新的时间顺序建议。`;
      }
    }

    if (context.scope === "roles") {
      const role = this.state.roles.find((entry) => entry.id === context.id) || findSelectedRole(this.state);
      role.enabled = true;
      role.availability = "可用";
      role.result = `刚刚按"${selection}"完成一次调用。`;
    }

    if (context.scope === "me") {
      this.state.modelStatus = "available";
      this.state.modelStatusNote = `OpenAI / GPT-5.4 · 刚按"${selection}"重新测试通过`;
      this.state.privacyNote = "已按新的设置更新提醒与默认值。";
    }

    this.state.sheet = null;
    this.state.pendingAssistantAction = null;
    this.render();
    if (context.scope === "me") {
      this.showToast("相关设置已更新。");
    }
  }

  connectModel() {
    this.state.modelStatus = "available";
    this.state.modelStatusNote = "OpenAI / GPT-5.4 · 刚完成连接测试";
    this.render();
    this.showToast(this.state.pendingAssistantAction ? "模型已连接，可以继续刚才的操作。" : "模型已连接。");
  }

  resumePendingAction() {
    const pending = this.state.pendingAssistantAction;
    if (!pending) return;
    this.openAssistant(pending.scope, pending.id, pending.selection || "", pending.source_action, { bypassGate: true });
  }

  // ============ Schedule Editor Methods ============

  openScheduleEditor(eventId) {
    this.state.sheet = { type: "schedule-editor", id: eventId };
    this.render();
  }

  cancelScheduleEdit() {
    const eventId = this.state.sheet?.id;
    this.state.scheduleState.editingEventId = null;
    this.state.scheduleState.editingFields = {};
    // 返回到 detail 视图
    this.state.sheet = { type: "detail", scope: "schedule", id: eventId };
    this.render();
  }

  saveScheduleEdit() {
    const eventId = this.state.sheet?.id;
    if (!eventId) return;

    const picked = findEventById(this.state, eventId);
    const event = picked?.event;
    if (!event) return;

    // 收集变更
    const titleEl = document.getElementById("edit-title");
    const timeEl = document.getElementById("edit-time");
    const locationEl = document.getElementById("edit-location");
    const noteEl = document.getElementById("edit-note");
    const reminderEl = document.getElementById("edit-reminder");

    const changes = {
      title: titleEl?.value || event.title,
      time: timeEl?.value || event.time,
      location: locationEl?.value || event.location || "",
      note: noteEl?.value || event.note || "",
      reminder: reminderEl?.selectedOptions?.[0]?.text || event.reminder,
    };

    // 1. 先更新页面数据
    Object.assign(event, changes);

    // 2. 判断影响范围
    const syncResult = simulateUserDirectEdit(event, changes);
    this.state.scheduleState.lastSyncResult = syncResult;

    // 3. 根据结果分支
    if (syncResult.outcome === "keep-current") {
      // 简单修改：返回 detail
      this.state.sheet = { type: "detail", scope: "schedule", id: eventId };
      this.render();
      this.showToast("已更新，无需重排。");
    } else {
      // 复杂修改：升级到 assistant
      this.openAssistantForReplan(event, changes, syncResult);
    }
  }

  openAssistantForReplan(event, changes, syncResult) {
    // 设置助理上下文
    this.state.sheet = {
      type: "assistant",
      scope: "schedule",
      id: event.id,
      governanceState: "wait-confirmation",
      context: {
        sourcePage: "schedule",
        sourceAction: "user_direct_edit",
        eventId: event.id,
        changes: changes,
        syncResult: syncResult,
      },
      selection: "让助理帮我重排后续安排",
    };
    this.render();
  }

  testModelConnection() {
    const resultEl = document.getElementById("test-result");
    if (!resultEl) return;

    resultEl.textContent = "测试中...";
    resultEl.style.color = "#6b7280";

    // 模拟测试（实际应该调用 API）
    setTimeout(() => {
      const providerEl = document.getElementById("model-provider");
      const modelEl = document.getElementById("model-name");

      const provider = providerEl?.value || "openai";
      const model = modelEl?.value || "gpt-5.4";

      // 模拟成功
      resultEl.textContent = "✓ 连接成功";
      resultEl.style.color = "#22c55e";

      // 更新状态
      this.state.providerName = provider;
      this.state.modelName = model;
    }, 1000);
  }

  handleCommand(rawValue, fallbackScope = this.state.activeTab, fallbackId = "") {
    const value = rawValue.trim();
    if (!value) {
      this.openAssistant(fallbackScope, fallbackId);
      return;
    }

    const currentItem =
      fallbackScope === "today" ? getTaskById(this.state, fallbackId) || getCurrentTask(this.state) : null;

    if (value.includes("换一个") && currentItem?.kind === "meal") {
      this.swapMeal();
      return;
    }

    if (value.includes("不要餐具") && currentItem?.kind === "meal") {
      if (this.state.includeUtensils) {
        this.toggleUtensils();
      } else {
        this.showToast("当前已经是不带餐具的设置。");
      }
      return;
    }

    this.openAssistant(fallbackScope, fallbackId, value, "composer_submit");
  }

  handleClick(event) {
    if (!(event.target instanceof Element)) return;

    const target = event.target.closest("[data-action]");
    if (!target) return;

    const action = target.dataset.action;

    if (action === "switch-tab") {
      this.switchTab(target.dataset.tab || "today");
      return;
    }

    if (action === "open-detail") {
      this.openDetail(target.dataset.scope || this.state.activeTab, target.dataset.id || "");
      return;
    }

    if (action === "open-overlay") {
      this.openOverlay(target.dataset.kind || "", target.dataset.id || "");
      return;
    }

    if (action === "open-assistant") {
      this.openAssistant(target.dataset.scope || this.state.activeTab, target.dataset.id || "");
      return;
    }

    if (action === "close-sheet") {
      this.closeSheet();
      return;
    }

    if (action === "dismiss-toast") {
      this.dismissToast();
      return;
    }

    if (action === "swap-meal") {
      this.swapMeal();
      return;
    }

    if (action === "toggle-utensils") {
      this.toggleUtensils();
      return;
    }

    if (action === "toggle-role") {
      this.toggleRole(target.dataset.id || "");
      return;
    }

    if (action === "role-primary") {
      this.runRolePrimary(target.dataset.id || "");
      return;
    }

    if (action === "select-day") {
      this.selectDay(target.dataset.id || "wed");
      return;
    }

    if (action === "select-role") {
      this.selectRole(target.dataset.id || "food");
      return;
    }

    if (action === "complete-today") {
      this.completeToday(target.dataset.id || "");
      return;
    }

    if (action === "confirm-overlay") {
      this.confirmOverlay(target.dataset.kind || "");
      return;
    }

    if (action === "connect-model") {
      this.connectModel();
      return;
    }

    if (action === "resume-pending") {
      this.resumePendingAction();
      return;
    }

    if (action === "choose-assistant") {
      if (this.state.sheet) {
        this.state.sheet.selection = target.dataset.value || "";
        this.render();
      }
      return;
    }

    if (action === "apply-assistant") {
      this.applyAssistant();
      return;
    }

    if (action === "voice-hint") {
      this.showToast("语音入口还在预览中，先用输入框继续。");
    }

    if (action === "open-schedule-editor") {
      this.openScheduleEditor(target.dataset.id || "");
      return;
    }

    if (action === "save-schedule-edit") {
      this.saveScheduleEdit();
      return;
    }

    if (action === "cancel-schedule-edit") {
      this.cancelScheduleEdit();
      return;
    }

    if (action === "test-model-connection") {
      this.testModelConnection();
      return;
    }
  }

  handleSubmit(event) {
    if (!(event.target instanceof HTMLFormElement)) return;

    event.preventDefault();
    const form = event.target;
    const input = form.querySelector('input[type="text"]');
    if (!(input instanceof HTMLInputElement)) return;

    this.handleCommand(input.value, form.dataset.scope || this.state.activeTab, form.dataset.id || "");
    input.value = "";
  }
}

window.PreviewAppShell = PreviewAppShell;
window.mountAppShellPreview = function mountAppShellPreview(root) {
  const app = new PreviewAppShell(root);
  app.mount();
  window.previewAppShell = app;
  return app;
};
