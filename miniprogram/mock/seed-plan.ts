/**
 * 生成演示用完整 Plan（多周）。仅 mock 层引用；真实环境可由云端下发同构 JSON。
 */
import type { Day, Plan, SessionKind, TrainingItem, Week } from "../types/domain";
import {
  addCalendarDays,
  formatDateKey,
  getMondayOfCalendarWeek,
  startOfDay,
} from "../services/date-utils";

const PLAN_ID = "plan_demo_v1";

const SESSION_CYCLE: SessionKind[] = [
  "run",
  "strength",
  "rest",
  "interval",
  "run",
  "long_run",
  "strength",
];

function sessionKindForDate(d: Date): SessionKind {
  const seed =
    d.getFullYear() * 373 + (d.getMonth() + 1) * 53 + d.getDate();
  return SESSION_CYCLE[((seed % SESSION_CYCLE.length) + SESSION_CYCLE.length) % SESSION_CYCLE.length];
}

export function dayPrimaryTypeLabel(kind: SessionKind): string {
  switch (kind) {
    case "run":
      return "恢复跑";
    case "long_run":
      return "长距离";
    case "interval":
      return "间歇";
    case "strength":
      return "力量";
    case "rest":
      return "休息";
  }
}

function buildItemsForDay(dateKey: string, dayId: string, k: SessionKind): TrainingItem[] {
  const base = dateKey;

  const row = (
    idSuffix: string,
    sortOrder: number,
    name: string,
    distanceLabel: string,
    paceLabel: string,
    hrLabel: string,
    durationLabel: string,
    note: string,
  ): TrainingItem => ({
    id: `${base}__${idSuffix}`,
    dayId,
    name,
    distanceLabel,
    paceLabel,
    hrLabel,
    durationLabel,
    note,
    sortOrder,
    completed: false,
  });

  if (k === "rest") {
    return [
      row("rest", 0, "主动恢复", "—", "—", "—", "20–30 min", "散步、拉伸或轻松骑行；不额外堆加疲劳。"),
    ];
  }
  if (k === "long_run") {
    return [
      row(
        "lg_main",
        0,
        "有氧长距离",
        "16 km",
        "5:40–6:10 /km",
        "Zone 2 · 130–145",
        "约 95 min",
        "保持稳定呼吸；补水少量多次，后段以放松为主。",
      ),
      row("lg_cool", 1, "冷身步行", "—", "—", "—", "8 min", "心率回落后再结束；当日避免久坐不动。"),
    ];
  }
  if (k === "interval") {
    return [
      row(
        "int_warm",
        0,
        "热身慢跑",
        "2.5 km",
        "6:00–6:30 /km",
        "渐进至 Zone 2",
        "15 min",
        "关节与呼吸逐步打开；不要抢节奏。",
      ),
      row(
        "int_main",
        1,
        "间歇主课",
        "6 × 800 m",
        "4:50–5:05 /km",
        "顶到 Zone 4 边缘即可",
        "约 35 min",
        "组间慢跑恢复；以动作质量为先，宁可略保守。",
      ),
      row(
        "int_cool",
        2,
        "放松慢跑",
        "2 km",
        "6:00–6:30 /km",
        "回落至 Zone 1–2",
        "12 min",
        "把强度留在跑道上，离开跑道就进入恢复。",
      ),
    ];
  }
  if (k === "strength") {
    return [
      row(
        "str_main",
        0,
        "下肢与躯干稳定",
        "—",
        "—",
        "—",
        "40 min",
        "单腿、髋稳定与核心；宁可用更稳的幅面完成组数。",
      ),
    ];
  }
  return [
    row(
      "easy_main",
      0,
      "轻松有氧跑",
      "8.0 km",
      "5:25–5:45 /km",
      "Zone 2 · 128–142",
      "约 45 min",
      "全程可对话；身体紧就放慢，不追加距离。",
    ),
    row("easy_drill", 1, "跑姿提醒", "—", "—", "—", "5 min", "轻量摆臂、落地干净；点到为止。"),
  ];
}

/** 从当前自然周向前后各铺 8 周演示数据 */
export function createSeedPlan(): Plan {
  const today = startOfDay(new Date());
  const anchorMonday = getMondayOfCalendarWeek(today);
  const weeks: Week[] = [];

  for (let wi = -8; wi <= 8; wi += 1) {
    const monday = addCalendarDays(anchorMonday, wi * 7);
    const mondayKey = formatDateKey(monday);
    const weekId = `week:${mondayKey}`;
    const days: Day[] = [];

    for (let di = 0; di < 7; di += 1) {
      const d = addCalendarDays(monday, di);
      const dateKey = formatDateKey(d);
      const sessionKind = sessionKindForDate(d);
      const dayId = `day:${dateKey}`;
      const items = buildItemsForDay(dateKey, dayId, sessionKind);
      days.push({
        id: dayId,
        weekId,
        planId: PLAN_ID,
        dateKey,
        sessionKind,
        items,
      });
    }

    weeks.push({
      id: weekId,
      planId: PLAN_ID,
      weekIndex: wi + 8,
      mondayDateKey: mondayKey,
      days,
    });
  }

  return {
    id: PLAN_ID,
    title: "基础周期（演示）",
    createdAt: Date.now(),
    weeks,
  };
}
