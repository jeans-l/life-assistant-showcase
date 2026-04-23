/**
 * Copyright (c) 2026 jeans-l / Liu / 221226. Released under the MIT License. See ../../LICENSE.md.
 * Origin: jeans-l
 * Signature: 221226
 * Maintainer: liu
 */

const MEAL_LIBRARY_URL = "./local-seeds/meal/library.json";
const LIGHT_REQUEST_TAGS = ["light", "low-oil"];
const DEFAULT_SELECTION_CONTEXT = Object.freeze({
  mealSlot: "lunch",
  city: "上海",
  locationTag: "office-lunch",
  budgetMax: 38,
  preferredTags: ["workday", "balanced", "light"],
  excludedDietaryFlags: [],
});

const INITIAL_STATE = {
  activeScreen: "home",
  status: "待处理",
  glanceSummary: "今天节奏稳定，午间事项还在确认",
  pendingSummary: "待处理 2｜待确认 1",
  hint: "正在整理本地 seed 候选",
  deadline: "本地模拟内容 · 不保证实时库存 / ETA",
  utensil: true,
  arrivalOverride: null,
  deletedMode: null,
  deleteSheetOpen: false,
  messages: [],
  mealLibrary: [],
  compatibleCandidates: [],
  currentMealId: null,
  libraryStatus: "loading",
  currentContext: {
    mealSlot: DEFAULT_SELECTION_CONTEXT.mealSlot,
    city: DEFAULT_SELECTION_CONTEXT.city,
    locationTag: DEFAULT_SELECTION_CONTEXT.locationTag,
    budgetMax: DEFAULT_SELECTION_CONTEXT.budgetMax,
    preferredTags: [...DEFAULT_SELECTION_CONTEXT.preferredTags],
    excludedDietaryFlags: [...DEFAULT_SELECTION_CONTEXT.excludedDietaryFlags],
  },
};

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
      <path d="M9.25 6.75V5a1.25 1.25 0 0 1 1.25-1.25h3a1.25 1.25 0 0 1 1.25 1.25v1.75"></path>
      <path d="M7.25 9.25v8.5a1.5 1.5 0 0 0 1.5 1.5h6.5a1.5 1.5 0 0 0 1.5-1.5v-8.5"></path>
      <path d="M10 10.5v6"></path>
      <path d="M14 10.5v6"></path>
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

function bubbleTemplate(message) {
  const roleClass = `is-${message.role}`;
  return `
    <article class="thread-bubble ${roleClass}">
      <p>${message.text}</p>
    </article>
  `;
}

function arraysOverlap(left, right) {
  const rightSet = new Set(right);
  return left.some((item) => rightSet.has(item));
}

function scoreCandidate(candidate, context, extraPreferredTags = []) {
  const candidateTags = Array.isArray(candidate.tags) ? candidate.tags : [];
  let score = 0;

  for (const tag of context.preferredTags) {
    if (candidateTags.includes(tag)) {
      score += 2;
    }
  }

  for (const tag of extraPreferredTags) {
    if (candidateTags.includes(tag)) {
      score += 3;
    }
  }

  if (candidate.deliveryMinutes <= 30) {
    score += 1;
  }

  if (candidate.price <= context.budgetMax - 6) {
    score += 2;
  } else if (candidate.price <= context.budgetMax - 2) {
    score += 1;
  }

  return score;
}

function sortCandidates(candidates, context, extraPreferredTags = []) {
  return [...candidates].sort((left, right) => {
    return (
      scoreCandidate(right, context, extraPreferredTags) - scoreCandidate(left, context, extraPreferredTags) ||
      left.price - right.price ||
      left.deliveryMinutes - right.deliveryMinutes ||
      left.merchant.localeCompare(right.merchant, "zh-Hans-CN") ||
      left.title.localeCompare(right.title, "zh-Hans-CN")
    );
  });
}

function candidateMatchesContext(candidate, context) {
  if (candidate.mealSlot !== context.mealSlot) {
    return false;
  }

  if (candidate.city !== context.city) {
    return false;
  }

  if (candidate.locationTag !== context.locationTag) {
    return false;
  }

  if (candidate.price > context.budgetMax) {
    return false;
  }

  if (arraysOverlap(candidate.dietaryFlags || [], context.excludedDietaryFlags)) {
    return false;
  }

  return true;
}

function chooseVisualVariant(candidate) {
  const tags = candidate.tags || [];
  return tags.includes("light") || tags.includes("low-oil") ? "lighter" : "default";
}

function formatArrival(minutes) {
  return `预计 ${minutes} 分钟送达（模拟）`;
}

function fallbackMealView(libraryStatus) {
  const base = {
    vendor: "Meal 本地候选库",
    simulationLabel: "本地模拟内容",
    visualVariant: "default",
    explanation: "这里展示的是本地 seed 驱动的午餐原型，不会连接真实外卖平台。",
  };

  if (libraryStatus === "loading") {
    return {
      ...base,
      title: "正在整理午餐候选",
      price: "—",
      arrival: "正在读取 library.json",
      profile: "工作日午餐、清淡、高蛋白",
      freshnessBasis: "正在加载本地 seed 候选",
    };
  }

  if (libraryStatus === "error") {
    return {
      ...base,
      title: "本地候选库暂不可用",
      price: "—",
      arrival: "请稍后重试",
      profile: "library.json 读取失败",
      freshnessBasis: "当前无法读取本地候选，请重新加载",
    };
  }

  return {
    ...base,
    title: "当前没有匹配候选",
    price: "—",
    arrival: "建议放宽预算或口味条件",
    profile: "预算、标签或地点条件过严",
    freshnessBasis: "本地 seed 已加载，但当前筛选后没有结果",
  };
}

class LunchFlowPreview {
  constructor(root) {
    this.root = root;
    this.state = structuredClone(INITIAL_STATE);
    this.toastTimer = null;
  }

  mount() {
    if (!this.root) {
      return;
    }

    this.root.innerHTML = this.render();
    this.cacheElements();
    this.bindEvents();
    this.syncUi();
    void this.loadMealLibrary();
  }

  render() {
    return `
      <main class="preview-page">
        <section class="preview-hero">
          <div class="preview-copy">
            <span class="preview-badge">生活助理 / Lunch Flow Preview</span>
            <h1>把“当前事项”做成一个可决策、可对话、可直接执行的午餐工作台。</h1>
            <p>
              首页只负责看见和拍板，详情页则把理解、修改、问答和执行合在一起。
              我保留了 Apple 式留白和 Google 式明确 action，同时把 ChatGPT 的对话入口嵌回事项处理流里。
            </p>
          </div>
          <div class="preview-note">
            <span>393 × 852 pt 画板</span>
            <span>双页同一套设计语言</span>
            <span>本地 seed 驱动</span>
          </div>
        </section>

        <section class="phone-grid">
          <article
            class="phone-stage is-active"
            data-screen="home"
          >
            <header class="stage-meta">
              <span>看见 + 快速决策</span>
              <h2>首页 / 当前事项</h2>
              <p>首屏只保留一件最该处理的事，底部输入框始终带着当前事项上下文。</p>
            </header>

            <div class="phone-shell">
              <div class="phone-bezel"></div>
              <div class="phone-surface home-screen">
                <div class="phone-topline">
                  <span></span>
                  <span class="phone-island"></span>
                  <span></span>
                </div>

                <section class="screen-scroll">
                  <header class="home-top">
                    <div>
                      <p class="calendar-date">4月1日</p>
                      <h3>周三</h3>
                    </div>
                    <div class="weather-card">
                      ${sunIcon()}
                      <strong>20°C</strong>
                    </div>
                  </header>

                  <div class="home-summary-stack">
                    <div class="glance-strip">
                      <span class="summary-label">今日概览</span>
                      <strong data-bind="glanceSummary"></strong>
                    </div>
                    <div class="pending-strip">
                      <span class="summary-label">待处理</span>
                      <strong data-bind="pendingSummary"></strong>
                    </div>
                  </div>

                  <article class="focus-card">
                    <div class="focus-card-top">
                      <div>
                        <span class="section-kicker">当前事项</span>
                        <div class="title-row">
                          <h4>午餐</h4>
                          <span class="status-pill" data-bind="statusText">待处理</span>
                        </div>
                      </div>
                      <button
                        class="ghost-icon"
                        type="button"
                        data-action="open-delete-sheet"
                        aria-label="删除午餐安排"
                      >
                        ${trashIcon()}
                      </button>
                    </div>

                    <div class="focus-card-content" data-focus-content>
                      <div class="focus-meta">
                        <span>12:00-13:00</span>
                        <span class="meta-dot"></span>
                        <span data-bind="hint"></span>
                      </div>

                      <section class="meal-sheet">
                        <div class="meal-visual" data-bind="mealVisual">
                          ${mealIllustration()}
                        </div>
                        <div class="meal-copy">
                          <h5 data-bind="mealTitle"></h5>
                          <p data-bind="vendor"></p>
                          <span class="meal-source-badge" data-bind="simulationLabel"></span>
                          <p class="meal-freshness-note" data-bind="freshnessBasis"></p>
                          <div class="meal-tags">
                            <span class="meal-tag" data-bind="utensilLabel"></span>
                            <span class="meal-tag is-muted" data-bind="profile"></span>
                          </div>
                          <div class="meal-price-row">
                            <strong data-bind="price"></strong>
                            <span data-bind="arrival"></span>
                          </div>
                        </div>
                      </section>

                      <div class="action-row">
                        <button
                          class="secondary-button"
                          type="button"
                          data-action="snooze"
                        >
                          延后
                        </button>
                        <button
                          class="secondary-button"
                          type="button"
                          data-action="show-detail"
                        >
                          查看详情
                        </button>
                        <button
                          class="primary-button"
                          type="button"
                          data-action="confirm"
                        >
                          <span data-bind="confirmLabel">继续</span>
                        </button>
                      </div>
                    </div>

                    <div class="focus-empty-state" data-focus-empty hidden>
                      <p class="focus-empty-title" data-bind="emptyTitle"></p>
                      <p class="focus-empty-copy" data-bind="emptyCopy"></p>
                      <button
                        class="secondary-button is-full"
                        type="button"
                        data-action="restore-preview"
                      >
                        <span data-bind="emptyActionLabel">重新加载候选</span>
                      </button>
                    </div>
                  </article>
                </section>

                <footer class="home-dock">
                  <div class="chip-row">
                    <button class="chip" type="button" data-action="swap">换一个</button>
                    <button class="chip" type="button" data-action="no-utensil">不要餐具</button>
                  </div>

                  <form class="assistant-composer is-home" data-form="home">
                    <input
                      type="text"
                      name="home-command"
                      autocomplete="off"
                      data-input="home"
                      placeholder="问问这份午餐，或直接说“换一个”"
                    />
                    <button class="composer-icon" type="button" aria-label="语音输入">
                      ${micIcon()}
                    </button>
                    <button class="composer-send" type="submit" aria-label="发送指令">
                      ${sendIcon()}
                    </button>
                  </form>

                  <nav class="tabbar" aria-label="底部导航">
                    <button class="tabbar-item is-active" type="button">
                      <span class="tabbar-icon"></span>
                      <span>今天</span>
                    </button>
                    <button class="tabbar-item" type="button">
                      <span class="tabbar-icon is-calendar"></span>
                      <span>日程</span>
                    </button>
                    <button class="tabbar-item" type="button">
                      <span class="tabbar-icon"></span>
                      <span>角色</span>
                    </button>
                    <button class="tabbar-item" type="button">
                      <span class="tabbar-icon is-profile"></span>
                      <span>我的</span>
                    </button>
                  </nav>
                </footer>
              </div>
            </div>
          </article>

          <article
            class="phone-stage"
            data-screen="detail"
          >
            <header class="stage-meta">
              <span>理解 + 修改 + 对话 + 执行</span>
              <h2>事项详情 / 可对话执行</h2>
              <p>这里不再是静态详情页，而是继续处理这件午餐事项的工作台。</p>
            </header>

            <div class="phone-shell">
              <div class="phone-bezel"></div>
              <div class="phone-surface detail-screen">
                <div class="phone-topline">
                  <span></span>
                  <span class="phone-island"></span>
                  <span></span>
                </div>

                <header class="detail-nav">
                  <button
                    class="nav-icon"
                    type="button"
                    data-action="back-home"
                    aria-label="返回首页"
                  >
                    ${backIcon()}
                  </button>
                  <strong>午餐安排</strong>
                  <button class="nav-icon" type="button" aria-label="更多操作">
                    ${moreIcon()}
                  </button>
                </header>

                <section class="detail-scroll">
                  <article class="overview-card">
                    <div class="overview-top">
                      <div>
                        <span class="section-kicker">事项概览</span>
                        <div class="title-row">
                          <h4>午餐</h4>
                          <span class="status-pill" data-bind="statusText">待处理</span>
                        </div>
                      </div>
                    </div>
                    <div class="overview-grid">
                      <div>
                        <span>时间</span>
                        <strong>12:00-13:00</strong>
                      </div>
                      <div>
                        <span>当前方案</span>
                        <strong data-bind="vendor"></strong>
                      </div>
                    </div>
                    <p class="overview-hint" data-bind="deadline"></p>
                  </article>

                  <article class="plan-card-detail">
                    <div class="plan-card-top">
                      <div>
                        <span class="section-kicker">当前方案</span>
                        <h4>继续处理</h4>
                      </div>
                      <button
                        class="capsule-button"
                        type="button"
                        data-action="swap"
                      >
                        换一个
                      </button>
                    </div>

                    <div class="plan-card-body">
                      <div class="meal-visual is-large" data-bind="mealVisual">
                        ${mealIllustration()}
                      </div>
                      <div class="meal-copy">
                        <h5 data-bind="mealTitle"></h5>
                        <p data-bind="vendor"></p>
                        <span class="meal-source-badge" data-bind="simulationLabel"></span>
                        <p class="meal-freshness-note" data-bind="freshnessBasis"></p>
                        <div class="meal-tags">
                          <span class="meal-tag" data-bind="utensilLabel"></span>
                          <span class="meal-tag is-muted" data-bind="profile"></span>
                        </div>
                        <div class="meal-price-row">
                          <strong data-bind="price"></strong>
                          <span data-bind="arrival"></span>
                        </div>
                      </div>
                    </div>
                  </article>

                  <section class="adjustment-section">
                    <div class="section-heading">
                      <span class="section-kicker">快捷调整</span>
                      <h4>直接改，不用重新描述一遍</h4>
                    </div>
                    <div class="chip-grid">
                      <button class="chip is-wide" type="button" data-action="light">换个清淡点的</button>
                      <button class="chip" type="button" data-action="no-utensil">不要餐具</button>
                      <button class="chip" type="button" data-action="delay">延后半小时</button>
                      <button class="chip is-wide" type="button" data-action="why">为什么推荐这个</button>
                    </div>
                  </section>

                  <section class="thread-card">
                    <div class="section-heading">
                      <span class="section-kicker">事项对话</span>
                      <h4>所有问答都绑定当前午餐上下文</h4>
                    </div>
                    <div class="thread-list" data-thread></div>
                  </section>
                </section>

                <footer class="detail-dock">
                  <form class="assistant-composer" data-form="detail">
                    <input
                      type="text"
                      name="detail-command"
                      autocomplete="off"
                      data-input="detail"
                      placeholder="直接说你的要求"
                    />
                    <button class="composer-icon" type="button" aria-label="语音输入">
                      ${micIcon()}
                    </button>
                    <button class="composer-send" type="submit" aria-label="发送指令">
                      ${sendIcon()}
                    </button>
                  </form>
                </footer>
              </div>
            </div>
          </article>
        </section>

        <div class="sheet-overlay" data-sheet-overlay hidden></div>
        <section class="delete-sheet" data-delete-sheet hidden aria-label="删除选项">
          <div class="delete-sheet-handle"></div>
          <p class="delete-sheet-title">删除当前事项</p>
          <p class="delete-sheet-copy">请确认删除范围。你可以只删除今天这次，也可以删除后续重复安排。</p>
          <button class="sheet-action is-danger" type="button" data-action="delete-once">删除今天这次</button>
          <button class="sheet-action is-danger" type="button" data-action="delete-future">删除后续重复</button>
          <button class="sheet-action" type="button" data-action="close-delete-sheet">取消</button>
        </section>

        <div class="preview-toast" data-toast hidden></div>
      </main>
    `;
  }

  cacheElements() {
    this.stageElements = [...this.root.querySelectorAll(".phone-stage")];
    this.threadElement = this.root.querySelector("[data-thread]");
    this.toastElement = this.root.querySelector("[data-toast]");
    this.focusContentElement = this.root.querySelector("[data-focus-content]");
    this.focusEmptyElement = this.root.querySelector("[data-focus-empty]");
    this.deleteSheetElement = this.root.querySelector("[data-delete-sheet]");
    this.sheetOverlayElement = this.root.querySelector("[data-sheet-overlay]");
  }

  bindEvents() {
    this.root.querySelectorAll("[data-action]").forEach((element) => {
      element.addEventListener("click", () => {
        const action = element.dataset.action;
        this.handleAction(action);
      });
    });

    this.root.querySelectorAll("[data-form]").forEach((form) => {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const input = form.querySelector("input");
        const value = input.value.trim();

        if (!value) {
          return;
        }

        this.handleFreeformCommand(value, form.dataset.form);
        input.value = "";
      });
    });

    this.sheetOverlayElement?.addEventListener("click", () => {
      this.handleAction("close-delete-sheet");
    });
  }

  async loadMealLibrary({ announceReload = false } = {}) {
    this.state.libraryStatus = "loading";
    this.state.hint = "正在整理本地 seed 候选";
    this.state.deadline = "本地模拟内容 · 不保证实时库存 / ETA";
    this.syncUi();

    try {
      const response = await fetch(MEAL_LIBRARY_URL, { cache: "no-store" });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const library = await response.json();

      if (!Array.isArray(library)) {
        throw new Error("library.json 必须是数组");
      }

      this.state.mealLibrary = library;
      this.refreshCandidates({ preserveCurrent: false });

      if (this.state.libraryStatus === "ready") {
        this.state.hint = "来自本地 seed 库，可随时切换候选";
        if (announceReload) {
          this.showToast("已重新载入本地午餐候选");
        }
      } else {
        this.state.hint = "当前条件下没有符合的本地候选";
      }
    } catch (error) {
      console.error("Failed to load meal library", error);
      this.state.mealLibrary = [];
      this.state.compatibleCandidates = [];
      this.state.currentMealId = null;
      this.state.libraryStatus = "error";
      this.state.hint = "本地候选库暂不可用";
      if (announceReload) {
        this.showToast("重新加载失败，请稍后再试");
      }
    }

    this.syncUi();
  }

  refreshCandidates({ preserveCurrent = true } = {}) {
    const compatibleCandidates = sortCandidates(
      this.state.mealLibrary.filter((candidate) => candidateMatchesContext(candidate, this.state.currentContext)),
      this.state.currentContext,
    );

    this.state.compatibleCandidates = compatibleCandidates;

    if (!compatibleCandidates.length) {
      this.state.currentMealId = null;
      this.state.libraryStatus = "empty";
      return;
    }

    this.state.libraryStatus = "ready";

    if (
      preserveCurrent &&
      this.state.currentMealId &&
      compatibleCandidates.some((candidate) => candidate.id === this.state.currentMealId)
    ) {
      return;
    }

    this.state.currentMealId = compatibleCandidates[0].id;
  }

  currentCandidate() {
    return this.state.compatibleCandidates.find((candidate) => candidate.id === this.state.currentMealId) || null;
  }

  currentMeal() {
    const candidate = this.currentCandidate();

    if (!candidate) {
      return fallbackMealView(this.state.libraryStatus);
    }

    return {
      title: candidate.title,
      vendor: candidate.merchant,
      price: `¥${candidate.price}`,
      arrival: this.state.arrivalOverride || formatArrival(candidate.deliveryMinutes),
      profile: candidate.description,
      explanation: candidate.explanation,
      simulationLabel: "本地模拟内容",
      freshnessBasis: `${candidate.fetchedAt} 公开菜单快照 · 不保证实时库存 / ETA`,
      visualVariant: chooseVisualVariant(candidate),
    };
  }

  statusText() {
    if (this.state.deletedMode) {
      return "已删除";
    }

    if (this.state.libraryStatus === "loading") {
      return "加载中";
    }

    if (this.state.libraryStatus === "empty") {
      return "候选不足";
    }

    if (this.state.libraryStatus === "error") {
      return "已降级";
    }

    return this.state.status;
  }

  primaryActionLabel() {
    if (this.state.status === "已完成") {
      return "已完成";
    }

    if (this.state.status === "进行中") {
      return "完成";
    }

    return "继续";
  }

  currentAlternativesCount() {
    return Math.max(this.state.compatibleCandidates.length - 1, 0);
  }

  systemPrompt() {
    if (this.state.libraryStatus !== "ready") {
      return "当前只展示本地模拟内容；如果没有候选，可以重新加载或放宽筛选条件。";
    }

    const meal = this.currentMeal();
    return `这份午餐来自本地 seed 库，${meal.arrival}。当前还有 ${this.currentAlternativesCount()} 个备选，你可以让我换一个、改时间，或补充要求。`;
  }

  ensureCandidateReady(actionLabel) {
    if (this.state.deletedMode) {
      this.restoreDeletedCard();
    }

    if (this.state.libraryStatus !== "ready" || !this.currentCandidate()) {
      this.showToast(`${actionLabel}前先让本地候选库准备好`);
      return false;
    }

    return true;
  }

  rotateMealCandidate(userText) {
    if (!this.ensureCandidateReady("切换方案")) {
      return;
    }

    const ordered = sortCandidates(this.state.compatibleCandidates, this.state.currentContext);
    const currentIndex = ordered.findIndex((candidate) => candidate.id === this.state.currentMealId);
    const nextCandidate = ordered[(currentIndex + 1) % ordered.length];

    if (!nextCandidate) {
      this.showToast("当前没有更多可切换的本地候选");
      return;
    }

    this.state.currentMealId = nextCandidate.id;
    this.state.arrivalOverride = null;
    this.state.status = "待处理";
    this.state.glanceSummary = "今天节奏稳定，午间事项还在确认";
    this.state.pendingSummary = "待处理 2｜待确认 1";
    this.state.hint = "已切到另一份本地 seed 候选";
    this.state.deadline = "本地模拟内容 · 不保证实时库存 / ETA";
    this.pushConversation(userText, "可以，我已经切到下一份兼容候选，仍然只用于本地模拟展示。");
    this.showToast("已切换到新的本地候选");
  }

  selectLighterCandidate(userText) {
    if (!this.ensureCandidateReady("切换清淡方案")) {
      return;
    }

    const ordered = sortCandidates(this.state.compatibleCandidates, this.state.currentContext, LIGHT_REQUEST_TAGS);
    const lightCandidate =
      ordered.find(
        (candidate) => candidate.id !== this.state.currentMealId && arraysOverlap(candidate.tags || [], LIGHT_REQUEST_TAGS),
      ) ||
      ordered.find((candidate) => candidate.id !== this.state.currentMealId);

    if (!lightCandidate) {
      this.showToast("当前没有更清淡的本地候选");
      return;
    }

    this.state.currentMealId = lightCandidate.id;
    this.state.arrivalOverride = null;
    this.state.status = "待处理";
    this.state.glanceSummary = "今天节奏稳定，午间事项还在确认";
    this.state.pendingSummary = "待处理 2｜待确认 1";
    this.state.hint = arraysOverlap(lightCandidate.tags || [], LIGHT_REQUEST_TAGS)
      ? "已优先切到更清淡的候选"
      : "没有明显更清淡的项，已切到次优轻负担候选";
    this.state.deadline = "本地模拟内容 · 不保证实时库存 / ETA";
    this.pushConversation(
      userText,
      arraysOverlap(lightCandidate.tags || [], LIGHT_REQUEST_TAGS)
        ? "可以，我优先换成了更清淡的本地候选，仍保留工作日午餐的稳定感。"
        : "当前库里没有更明确的清淡项，我先换成了次优轻负担候选供你继续模拟。",
    );
    this.showToast("已切到更轻负担的候选");
  }

  handleAction(action) {
    switch (action) {
      case "show-detail":
        if (this.state.deletedMode) {
          this.showToast("当前午餐安排已删除，先恢复预览后再查看详情");
          break;
        }
        if (this.state.libraryStatus !== "ready") {
          this.showToast("当前没有可查看的本地候选，先重新加载或放宽条件");
          break;
        }
        this.setActiveScreen("detail");
        this.showToast("已进入详情页，可以继续改时间、换方案或直接对话");
        break;
      case "back-home":
        this.setActiveScreen("home");
        break;
      case "open-delete-sheet":
        this.state.deleteSheetOpen = true;
        break;
      case "close-delete-sheet":
        this.state.deleteSheetOpen = false;
        break;
      case "delete-once":
        this.state.deleteSheetOpen = false;
        this.state.deletedMode = "single";
        this.state.status = "已删除";
        this.state.glanceSummary = "当前事项已删除，今天节奏待重新确认";
        this.state.pendingSummary = "待处理 1｜待确认 0";
        this.state.hint = "当前午餐安排已删除";
        this.state.deadline = "今天这次午餐已删除";
        this.pushConversation("删除今天这次", "已删除今天这次午餐安排，不影响后续重复计划。");
        this.showToast("已删除今天这次午餐");
        break;
      case "delete-future":
        this.state.deleteSheetOpen = false;
        this.state.deletedMode = "future";
        this.state.status = "已删除";
        this.state.glanceSummary = "当前事项和后续重复已移除，今天安排待重排";
        this.state.pendingSummary = "待处理 1｜待确认 0";
        this.state.hint = "当前及后续同类午餐已删除";
        this.state.deadline = "后续重复午餐安排已删除";
        this.pushConversation("删除后续重复", "已删除这次以及后续所有重复午餐安排，之后不会再自动出现。");
        this.showToast("已删除后续所有午餐安排");
        break;
      case "restore-preview":
        if (this.state.deletedMode) {
          this.restoreDeletedCard();
          this.showToast("已恢复午餐预览");
        } else {
          void this.loadMealLibrary({ announceReload: true });
        }
        break;
      case "confirm":
        if (!this.ensureCandidateReady("继续当前事项")) {
          break;
        }
        if (this.state.status === "已完成") {
          this.showToast("当前事项已经完成，可以查看详情或继续回看");
          break;
        }

        if (this.state.status === "进行中") {
          this.state.status = "已完成";
          this.state.glanceSummary = "当前事项已完成，今天节奏保持稳定";
          this.state.pendingSummary = "待处理 1｜待确认 0";
          this.state.hint = "已完成当前事项";
          this.state.deadline = "本地模拟内容 · 下一事项接续暂未展开";
          this.pushConversation("完成", "已把当前午餐事项标记为完成。这份 lunch-flow demo 暂未展开下一事项接续，但首页摘要已经更新。");
          this.showToast("已完成当前事项");
          break;
        }

        this.state.status = "进行中";
        this.state.glanceSummary = "当前重点已接住，今天节奏稳定";
        this.state.pendingSummary = "待处理 2｜待确认 0";
        this.state.hint = "已继续当前事项，仍可延后或查看详情";
        this.state.deadline = "本地模拟内容 · 不保证实时库存 / ETA";
        this.pushConversation("继续", "好，我先按当前方案继续处理这件午餐事项。需要的话，我还能继续帮你改。");
        this.showToast("已继续当前事项");
        break;
      case "snooze":
        this.state.status = "待处理";
        this.state.glanceSummary = "当前重点已后移，今天节奏仍可控";
        this.state.pendingSummary = "待处理 2｜待确认 1";
        this.state.hint = "已改为 11:40 再提醒";
        this.state.deadline = "本地模拟内容 · 11:40 再回来挑一份";
        this.pushConversation("延后", "好，我会在 11:40 再提醒你回来处理，这仍然只影响本地模拟状态。");
        this.showToast("已设置延后");
        break;
      case "swap":
        this.rotateMealCandidate("换一个");
        break;
      case "light":
        this.selectLighterCandidate("换个清淡点的");
        break;
      case "no-utensil":
        this.toggleUtensil();
        break;
      case "delay":
        if (!this.ensureCandidateReady("改送达时间")) {
          break;
        }
        this.state.arrivalOverride = `预计 ${this.currentCandidate().deliveryMinutes + 30} 分钟送达（模拟）`;
        this.state.deadline = "本地模拟内容 · 已把送达时间向后顺延";
        this.state.hint = "已延后送达，午餐处理窗口同步保留";
        this.pushConversation("延后半小时", "可以，我已经把这份本地候选的到达时间顺延半小时，方便继续演示修改流程。");
        this.showToast("已延后半小时");
        break;
      case "why":
        if (!this.ensureCandidateReady("解释推荐理由")) {
          break;
        }
        this.pushConversation("为什么推荐这个", this.currentMeal().explanation);
        this.showToast("已解释推荐理由");
        break;
      default:
        break;
    }

    this.syncUi();
  }

  handleFreeformCommand(value, source) {
    const normalized = value.replace(/\s+/g, "");

    if (normalized.includes("不要餐具")) {
      this.toggleUtensil(value);
    } else if (normalized.includes("清淡") || normalized.includes("少油")) {
      this.selectLighterCandidate(value);
    } else if (normalized.includes("换")) {
      this.rotateMealCandidate(value);
    } else if (normalized.includes("延后") || normalized.includes("晚点")) {
      if (this.ensureCandidateReady("改送达时间")) {
        this.state.arrivalOverride = `预计 ${this.currentCandidate().deliveryMinutes + 30} 分钟送达（模拟）`;
        this.state.deadline = "本地模拟内容 · 已把送达时间向后顺延";
        this.state.hint = "已延后送达，午餐处理窗口同步保留";
        this.pushConversation(value, "收到，我已经把这份本地候选往后顺延半小时，方便继续演示。");
        this.showToast("已按你的要求调整送达时间");
      }
    } else if (normalized.includes("为什么") || normalized.includes("推荐")) {
      if (this.ensureCandidateReady("解释推荐理由")) {
        this.pushConversation(value, this.currentMeal().explanation);
        this.showToast("已继续解释推荐理由");
      }
    } else {
      this.pushConversation(
        value,
        `我会按“${value}”继续处理这份午餐模拟。你也可以直接点上面的快捷调整，让改动更快落地。`,
      );
      this.showToast("已带着当前事项上下文继续处理");
    }

    if (source === "home" && this.state.libraryStatus === "ready") {
      this.setActiveScreen("detail");
    }

    this.syncUi();
  }

  toggleUtensil(userText = "不要餐具") {
    if (!this.ensureCandidateReady("调整餐具备注")) {
      return;
    }

    this.state.utensil = !this.state.utensil;
    this.state.deadline = "本地模拟内容 · 不保证实时库存 / ETA";
    this.state.hint = this.state.utensil ? "已重新加上餐具备注" : "已帮你去掉餐具";
    this.pushConversation(
      userText,
      this.state.utensil ? "好的，我把餐具需求重新加回去了。" : "已备注无需餐具，这只会保留在当前本地模拟里。",
    );
    this.showToast(this.state.utensil ? "已重新添加餐具" : "已去掉餐具");
    this.syncUi();
  }

  pushConversation(userText, assistantText) {
    this.state.messages.push(
      { role: "user", text: userText },
      { role: "assistant", text: assistantText },
    );
  }

  restoreDeletedCard() {
    this.state.deletedMode = null;
    this.state.glanceSummary = "今天节奏稳定，午间事项还在确认";
    this.state.pendingSummary = "待处理 2｜待确认 1";
    this.state.hint =
      this.state.libraryStatus === "ready" ? "来自本地 seed 库，可随时切换候选" : "正在整理本地 seed 候选";
    this.state.deadline = "本地模拟内容 · 不保证实时库存 / ETA";
    this.state.status = "待处理";
  }

  setActiveScreen(screen) {
    this.state.activeScreen = screen;
    this.stageElements.forEach((stage) => {
      stage.classList.toggle("is-active", stage.dataset.screen === screen);
    });

    const target = this.root.querySelector(`[data-screen="${screen}"]`);
    if (target && window.matchMedia("(max-width: 980px)").matches) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  emptyStateContent() {
    if (this.state.deletedMode === "future") {
      return {
        title: "后续午餐安排已删除",
        copy: "后续重复日程不会再自动出现，你可以随时恢复这份预览继续查看交互。",
        actionLabel: "恢复预览",
      };
    }

    if (this.state.deletedMode === "single") {
      return {
        title: "今天这次午餐已删除",
        copy: "今天这次午餐不会再提醒，你可以恢复预览继续查看这份原型。",
        actionLabel: "恢复预览",
      };
    }

    if (this.state.libraryStatus === "loading") {
      return {
        title: "正在加载本地候选库",
        copy: "午餐预览正在读取 local-seeds/meal/library.json，整理出默认方案和备选。",
        actionLabel: "重新加载候选",
      };
    }

    if (this.state.libraryStatus === "error") {
      return {
        title: "本地候选库暂不可用",
        copy: "当前无法读取 library.json。你可以重新加载候选，或稍后再试。",
        actionLabel: "重新加载候选",
      };
    }

    return {
      title: "当前没有匹配候选",
      copy: "本地 seed 已经加载完成，但按当前预算、标签和地点过滤后没有结果。建议稍后放宽条件。",
      actionLabel: "重新加载候选",
    };
  }

  syncUi() {
    const meal = this.currentMeal();
    const emptyState = this.emptyStateContent();
    const showEmptyState = Boolean(this.state.deletedMode) || this.state.libraryStatus !== "ready";
    const bindings = {
      glanceSummary: this.state.glanceSummary,
      pendingSummary: this.state.pendingSummary,
      statusText: this.statusText(),
      hint: this.state.hint,
      deadline: this.state.deadline,
      mealTitle: meal.title,
      vendor: meal.vendor,
      simulationLabel: meal.simulationLabel,
      freshnessBasis: meal.freshnessBasis,
      utensilLabel: this.state.utensil ? "需要餐具" : "无需餐具",
      profile: meal.profile,
      price: meal.price,
      arrival: meal.arrival,
      confirmLabel: this.primaryActionLabel(),
      emptyTitle: emptyState.title,
      emptyCopy: emptyState.copy,
      emptyActionLabel: emptyState.actionLabel,
    };

    Object.entries(bindings).forEach(([key, value]) => {
      this.root.querySelectorAll(`[data-bind="${key}"]`).forEach((element) => {
        element.textContent = value;
      });
    });

    this.root.querySelectorAll(".status-pill").forEach((element) => {
      element.classList.toggle("is-confirmed", this.state.status === "已完成");
    });

    if (this.focusContentElement && this.focusEmptyElement) {
      this.focusContentElement.hidden = showEmptyState;
      this.focusEmptyElement.hidden = !showEmptyState;
    }

    if (this.deleteSheetElement && this.sheetOverlayElement) {
      this.deleteSheetElement.hidden = !this.state.deleteSheetOpen;
      this.sheetOverlayElement.hidden = !this.state.deleteSheetOpen;
      this.deleteSheetElement.classList.toggle("is-open", this.state.deleteSheetOpen);
      this.sheetOverlayElement.classList.toggle("is-open", this.state.deleteSheetOpen);
    }

    this.root.querySelectorAll('[data-bind="mealVisual"]').forEach((element) => {
      element.dataset.variant = meal.visualVariant;
    });

    if (this.threadElement) {
      const messages = [{ role: "system", text: this.systemPrompt() }, ...this.state.messages];
      this.threadElement.innerHTML = messages.map(bubbleTemplate).join("");
      this.threadElement.scrollTop = this.threadElement.scrollHeight;
    }

    this.setActiveScreen(this.state.activeScreen);
  }

  showToast(text) {
    if (!this.toastElement) {
      return;
    }

    window.clearTimeout(this.toastTimer);
    this.toastElement.hidden = false;
    this.toastElement.textContent = text;
    this.toastElement.classList.add("is-visible");

    this.toastTimer = window.setTimeout(() => {
      this.toastElement.classList.remove("is-visible");
      window.setTimeout(() => {
        this.toastElement.hidden = true;
      }, 180);
    }, 1800);
  }
}

function mountLunchFlowPreview(root) {
  const preview = new LunchFlowPreview(root);
  preview.mount();
  return preview;
}

window.mountLunchFlowPreview = mountLunchFlowPreview;
