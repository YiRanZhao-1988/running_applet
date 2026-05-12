/**
 * 云库文档形态（与领域模型解耦字段名，便于迁移）。
 */
import type { Plan, TrainingLog } from "./domain";

/** users 集合单条文档 */
export interface CloudUserDoc {
  createdAt: number;
  updatedAt: number;
  lastLoginAt: number;
  /** 后续可从 getUserProfile 等写入 */
  nickName?: string;
  avatarUrl?: string;
}

/** training_plans 集合单条文档 */
export interface CloudTrainingPlanDoc {
  planId: string;
  plan: Plan;
  updatedAt: number;
}

/** training_logs 集合单条文档（按 planId 一条，便于整批同步） */
export interface CloudTrainingLogsDoc {
  planId: string;
  logs: TrainingLog[];
  updatedAt: number;
}

/** ai_reports 集合（预留扩展：模型名、版本、原始请求等） */
export interface CloudAiReportDoc {
  createdAt: number;
  summary: string;
  source: "stub" | "model";
  /** 后续 AI 调用可写入 requestId、model、temperature 等 */
  meta?: Record<string, unknown>;
}
