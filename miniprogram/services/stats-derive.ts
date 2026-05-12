/**
 * 从 Plan 派生简单统计（演示用）；复杂指标后续可接云端聚合。
 */
import type { Plan } from "../types/domain";
import {
  addCalendarDays,
  formatDateKey,
  getMondayOfCalendarWeek,
  startOfDay,
} from "./date-utils";
import { findDayByDateKey } from "./plan-lookup";

function parseKm(label: string): number {
  const m = label.match(/(\d+(?:\.\d+)?)\s*km/i);
  return m ? Number(m[1]) : 0;
}

export function deriveTrainingPageStats(
  plan: Plan | null,
  calendarWeekOffset: number,
): Array<{ label: string; value: string }> {
  if (!plan) {
    return [
      { label: "本周跑量", value: "—" },
      { label: "本周训练", value: "—" },
      { label: "计划完成率", value: "—" },
    ];
  }

  const today = startOfDay(new Date());
  const monday = addCalendarDays(
    getMondayOfCalendarWeek(today),
    calendarWeekOffset * 7,
  );

  let weekKm = 0;
  let weekDone = 0;
  let weekTotal = 0;
  let planDone = 0;
  let planTotal = 0;

  for (let i = 0; i < 7; i += 1) {
    const dk = formatDateKey(addCalendarDays(monday, i));
    const day = findDayByDateKey(plan, dk);
    if (!day || day.sessionKind === "rest") continue;
    for (const it of day.items) {
      weekTotal += 1;
      if (it.completed) {
        weekDone += 1;
        weekKm += parseKm(it.distanceLabel);
      }
    }
  }

  for (const w of plan.weeks) {
    for (const day of w.days) {
      if (day.sessionKind === "rest") continue;
      for (const it of day.items) {
        planTotal += 1;
        if (it.completed) planDone += 1;
      }
    }
  }

  const rate =
    planTotal > 0 ? `${Math.round((planDone / planTotal) * 100)}%` : "—";

  return [
    { label: "本周跑量", value: `${Math.round(weekKm * 10) / 10} km` },
    { label: "本周训练", value: `${weekDone}/${weekTotal}` },
    { label: "计划完成率", value: rate },
  ];
}

export function deriveProfileStatValues(plan: Plan | null): {
  totalKm: string;
  completionRate: string;
} {
  if (!plan) return { totalKm: "—", completionRate: "—" };

  let km = 0;
  let done = 0;
  let total = 0;

  for (const w of plan.weeks) {
    for (const day of w.days) {
      if (day.sessionKind === "rest") continue;
      for (const it of day.items) {
        total += 1;
        if (it.completed) {
          done += 1;
          km += parseKm(it.distanceLabel);
        }
      }
    }
  }

  return {
    totalKm: `${Math.round(km * 10) / 10} km`,
    completionRate: total > 0 ? `${Math.round((done / total) * 100)}%` : "—",
  };
}
