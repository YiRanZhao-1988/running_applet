/**
 * 长期训练系统核心领域模型。
 * 与 UI 无关；页面视图由 store 基于本结构派生，便于日后无缝替换为云库 DTO。
 */

/** 单日课表主题（与周期类型一致） */
export type SessionKind =
  | "run"
  | "strength"
  | "rest"
  | "long_run"
  | "interval";

/** 单次训练反馈（主观 RPE 风格） */
export type TrainingFeedback = "easy" | "normal" | "stressed" | "tired";

/** 一条可执行训练（当日 todo） */
export interface TrainingItem {
  id: string;
  dayId: string;
  /** 展示名称 */
  name: string;
  distanceLabel: string;
  paceLabel: string;
  hrLabel: string;
  durationLabel: string;
  note: string;
  /** 同一日内排序（升序） */
  sortOrder: number;
  completed: boolean;
  completedAt?: number;
  feedback?: TrainingFeedback;
}

/** 自然日（yyyy-MM-dd） */
export interface Day {
  id: string;
  weekId: string;
  planId: string;
  /** YYYY-MM-DD */
  dateKey: string;
  sessionKind: SessionKind;
  items: TrainingItem[];
}

/** 以周一为首的训练周 */
export interface Week {
  id: string;
  planId: string;
  /** 在周序列中的序号（仅用于排序/展示） */
  weekIndex: number;
  /** 本周周一 dateKey */
  mondayDateKey: string;
  days: Day[];
}

/** 长期训练计划（可含多周） */
export interface Plan {
  id: string;
  title: string;
  createdAt: number;
  weeks: Week[];
}

/** 训练行为日志（本地/未来云端可统一追加） */
export interface TrainingLog {
  id: string;
  planId: string;
  dayId: string;
  itemId: string;
  dateKey: string;
  type: "complete" | "uncomplete" | "feedback";
  feedback?: TrainingFeedback;
  recordedAt: number;
}

/** 本地持久化快照（后续云同步可映射为同一结构上传） */
export interface TrainingPersistedSnapshot {
  plan: Plan;
  logs: TrainingLog[];
  savedAt: number;
}
