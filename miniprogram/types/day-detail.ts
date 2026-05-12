/**
 * 日程详情页：单日多条训练 Todo、完成态与主观反馈（本地缓存）。
 */

/** 训练反馈选项（存储为枚举值，展示文案在页面层映射） */
export type TrainingFeedback = "easy" | "normal" | "stressed" | "tired";

/** 服务端 / mock 下发的 todo 模板（不含运行时完成态） */
export interface DayTodoTemplate {
  id: string;
  name: string;
  distanceLabel: string;
  paceLabel: string;
  hrLabel: string;
  durationLabel: string;
  note: string;
}

/** 页面实际渲染的单条 todo（合并缓存后） */
export interface DayTodoViewModel extends DayTodoTemplate {
  done: boolean;
  feedback?: TrainingFeedback;
  /** 短时完成动效类名切换用 */
  animating?: boolean;
}

export interface DayDetailStoreShape {
  /** dateKey -> itemId -> 状态 */
  byDate: Record<
    string,
    {
      items: Record<
        string,
        {
          done: boolean;
          feedback?: TrainingFeedback;
        }
      >;
    }
  >;
}
