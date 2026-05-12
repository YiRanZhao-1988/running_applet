import { CLOUD_COLLECTIONS } from "../../constants/cloud-collections";
import type { Plan, TrainingLog } from "../../types/domain";
import type {
  CloudTrainingLogsDoc,
  CloudTrainingPlanDoc,
} from "../../types/cloud-db";
import { assertCloudDatabase, isCloudEnabled } from "./cloud-init";
import { runCloudOp, type CloudResult } from "./cloud-runner";
import { CloudServiceError } from "./cloud-error";

function clonePlain<T>(v: T): T {
  return JSON.parse(JSON.stringify(v)) as T;
}

export type TrainingBundle = {
  plan: Plan;
  logs: TrainingLog[];
  /** 两张表 updatedAt 的较大值，用于与本地 savedAt 比较 */
  updatedAt: number;
};

async function upsertPlanAndLogs(plan: Plan, logs: TrainingLog[]): Promise<void> {
  const db = assertCloudDatabase();
  const now = Date.now();
  const planPlain = clonePlain(plan);
  const logsPlain = clonePlain(logs);

  const pCol = db.collection(CLOUD_COLLECTIONS.training_plans);
  const pRes = await pCol.where({ planId: plan.id }).limit(1).get();
  if (pRes.data.length) {
    await pCol.doc(pRes.data[0]._id as string).update({
      data: { plan: planPlain, updatedAt: now },
    });
  } else {
    await pCol.add({
      data: {
        planId: plan.id,
        plan: planPlain,
        updatedAt: now,
      } satisfies CloudTrainingPlanDoc,
    });
  }

  const lCol = db.collection(CLOUD_COLLECTIONS.training_logs);
  const lRes = await lCol.where({ planId: plan.id }).limit(1).get();
  if (lRes.data.length) {
    await lCol.doc(lRes.data[0]._id as string).update({
      data: { logs: logsPlain, updatedAt: now },
    });
  } else {
    await lCol.add({
      data: {
        planId: plan.id,
        logs: logsPlain,
        updatedAt: now,
      } satisfies CloudTrainingLogsDoc,
    });
  }
}

async function fetchBundle(planId: string): Promise<TrainingBundle | null> {
  const db = assertCloudDatabase();
  const pCol = db.collection(CLOUD_COLLECTIONS.training_plans);
  const lCol = db.collection(CLOUD_COLLECTIONS.training_logs);
  const [pRes, lRes] = await Promise.all([
    pCol.where({ planId }).limit(1).get(),
    lCol.where({ planId }).limit(1).get(),
  ]);
  if (!pRes.data.length) {
    return null;
  }
  const pDoc = pRes.data[0] as CloudTrainingPlanDoc & { _id: string };
  const lRow = lRes.data[0] as (CloudTrainingLogsDoc & { _id: string }) | undefined;
  const plan = pDoc.plan;
  const logs = lRow?.logs ?? [];
  const updatedAt = Math.max(pDoc.updatedAt ?? 0, lRow?.updatedAt ?? 0);
  return { plan, logs, updatedAt };
}

export const trainingCloudService = {
  isEnabled: isCloudEnabled,

  /**
   * 将当前计划与日志完整推送到云（完成勾选、反馈等均体现在 plan + logs 快照中）。
   */
  async pushFullSnapshot(
    plan: Plan,
    logs: TrainingLog[],
    options?: { loading?: boolean; loadingTitle?: string },
  ): Promise<CloudResult<void>> {
    if (!isCloudEnabled()) {
      return {
        ok: false,
        error: new CloudServiceError(
          "training.pushFullSnapshot",
          "未配置云环境",
          "CLOUD_OFF",
        ),
      };
    }
    return runCloudOp(
      "training.pushFullSnapshot",
      () => upsertPlanAndLogs(plan, logs),
      {
        loading: options?.loading,
        loadingTitle: options?.loadingTitle ?? "同步训练数据…",
      },
    );
  },

  /** 拉取与 planId 对应的云端计划 + 日志快照；无记录则返回 null */
  async fetchTrainingBundle(
    planId: string,
    options?: { loading?: boolean; loadingTitle?: string },
  ): Promise<CloudResult<TrainingBundle | null>> {
    if (!isCloudEnabled()) {
      return {
        ok: false,
        error: new CloudServiceError(
          "training.fetchTrainingBundle",
          "未配置云环境",
          "CLOUD_OFF",
        ),
      };
    }
    return runCloudOp(
      "training.fetchTrainingBundle",
      () => fetchBundle(planId),
      options?.loading
        ? {
            loading: true,
            loadingTitle: options.loadingTitle ?? "拉取云端数据…",
          }
        : undefined,
    );
  },
};
