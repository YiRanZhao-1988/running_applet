/**
 * 页面路径常量：统一出口，避免在代码中散落硬编码路径字符串。
 * 注意：路径须与 app.json 中 pages 注册项一致。
 */

export const ROUTES = {
  training: "/pages/training/index",
  aiPlan: "/pages/ai-plan/index",
  profile: "/pages/profile/index",
  dayDetail: "/pages/day-detail/index",
  login: "/pages/login/index",
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];
