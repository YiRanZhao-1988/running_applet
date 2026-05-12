/**
 * 日程详情组件用视图类型（与 store 派生的 todo 行对齐）。
 */
export type { TrainingFeedback } from "./domain";

export interface DayTodoViewModel {
  id: string;
  name: string;
  distanceLabel: string;
  paceLabel: string;
  hrLabel: string;
  durationLabel: string;
  note: string;
  done: boolean;
  feedback?: import("./domain").TrainingFeedback;
  feedbackLabel?: string;
  animating?: boolean;
}
