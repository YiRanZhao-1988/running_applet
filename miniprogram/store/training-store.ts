/**
 * 全局训练状态（MobX）：单一数据源驱动多页 UI，本地持久化由 persist() 触发。
 */
import { makeAutoObservable, observable, runInAction } from "mobx-miniprogram";
import type { Plan, TrainingFeedback, TrainingLog } from "../types/domain";
import type { TodaySessionVM } from "../types/training";
import { savePersistedSnapshot } from "../services/plan-repository";
import { findDayByDateKey, findItemInPlan } from "../services/plan-lookup";
import { formatDateKey, formatDateHeaderLine } from "../services/date-utils";
import {
  buildWeekCalendarCells,
  buildWeekRangeLabel,
} from "../services/calendar-cells";
import {
  deriveProfileStatValues,
  deriveTrainingPageStats,
} from "../services/stats-derive";
import { dayPrimaryTypeLabel } from "../mock/seed-plan";
import { TRAINING_PAGE_HERO, TRAINING_PAGE_SECTIONS } from "../mock/training-page-copy";
import { MOTIVATION_LINES } from "../mock/motivation-lines";
import { FEEDBACK_LABELS, FEEDBACK_OPTIONS } from "../mock/feedback-options";
import { AI_PLAN_PAGE } from "../mock/ai-plan-page";
import { PROFILE_PAGE } from "../mock/profile-page";
import { DAY_DETAIL_PAGE_COPY } from "../mock/day-detail-copy";
import { isCloudEnabled } from "../services/cloud/cloud-init";

function newLogId(): string {
  return `log_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export class TrainingStore {
  plan: Plan | null = null;
  logs: TrainingLog[] = [];
  /** 训练周日历相对「本周」的偏移 */
  calendarWeekOffset = 0;
  /** day-detail 当前日期 */
  activeDetailDateKey = "";
  pulseItemId: string | null = null;
  feedbackModalOpen = false;
  feedbackTargetItemId: string | null = null;
  /** 与本地快照 savedAt 对齐，用于与云端 updatedAt 比较 */
  lastLocalPersistedAt = 0;
  /** 云同步 UI：idle | pulling | pushing | error */
  cloudSyncPhase: "idle" | "pulling" | "pushing" | "error" = "idle";
  cloudLastError: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  get trainingHero() {
    return TRAINING_PAGE_HERO;
  }

  get trainingSections() {
    return TRAINING_PAGE_SECTIONS;
  }

  get profileSettingRows() {
    const items = PROFILE_PAGE.settings.items;
    return items.map((row, i) => ({
      ...row,
      isLast: i === items.length - 1,
    }));
  }

  get motivationLines() {
    return MOTIVATION_LINES;
  }

  get aiPlanPage() {
    return AI_PLAN_PAGE;
  }

  get profilePageModel() {
    return PROFILE_PAGE;
  }

  get cloudSyncHintLine() {
    if (!isCloudEnabled()) {
      return "数据仅保存在本机（未配置云环境）";
    }
    switch (this.cloudSyncPhase) {
      case "pulling":
        return "云同步：正在拉取…";
      case "pushing":
        return "云同步：正在上传…";
      case "error":
        return this.cloudLastError
          ? `云同步失败：${this.cloudLastError}`
          : "云同步失败";
      default:
        return "云同步：已就绪";
    }
  }

  get feedbackOptionRows() {
    return FEEDBACK_OPTIONS;
  }

  get weekRangeText() {
    return buildWeekRangeLabel(this.calendarWeekOffset);
  }

  get trainingWeekDays() {
    return buildWeekCalendarCells(this.plan, this.calendarWeekOffset);
  }

  get todaySession(): TodaySessionVM {
    const dk = formatDateKey(new Date());
    const day = findDayByDateKey(this.plan, dk);
    if (!day) {
      return {
        typeLabel: "—",
        distanceLabel: "—",
        paceLabel: "—",
        hrTargetLabel: "—",
        completed: false,
      };
    }
    const primary = day.items[0];
    const typeLabel = dayPrimaryTypeLabel(day.sessionKind);
    const allDone =
      day.sessionKind !== "rest" &&
      day.items.length > 0 &&
      day.items.every((i) => i.completed);
    return {
      typeLabel,
      distanceLabel: primary?.distanceLabel ?? "—",
      paceLabel: primary?.paceLabel ?? "—",
      hrTargetLabel: primary?.hrLabel ?? "—",
      completed: day.sessionKind === "rest" ? true : allDone,
    };
  }

  get trainingStats() {
    return deriveTrainingPageStats(this.plan, this.calendarWeekOffset);
  }

  get profileStatRows() {
    const m = deriveProfileStatValues(this.plan);
    return PROFILE_PAGE.stats.map((s) => ({
      id: s.id,
      label: s.label,
      value: m[s.valueKey],
    }));
  }

  get dayDetailHeaderLine() {
    if (!this.activeDetailDateKey) return "";
    return formatDateHeaderLine(this.activeDetailDateKey);
  }

  get dayDetailTypeLabel() {
    const day = findDayByDateKey(this.plan, this.activeDetailDateKey);
    if (!day) return "";
    return dayPrimaryTypeLabel(day.sessionKind);
  }

  get dayDetailTodos() {
    const day = findDayByDateKey(this.plan, this.activeDetailDateKey);
    if (!day) return [];
    return [...day.items]
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((it) => ({
        ...it,
        done: it.completed,
        feedbackLabel: it.feedback ? FEEDBACK_LABELS[it.feedback] : "",
        animating: this.pulseItemId === it.id,
      }));
  }

  get dayDetailPageCopy() {
    return DAY_DETAIL_PAGE_COPY;
  }

  /** 当前详情页 dateKey 是否能在计划中解析出 Day */
  get dayDetailHasContent() {
    const k = this.activeDetailDateKey;
    if (!k || !/^\d{4}-\d{2}-\d{2}$/.test(k)) return false;
    return !!findDayByDateKey(this.plan, k);
  }

  setCloudSync(
    phase: "idle" | "pulling" | "pushing" | "error",
    message?: string | null,
  ) {
    runInAction(() => {
      this.cloudSyncPhase = phase;
      this.cloudLastError = message ?? null;
    });
  }

  replacePlanAndLogs(nextPlan: Plan, nextLogs: TrainingLog[]) {
    this.plan = observable(nextPlan) as unknown as Plan;
    this.logs = observable(nextLogs) as unknown as TrainingLog[];
  }

  persist() {
    if (this.plan) {
      savePersistedSnapshot(this.plan, this.logs);
      this.lastLocalPersistedAt = Date.now();
      void import("../services/cloud/cloud-sync-push").then((m) =>
        m.scheduleTrainingCloudPush(),
      );
    }
  }

  calendarWeekPrev() {
    this.calendarWeekOffset -= 1;
  }

  calendarWeekNext() {
    this.calendarWeekOffset += 1;
  }

  setActiveDetailDateKey(dateKey: string) {
    this.activeDetailDateKey = dateKey;
  }

  toggleItemById(itemId: string) {
    if (!this.plan) return;
    const loc = findItemInPlan(this.plan, itemId);
    if (!loc) return;
    const { day, item } = loc;
    const next = !item.completed;

    if (!next) {
      item.completed = false;
      delete item.completedAt;
      delete item.feedback;
      this.logs.push({
        id: newLogId(),
        planId: this.plan.id,
        dayId: day.id,
        itemId,
        dateKey: day.dateKey,
        type: "uncomplete",
        recordedAt: Date.now(),
      });
      this.feedbackModalOpen = false;
      this.feedbackTargetItemId = null;
      this.persist();
      return;
    }

    item.completed = true;
    item.completedAt = Date.now();
    this.logs.push({
      id: newLogId(),
      planId: this.plan.id,
      dayId: day.id,
      itemId,
      dateKey: day.dateKey,
      type: "complete",
      recordedAt: Date.now(),
    });
    this.pulseItemId = itemId;
    setTimeout(() => {
      runInAction(() => {
        this.pulseItemId = null;
      });
    }, 460);

    if (!item.feedback) {
      this.feedbackModalOpen = true;
      this.feedbackTargetItemId = itemId;
    }
    this.persist();
  }

  closeFeedbackModal() {
    this.feedbackModalOpen = false;
    this.feedbackTargetItemId = null;
  }

  submitItemFeedback(feedback: TrainingFeedback) {
    if (!this.plan || !this.feedbackTargetItemId) return;
    const loc = findItemInPlan(this.plan, this.feedbackTargetItemId);
    if (!loc) return;
    loc.item.feedback = feedback;
    this.logs.push({
      id: newLogId(),
      planId: this.plan.id,
      dayId: loc.day.id,
      itemId: loc.item.id,
      dateKey: loc.day.dateKey,
      type: "feedback",
      feedback,
      recordedAt: Date.now(),
    });
    this.closeFeedbackModal();
    this.persist();
  }
}

export const trainingStore = new TrainingStore();
