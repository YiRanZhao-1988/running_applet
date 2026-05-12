import { runInAction } from "mobx-miniprogram";
import { trainingStore } from "../../store/training-store";
import { savePersistedSnapshot } from "../plan-repository";
import { initCloudIfConfigured, isCloudEnabled } from "./cloud-init";
import { wxLoginAsync, runCloudOp } from "./cloud-runner";
import { userCloudService } from "./user-cloud-service";
import { trainingCloudService } from "./training-cloud-service";

/**
 * 冷启动云同步：wx.login → users 建档 → 按时间戳在本地快照与云端之间择新合并。
 * 不阻塞首屏渲染；错误写入 store.cloudLastError。
 */
export function runCloudBootstrapAsync(): void {
  if (!isCloudEnabled()) return;
  initCloudIfConfigured();
  void runBootstrap();
}

async function runBootstrap() {
  trainingStore.setCloudSync("pulling");

  const loginRes = await runCloudOp("wx.login", () => wxLoginAsync());
  if (!loginRes.ok) {
    trainingStore.setCloudSync("error", loginRes.error.message);
    return;
  }

  const touch = await userCloudService.touchUser();
  if (!touch.ok) {
    trainingStore.setCloudSync("error", touch.error.message);
    return;
  }

  const plan = trainingStore.plan;
  if (!plan) {
    trainingStore.setCloudSync("idle");
    return;
  }

  const remoteR = await trainingCloudService.fetchTrainingBundle(plan.id);
  if (!remoteR.ok) {
    trainingStore.setCloudSync("error", remoteR.error.message);
    return;
  }

  const bundle = remoteR.data;

  if (!bundle) {
    const pushR = await trainingCloudService.pushFullSnapshot(
      plan,
      trainingStore.logs,
    );
    if (!pushR.ok) {
      trainingStore.setCloudSync("error", pushR.error.message);
      return;
    }
    trainingStore.setCloudSync("idle");
    return;
  }

  const remoteTs = bundle.updatedAt;
  const localTs = trainingStore.lastLocalPersistedAt;

  if (remoteTs > localTs) {
    runInAction(() => {
      trainingStore.replacePlanAndLogs(bundle.plan, bundle.logs);
      trainingStore.lastLocalPersistedAt = remoteTs;
    });
    savePersistedSnapshot(bundle.plan, bundle.logs);
    trainingStore.setCloudSync("idle");
    return;
  }

  if (remoteTs < localTs) {
    const pushR = await trainingCloudService.pushFullSnapshot(
      trainingStore.plan!,
      trainingStore.logs,
    );
    if (!pushR.ok) {
      trainingStore.setCloudSync("error", pushR.error.message);
      return;
    }
  }

  trainingStore.setCloudSync("idle");
}
