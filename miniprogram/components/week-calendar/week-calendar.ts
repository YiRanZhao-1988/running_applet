/**
 * 周日历：展示当前自然周（周一为首）、左右切换周、点击某日向上抛出事件。
 * 展示数据由页面结合 mock 生成后传入，组件不负责请求。
 */
Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    /** WeekCalendarDayVM[] */
    days: {
      type: Array,
      value: [] as unknown[],
    },
    /** 周范围说明文案 */
    weekRangeText: {
      type: String,
      value: "",
    },
  },
  methods: {
    onPrevWeek() {
      this.triggerEvent("prev");
    },
    onNextWeek() {
      this.triggerEvent("next");
    },
    onDayTap(e: WechatMiniprogram.TouchEvent) {
      const { dateKey } = e.currentTarget.dataset as { dateKey?: string };
      if (!dateKey) return;
      this.triggerEvent("selectday", { dateKey });
    },
  },
});
