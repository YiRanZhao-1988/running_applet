/**
 * day-detail 页面 mock：生成「当天类型 + 多条 todo」模板。
 */
import type { SessionType } from "../types/training";
import type { DayTodoTemplate } from "../types/day-detail";

const DOW_CN_SUN0 = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"] as const;

function pad2(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

const CYCLE: SessionType[] = [
  "run",
  "strength",
  "rest",
  "interval",
  "run",
  "long_run",
  "strength",
];

function sessionTypeForDate(d: Date): SessionType {
  const seed =
    d.getFullYear() * 373 + (d.getMonth() + 1) * 53 + d.getDate();
  return CYCLE[((seed % CYCLE.length) + CYCLE.length) % CYCLE.length];
}

/** 顶部展示：2026.05.12 周二 */
export function formatDateHeaderLine(dateKey: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) return dateKey;
  const [y, m, d] = dateKey.split("-").map((v) => Number(v));
  const dt = new Date(y, (m || 1) - 1, d || 1);
  const w = DOW_CN_SUN0[dt.getDay()];
  return `${y}.${pad2(m || 1)}.${pad2(d || 1)} ${w}`;
}

/** 当日训练类型主标签（克制命名，贴合跑步周期常见分类） */
export function dayPrimaryTypeLabel(t: SessionType): string {
  switch (t) {
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

function buildTodoTemplates(dateKey: string, t: SessionType): DayTodoTemplate[] {
  const base = `${dateKey}`;

  if (t === "rest") {
    return [
      {
        id: `${base}__rest`,
        name: "主动恢复",
        distanceLabel: "—",
        paceLabel: "—",
        hrLabel: "—",
        durationLabel: "20–30 min",
        note: "散步、拉伸或轻松骑行；不额外堆加疲劳。",
      },
    ];
  }

  if (t === "long_run") {
    return [
      {
        id: `${base}__lg_main`,
        name: "有氧长距离",
        distanceLabel: "16 km",
        paceLabel: "5:40–6:10 /km",
        hrLabel: "Zone 2 · 130–145",
        durationLabel: "约 95 min",
        note: "保持稳定呼吸；补水少量多次，后段以放松为主。",
      },
      {
        id: `${base}__lg_cool`,
        name: "冷身步行",
        distanceLabel: "—",
        paceLabel: "—",
        hrLabel: "—",
        durationLabel: "8 min",
        note: "心率回落后再结束；当日避免久坐不动。",
      },
    ];
  }

  if (t === "interval") {
    return [
      {
        id: `${base}__int_warm`,
        name: "热身慢跑",
        distanceLabel: "2.5 km",
        paceLabel: "6:00–6:30 /km",
        hrLabel: "渐进至 Zone 2",
        durationLabel: "15 min",
        note: "关节与呼吸逐步打开；不要抢节奏。",
      },
      {
        id: `${base}__int_main`,
        name: "间歇主课",
        distanceLabel: "6 × 800 m",
        paceLabel: "4:50–5:05 /km",
        hrLabel: "顶到 Zone 4 边缘即可",
        durationLabel: "约 35 min",
        note: "组间慢跑恢复；以动作质量为先，宁可略保守。",
      },
      {
        id: `${base}__int_cool`,
        name: "放松慢跑",
        distanceLabel: "2 km",
        paceLabel: "6:00–6:30 /km",
        hrLabel: "回落至 Zone 1–2",
        durationLabel: "12 min",
        note: "把强度留在跑道上，离开跑道就进入恢复。",
      },
    ];
  }

  if (t === "strength") {
    return [
      {
        id: `${base}__str_main`,
        name: "下肢与躯干稳定",
        distanceLabel: "—",
        paceLabel: "—",
        hrLabel: "—",
        durationLabel: "40 min",
        note: "单腿、髋稳定与核心；宁可用更稳的幅面完成组数。",
      },
    ];
  }

  /** 默认恢复跑课（easy aerobic） */
  return [
    {
      id: `${base}__easy_main`,
      name: "轻松有氧跑",
      distanceLabel: "8.0 km",
      paceLabel: "5:25–5:45 /km",
      hrLabel: "Zone 2 · 128–142",
      durationLabel: "约 45 min",
      note: "全程可对话；身体紧就放慢，不追加距离。",
    },
    {
      id: `${base}__easy_drill`,
      name: "跑姿提醒",
      distanceLabel: "—",
      paceLabel: "—",
      hrLabel: "—",
      durationLabel: "5 min",
      note: "轻量摆臂、落地干净；点到为止。",
    },
  ];
}

export interface DayDetailPageMock {
  dateKey: string;
  dateHeader: string;
  dayTypeLabel: string;
  sessionType: SessionType;
  todos: DayTodoTemplate[];
}

export function buildDayDetailPageMock(dateKey: string): DayDetailPageMock | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) return null;

  const [y, m, d] = dateKey.split("-").map((v) => Number(v));
  const safe = new Date(y, (m || 1) - 1, d || 1);
  const t = sessionTypeForDate(safe);

  return {
    dateKey,
    dateHeader: formatDateHeaderLine(dateKey),
    dayTypeLabel: dayPrimaryTypeLabel(t),
    sessionType: t,
    todos: buildTodoTemplates(dateKey, t),
  };
}
