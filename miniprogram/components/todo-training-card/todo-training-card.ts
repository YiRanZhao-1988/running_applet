/**
 * 单条训练 todo 卡片：展示字段 + 勾选完成（事件上抛给页面持久化）。
 */
import type { DayTodoViewModel } from "../../types/day-detail";

Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    /** DayTodoViewModel + 可选 feedbackLabel 展示文案 */
    todo: {
      type: Object,
      value: {} as DayTodoViewModel & { feedbackLabel?: string },
    },
  },
  methods: {
    onToggleTap() {
      const todo = this.properties.todo as DayTodoViewModel & {
        feedbackLabel?: string;
      };
      if (!todo?.id) return;
      this.triggerEvent("toggle", { id: todo.id });
    },
  },
});
