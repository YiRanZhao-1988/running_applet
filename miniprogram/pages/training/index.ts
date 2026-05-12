/**
 * 训练首页：数据与交互全部由 trainingStore 驱动。
 */
import { createStoreBindings } from "mobx-miniprogram-bindings";
import { ROUTES } from "../../constants/routes";
import { trainingStore } from "../../store";

type Bindings = ReturnType<typeof createStoreBindings>;

Page({
  storeBindings: null as unknown as Bindings,

  onLoad() {
    this.storeBindings = createStoreBindings(this, {
      store: trainingStore,
      fields: {
        weekDays: "trainingWeekDays",
        weekRangeText: "weekRangeText",
        todaySession: "todaySession",
        motivationLines: "motivationLines",
        stats: "trainingStats",
        trainingHero: "trainingHero",
        trainingSections: "trainingSections",
      },
      actions: ["calendarWeekPrev", "calendarWeekNext"],
    });
  },

  onUnload() {
    this.storeBindings.destroyStoreBindings();
  },

  onSelectDay(e: { detail?: { dateKey?: string } }) {
    const dateKey = e.detail?.dateKey;
    if (!dateKey) return;
    wx.navigateTo({
      url: `${ROUTES.dayDetail}?date=${encodeURIComponent(dateKey)}`,
    });
  },
});
