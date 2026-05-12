/**
 * 云数据库集合名（需在云控制台「数据库」中创建同名集合，或首次写入自动建集合）。
 * - users：用户档案与最近登录时间
 * - training_plans：计划快照（与 domain.Plan 同形 JSON）
 * - training_logs：与计划关联的训练日志数组快照
 * - ai_reports：预留 AI 分析报告 / 调用记录（可扩展）
 */
export const CLOUD_COLLECTIONS = {
  users: "users",
  training_plans: "training_plans",
  training_logs: "training_logs",
  ai_reports: "ai_reports",
} as const;

export type CloudCollectionName =
  (typeof CLOUD_COLLECTIONS)[keyof typeof CLOUD_COLLECTIONS];
