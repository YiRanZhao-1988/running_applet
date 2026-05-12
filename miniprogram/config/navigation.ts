/**
 * 导航栏与页面标题相关的集中配置（仅结构占位）。
 * 说明：小程序页面标题主要在各自 index.json 的 navigationBarTitleText 中设置；
 * 此处预留在运行时通过 setNavigationBarTitle 等 API 扩展时的类型出口。
 */

/** 预留：页面 key，后续可与路由常量对齐。 */
export type AppPageKey =
  | "training"
  | "aiPlan"
  | "profile"
  | "dayDetail"
  | "login";

/**
 * 预留：若后续引入 MobX 或运行时标题切换，可在此导出标题解析函数（当前不实现）。
 */
export type NavigationTitleResolver = (key: AppPageKey) => string;
