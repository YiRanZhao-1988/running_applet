/**
 * 纯日期与 dateKey 工具：无业务状态，可供 mock / store / 未来云服务复用。
 */

const DOW_CN_SUN0 = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"] as const;

export function pad2(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

export function formatDateKey(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

export function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

/** 日历周以周一为首 */
export function getMondayOfCalendarWeek(base: Date): Date {
  const sod = startOfDay(base);
  const day = sod.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const monday = new Date(sod);
  monday.setDate(sod.getDate() + mondayOffset);
  return startOfDay(monday);
}

export function addCalendarDays(d: Date, delta: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + delta);
  return startOfDay(x);
}

export function formatDateHeaderLine(dateKey: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) return dateKey;
  const [y, m, d] = dateKey.split("-").map((v) => Number(v));
  const dt = new Date(y, (m || 1) - 1, d || 1);
  const w = DOW_CN_SUN0[dt.getDay()];
  return `${y}.${pad2(m || 1)}.${pad2(d || 1)} ${w}`;
}

export function parseDateKeyToLocal(dateKey: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) return null;
  const [y, m, d] = dateKey.split("-").map((v) => Number(v));
  return new Date(y, (m || 1) - 1, d || 1);
}
