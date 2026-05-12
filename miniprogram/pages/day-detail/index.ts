/**
 * 日程详情：单日 todo 列表、完成勾选、本地持久化与训练反馈收集。
 */
import { buildDayDetailPageMock } from "../../mocks/day-detail-page";
import type { TrainingFeedback } from "../../types/day-detail";
import type { DayDetailPageMock } from "../../mocks/day-detail-page";
import {
  loadDayTodosState,
  persistTodoFeedback,
  persistTodoToggle,
} from "../../services/day-detail-storage";
import { createPageOptions } from "../../utils/page-options";

type TodoRow = DayDetailPageMock["todos"][number] & {
  done: boolean;
  feedback?: TrainingFeedback;
  feedbackLabel?: string;
  animating?: boolean;
};

const FEEDBACK_LABEL: Record<TrainingFeedback, string> = {
  easy: "很轻松",
  normal: "正常",
  stressed: "有压力",
  tired: "很疲劳",
};

function mergeTodoRows(meta: DayDetailPageMock): TodoRow[] {
  const stored = loadDayTodosState(meta.dateKey);
  return meta.todos.map((t) => {
    const s = stored[t.id];
    return {
      ...t,
      done: !!s?.done,
      feedback: s?.feedback,
      feedbackLabel: s?.feedback ? FEEDBACK_LABEL[s.feedback] : "",
      animating: false,
    };
  });
}

Page(
  createPageOptions({
    data: {
      dateKey: "",
      pageMeta: null as DayDetailPageMock | null,
      todos: [] as TodoRow[],
      showFeedback: false,
      feedbackTargetId: "",
      feedbackOptions: [
        { key: "easy", label: FEEDBACK_LABEL.easy },
        { key: "normal", label: FEEDBACK_LABEL.normal },
        { key: "stressed", label: FEEDBACK_LABEL.stressed },
        { key: "tired", label: FEEDBACK_LABEL.tired },
      ] as Array<{ key: TrainingFeedback; label: string }>,
    },

    onLoad(query: Record<string, string | undefined>) {
      const raw = query.date ? decodeURIComponent(query.date) : "";
      const meta = raw ? buildDayDetailPageMock(raw) : null;
      if (!meta) {
        this.setData({ dateKey: raw, pageMeta: null, todos: [] });
        wx.setNavigationBarTitle({ title: "日程详情" });
        return;
      }

      this.setData({
        dateKey: raw,
        pageMeta: meta,
        todos: mergeTodoRows(meta),
      });
      wx.setNavigationBarTitle({ title: "训练详情" });
    },

    onShow() {
      const meta = this.data.pageMeta;
      if (!meta) return;
      this.setData({ todos: mergeTodoRows(meta) });
    },

    onTodoToggle(e: { detail?: { id?: string } }) {
      const id = e.detail?.id;
      const meta = this.data.pageMeta;
      if (!id || !meta) return;

      const idx = this.data.todos.findIndex((t) => t.id === id);
      if (idx === -1) return;
      const item = this.data.todos[idx];
      const nextDone = !item.done;

      if (!nextDone) {
        persistTodoToggle({ dateKey: meta.dateKey, itemId: id, done: false });
        const todos = [...this.data.todos];
        todos[idx] = {
          ...item,
          done: false,
          feedback: undefined,
          feedbackLabel: "",
        };
        this.setData({
          todos,
          showFeedback: false,
          feedbackTargetId: "",
        });
        return;
      }

      persistTodoToggle({ dateKey: meta.dateKey, itemId: id, done: true });
      const todos = [...this.data.todos];
      todos[idx] = {
        ...item,
        done: true,
        animating: true,
      };
      this.setData({ todos });

      setTimeout(() => {
        const rows = [...this.data.todos];
        const j = rows.findIndex((t) => t.id === id);
        if (j === -1) return;
        rows[j] = { ...rows[j], animating: false };
        this.setData({ todos: rows });
      }, 460);

      if (!item.feedback) {
        this.setData({ showFeedback: true, feedbackTargetId: id });
      }
    },

    onFeedbackSelect(e: WechatMiniprogram.TouchEvent) {
      const key = e.currentTarget.dataset
        .feedbackKey as TrainingFeedback | undefined;
      const meta = this.data.pageMeta;
      const itemId = this.data.feedbackTargetId;
      if (!key || !meta || !itemId) return;

      persistTodoFeedback({
        dateKey: meta.dateKey,
        itemId,
        feedback: key,
      });

      const todos = this.data.todos.map((t) =>
        t.id === itemId
          ? {
              ...t,
              feedback: key,
              feedbackLabel: FEEDBACK_LABEL[key],
            }
          : t,
      );
      this.setData({
        todos,
        showFeedback: false,
        feedbackTargetId: "",
      });
    },

    onCloseFeedback() {
      this.setData({ showFeedback: false, feedbackTargetId: "" });
    },

    /** 阻止反馈面板内的点击冒泡到遮罩（避免误关）。 */
    onSheetTouch() {},
  }),
);
