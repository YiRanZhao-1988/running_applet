/**
 * 登录页：品牌文案与克制型长期主义短句（仅 copy，无业务逻辑）。
 */

export const LOGIN_PAGE_BRAND = {
  /** 两行字标，可作 Logo 区主视觉 */
  wordmarkLine1: "长期",
  wordmarkLine2: "训练",
  slogan: "日复一日，自有节奏",
} as const;

/** 底部轮播短句；语调安静、自律，避免鸡血与口号感 */
export const LOGIN_MOTIVATION_LINES: readonly string[] = [
  "不必快，只要不停。",
  "节奏比强度诚实。",
  "今天的一小步，是明年的习惯。",
  "沉默的里程，自有回声。",
  "把一件事，放进日常里。",
  "身体记得你每一次的坚持。",
];

/** 背景意境标签（仅供无障碍或调试，当前未绑定 UI） */
export const LOGIN_SCENE_IDS = ["dawn", "night", "road"] as const;
