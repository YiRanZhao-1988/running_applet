/**
 * 日程详情：展示与持久化均走 trainingStore（MobX + plan-repository）。
 */
import { createStoreBindings } from "mobx-miniprogram-bindings";
import type { TrainingFeedback } from "../../types/domain";
import { trainingStore } from "../../store";

type Bindings = ReturnType<typeof createStoreBindings>;

function isValidDateKey(raw: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(raw);
}

Page({
  storeBindings: null as unknown as Bindings,

  onLoad(query: Record<string, string | undefined>) {
    const raw = query.date ? decodeURIComponent(query.date) : "";
    if (isValidDateKey(raw)) {
      trainingStore.setActiveDetailDateKey(raw);
      wx.setNavigationBarTitle({ title: "训练详情" });
    } else {
      trainingStore.setActiveDetailDateKey("");
      wx.setNavigationBarTitle({ title: "日程详情" });
    }

    this.storeBindings = createStoreBindings(this, {
      store: trainingStore,
      fields: {
        dateHeaderLine: "dayDetailHeaderLine",
        dayTypeLabel: "dayDetailTypeLabel",
        todos: "dayDetailTodos",
        showFeedback: "feedbackModalOpen",
        feedbackOptions: "feedbackOptionRows",
        hasContent: "dayDetailHasContent",
        detailCopy: "dayDetailPageCopy",
      },
      actions: ["closeFeedbackModal"],
    });
  },

  onUnload() {
    this.storeBindings.destroyStoreBindings();
  },

  onTodoToggle(e: { detail?: { id?: string } }) {
    const id = e.detail?.id;
    if (id) trainingStore.toggleItemById(id);
  },

  onFeedbackSelect(e: WechatMiniprogram.TouchEvent) {
    const key = e.currentTarget.dataset
      .feedbackKey as TrainingFeedback | undefined;
    if (!key) return;
    trainingStore.submitItemFeedback(key);
  },

  onSheetTouch() {},
});
