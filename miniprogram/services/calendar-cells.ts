/**
 * 训练周日历视图数据：由 Plan + 周偏移推导，不经页面拼数据。
 */
import type { Plan, SessionKind } from "../types/domain";
import type { WeekCalendarDayVM } from "../types/training";
import {
  addCalendarDays,
  formatDateKey,
  getMondayOfCalendarWeek,
  startOfDay,
} from "./date-utils";
import { findDayByDateKey } from "./plan-lookup";

const DOW_MON = ["一", "二", "三", "四", "五", "六", "日"] as const;

function glyphForKind(k: SessionKind | "done"): string {
  switch (k) {
    case "run":
      return "跑";
    case "strength":
      return "力";
    case "rest":
      return "休";
    case "long_run":
      return "远";
    case "interval":
      return "间";
    case "done":
      return "✓";
    default:
      return "·";
  }
}

function displayKindForDay(plan: Plan | null, dateKey: string): SessionKind | "done" {
  const day = findDayByDateKey(plan, dateKey);
  if (!day) return "rest";
  if (day.sessionKind === "rest") return "rest";
  const runnable = day.items;
  if (runnable.length === 0) return "rest";
  const allDone = runnable.every((i) => i.completed);
  if (allDone) return "done";
  return day.sessionKind;
}

export function buildWeekRangeLabel(weekOffset: number): string {
  const today = new Date();
  const monday = addCalendarDays(getMondayOfCalendarWeek(today), weekOffset * 7);
  const sunday = addCalendarDays(monday, 6);
  const short = (x: Date) => `${x.getMonth() + 1}/${x.getDate()}`;
  return `${short(monday)} — ${short(sunday)}`;
}

export function buildWeekCalendarCells(
  plan: Plan | null,
  weekOffset: number,
): WeekCalendarDayVM[] {
  const today = startOfDay(new Date());
  const monday = addCalendarDays(getMondayOfCalendarWeek(today), weekOffset * 7);
  const cells: WeekCalendarDayVM[] = [];
  const todayKey = formatDateKey(today);

  for (let i = 0; i < 7; i += 1) {
    const d = addCalendarDays(monday, i);
    const dateKey = formatDateKey(d);
    const dk = displayKindForDay(plan, dateKey);
    cells.push({
      dateKey,
      labelDow: DOW_MON[i],
      labelDate: `${d.getMonth() + 1}/${d.getDate()}`,
      isToday: dateKey === todayKey,
      displayKind: dk,
      glyph: glyphForKind(dk),
    });
  }
  return cells;
}
