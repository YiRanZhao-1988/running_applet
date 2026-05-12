import { CLOUD_COLLECTIONS } from "../../constants/cloud-collections";
import type { CloudUserDoc } from "../../types/cloud-db";
import {
  assertCloudDatabase,
  initCloudIfConfigured,
  isCloudEnabled,
} from "./cloud-init";
import { runCloudOp, type CloudResult } from "./cloud-runner";
import { CloudServiceError } from "./cloud-error";

async function touchUserDocument(): Promise<void> {
  const db = assertCloudDatabase();
  const col = db.collection(CLOUD_COLLECTIONS.users);
  const now = Date.now();
  const res = await col.limit(1).get();
  if (!res.data.length) {
    const doc: CloudUserDoc = {
      createdAt: now,
      updatedAt: now,
      lastLoginAt: now,
    };
    await col.add({ data: doc });
    return;
  }
  const id = res.data[0]._id as string;
  await col.doc(id).update({
    data: {
      lastLoginAt: now,
      updatedAt: now,
    },
  });
}

export const userCloudService = {
  /**
   * 登录/冷启动时写入或更新 users 文档（依赖小程序端云权限：仅创建者可读写）。
   */
  async touchUser(options?: {
    loading?: boolean;
    loadingTitle?: string;
  }): Promise<CloudResult<void>> {
    if (!isCloudEnabled()) {
      return {
        ok: false,
        error: new CloudServiceError(
          "user.touchUser",
          "未配置云环境",
          "CLOUD_OFF",
        ),
      };
    }
    initCloudIfConfigured();
    return runCloudOp("user.touchUser", () => touchUserDocument(), {
      loading: options?.loading,
      loadingTitle: options?.loadingTitle ?? "同步账号…",
    });
  },
};
