/**
 * 今日训练卡片：展示课表关键字段与完成状态（数据由页面传入）。
 */
Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    /** TodaySessionVM */
    session: {
      type: Object,
      value: {},
    },
  },
});
