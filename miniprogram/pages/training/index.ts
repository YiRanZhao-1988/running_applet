/**
 * 训练首页：周历切换、今日课表、激励语轮播、底部统计（全部本地 mock）。
 */
import {
  buildWeekDays,
  buildWeekRangeLabel,
  getTodaySessionMock,
  getTrainingStatsMock,
  MOTIVATION_LINES,
} from "../../mocks/training-home";
import type { TodaySessionVM } from "../../types/training";
import { ROUTES } from "../../constants/routes";
import { createPageOptions } from "../../utils/page-options";

type StatChip = { label: string; value: string };

Page(
  createPageOptions({
    data: {
      weekOffset: 0,
      weekDays: buildWeekDays(0),
      weekRangeText: buildWeekRangeLabel(0),
      todaySession: getTodaySessionMock(),
      motivationLines: MOTIVATION_LINES,
      stats: getTrainingStatsMock() as StatChip[],
    },

    onShow() {
      /** 回到前台时刷新「今日课表」，避免跨日仍在小程序中停留时的 stale UI（仍为 mock）。 */
      this.setData({ todaySession: getTodaySessionMock() });
    },

    onWeekPrev() {
      const weekOffset = this.data.weekOffset - 1;
      this.setData({
        weekOffset,
        weekDays: buildWeekDays(weekOffset),
        weekRangeText: buildWeekRangeLabel(weekOffset),
      });
    },

    onWeekNext() {
      const weekOffset = this.data.weekOffset + 1;
      this.setData({
        weekOffset,
        weekDays: buildWeekDays(weekOffset),
        weekRangeText: buildWeekRangeLabel(weekOffset),
      });
    },

    onSelectDay(e: { detail?: { dateKey?: string } }) {
      const dateKey = e.detail?.dateKey;
      if (!dateKey) return;
      wx.navigateTo({
        url: `${ROUTES.dayDetail}?date=${encodeURIComponent(dateKey)}`,
      });
    },
  }),
);
