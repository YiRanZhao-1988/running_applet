import { isCloudEnabled } from "./cloud-init";
import { trainingCloudService } from "./training-cloud-service";
import { trainingStore } from "../../store/training-store";

let pushTimer: ReturnType<typeof setTimeout> | null = null;
const DEBOUNCE_MS = 900;

/**
 * 训练数据变更后的防抖上云（由 TrainingStore.persist 间接触发）。
 */
export function scheduleTrainingCloudPush(): void {
  if (!isCloudEnabled() || !trainingStore.plan) return;
  if (pushTimer) {
    clearTimeout(pushTimer);
    pushTimer = null;
  }
  pushTimer = setTimeout(() => {
    pushTimer = null;
    void executePush();
  }, DEBOUNCE_MS);
}

async function executePush() {
  const plan = trainingStore.plan;
  const logs = trainingStore.logs;
  if (!plan) return;
  trainingStore.setCloudSync("pushing");
  const res = await trainingCloudService.pushFullSnapshot(plan, logs);
  if (!res.ok) {
    trainingStore.setCloudSync("error", res.error.message);
    wx.showToast({ title: "同步失败，已保留本地", icon: "none" });
    return;
  }
  trainingStore.setCloudSync("idle");
}
