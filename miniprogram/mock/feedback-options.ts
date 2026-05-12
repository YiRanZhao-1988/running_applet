import type { TrainingFeedback } from "../types/domain";

/** 反馈枚举 → 文案映射（供 todo 卡片与弹窗共用） */
export const FEEDBACK_LABELS: Record<TrainingFeedback, string> = {
  easy: "很轻松",
  normal: "正常",
  stressed: "有压力",
  tired: "很疲劳",
};

export const FEEDBACK_OPTIONS: Array<{ key: TrainingFeedback; label: string }> = [
  { key: "easy", label: FEEDBACK_LABELS.easy },
  { key: "normal", label: FEEDBACK_LABELS.normal },
  { key: "stressed", label: FEEDBACK_LABELS.stressed },
  { key: "tired", label: FEEDBACK_LABELS.tired },
];
