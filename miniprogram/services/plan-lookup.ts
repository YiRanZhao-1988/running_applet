/**
 * Plan 内查找（纯函数，便于单测与未来云数据回填后复用）。
 */
import type { Day, Plan, TrainingItem } from "../types/domain";

export function findDayByDateKey(plan: Plan | null, dateKey: string): Day | null {
  if (!plan) return null;
  for (const w of plan.weeks) {
    const d = w.days.find((x) => x.dateKey === dateKey);
    if (d) return d;
  }
  return null;
}

export function findItemInPlan(
  plan: Plan,
  itemId: string,
): { day: Day; item: TrainingItem } | null {
  for (const w of plan.weeks) {
    for (const d of w.days) {
      const it = d.items.find((x) => x.id === itemId);
      if (it) return { day: d, item: it };
    }
  }
  return null;
}
