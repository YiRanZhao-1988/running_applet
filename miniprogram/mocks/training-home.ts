/**
 * 训练首页本地 mock：按日期推导非真实用户数据，仅用于 UI 与交互演示。
 */
import type {
  SessionType,
  TodaySessionVM,
  WeekCalendarDayVM,
} from "../types/training";

const DOW_MON_FIRST = ["一", "二", "三", "四", "五", "六", "日"] as const;

const CYCLE: SessionType[] = [
  "run",
  "strength",
  "rest",
  "interval",
  "run",
  "long_run",
  "strength",
];

function pad2(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

/** YYYY-MM-DD（本地日历日） */
export function formatDateKey(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

/** 以周一为一周起始（与常见训练周期表一致） */
export function getWeekMonday(base: Date, weekOffset: number): Date {
  const sod = startOfDay(base);
  const day = sod.getDay(); // 0 Sun..6 Sat
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const monday = new Date(sod);
  monday.setDate(sod.getDate() + mondayOffset);
  monday.setDate(monday.getDate() + weekOffset * 7);
  return startOfDay(monday);
}

function sessionTypeForDate(d: Date): SessionType {
  const seed =
    d.getFullYear() * 373 + (d.getMonth() + 1) * 53 + d.getDate();
  return CYCLE[((seed % CYCLE.length) + CYCLE.length) % CYCLE.length];
}

function isCompletedForDate(d: Date, today: Date): boolean {
  return startOfDay(d).getTime() < startOfDay(today).getTime();
}

function displayKindFor(
  type: SessionType,
  completed: boolean,
): SessionType | "done" {
  if (completed && type !== "rest") return "done";
  return type;
}

function glyphForKind(k: SessionType | "done"): string {
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

function typeLabelCN(t: SessionType): string {
  switch (t) {
    case "run":
      return "跑步";
    case "strength":
      return "力量";
    case "rest":
      return "休息";
    case "long_run":
      return "长距离";
    case "interval":
      return "间歇";
  }
}
export function buildWeekDays(weekOffset: number): WeekCalendarDayVM[] {
  const today = startOfDay(new Date());
  const monday = getWeekMonday(today, weekOffset);
  const days: WeekCalendarDayVM[] = [];

  for (let i = 0; i < 7; i += 1) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dateKey = formatDateKey(d);
    const type = sessionTypeForDate(d);
    const completed = isCompletedForDate(d, today);
    const isToday = startOfDay(d).getTime() === today.getTime();
    const displayKind = displayKindFor(type, completed);
    days.push({
      dateKey,
      labelDow: DOW_MON_FIRST[i],
      labelDate: `${d.getMonth() + 1}/${d.getDate()}`,
      isToday,
      displayKind,
      glyph: glyphForKind(displayKind),
    });
  }
  return days;
}

/** 周起止文案（Apple-ish 短横分隔） */
export function buildWeekRangeLabel(weekOffset: number): string {
  const today = new Date();
  const monday = getWeekMonday(today, weekOffset);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const short = (x: Date) => `${x.getMonth() + 1}/${x.getDate()}`;
  return `${short(monday)} — ${short(sunday)}`;
}

/** 今日课表卡片（mock） */
export function getTodaySessionMock(): TodaySessionVM {
  const today = startOfDay(new Date());
  const t = sessionTypeForDate(today);
  return {
    typeLabel: typeLabelCN(t),
    distanceLabel: t === "rest" ? "—" : "8.0 km",
    paceLabel: t === "rest" ? "—" : "5:25 /km",
    hrTargetLabel: t === "rest" ? "—" : "Zone 2 · 128–142",
    completed: false,
  };
}

export interface DayDetailMock {
  dateKey: string;
  typeLabel: string;
  displayKind: SessionType | "done";
  brief: string;
}

export function getDayDetailMock(dateKey: string): DayDetailMock {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) {
    return {
      dateKey,
      typeLabel: "未定义",
      displayKind: "rest",
      brief: "日期格式无效。请使用 YYYY-MM-DD（mock 校验）。",
    };
  }

  const [y, m, d] = dateKey.split("-").map((v) => Number(v));
  const safe = new Date(y, (m || 1) - 1, d || 1);
  const type = sessionTypeForDate(safe);
  const today = startOfDay(new Date());
  const completed = isCompletedForDate(safe, today) && type !== "rest";
  const displayKind = displayKindFor(type, completed);

  const brief =
    type === "rest"
      ? "主动恢复：降低负荷，把注意力放在睡眠与营养。"
      : "按课表执行即可，强度放在区间里比追求数字更重要。";

  return {
    dateKey,
    typeLabel: typeLabelCN(type),
    displayKind,
    brief,
  };
}

/** 训练页底部统计（演示数值，本地 mock） */
export function getTrainingStatsMock(): Array<{ label: string; value: string }> {
  return [
    { label: "本周跑量", value: "32 km" },
    { label: "本月累计", value: "118 km" },
    { label: "连续周数", value: "6" },
  ];
}

/** 激励语文案池：长期主义、克制语气（非鸡血） */
export const MOTIVATION_LINES: string[] = [
  "进步来自重复做对的事，而不是一次全力以赴。",
  "把今天跑好，然后把同样的耐心交给明天。",
  "身体需要节奏：训练日认真，休息日也值得认真。",
  "计划的意义，是在波动中仍有一个可执行的下一步。",
  "慢一点没关系，只要方向连续，距离就会累积。",
  "你不是在和别人比，你是在维护与自己的约定。",
  "稳定的周节奏，比偶发的强度更塑造人。",
  "把期望值放低一点，把一致性抬高一点。",
  "训练不是宣言，是一套可以被重复的日常。",
  "休息不是懒惰，是让适应发生的必要部分。",
];
