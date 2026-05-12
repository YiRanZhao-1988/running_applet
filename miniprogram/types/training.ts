/**
 * 训练首页与周历相关的领域类型（本地 mock / 将来可替换为云端 DTO）。
 */

/** 当日计划训练类型（不含“已完成”——完成态用独立字段表达） */
export type SessionType = "run" | "strength" | "rest" | "long_run" | "interval";

/** 周历单元格渲染所需视图模型 */
export interface WeekCalendarDayVM {
  dateKey: string;
  labelDow: string;
  labelDate: string;
  isToday: boolean;
  /** 展示用状态：已完成优先于具体课型 */
  displayKind: SessionType | "done";
  /** 图标字标（组件内直接展示） */
  glyph: string;
}

/** 今日训练卡片数据源 */
export interface TodaySessionVM {
  typeLabel: string;
  distanceLabel: string;
  paceLabel: string;
  hrTargetLabel: string;
  completed: boolean;
}
