/**
 * 全局 MobX Store 入口：统一导出与本地初始化（后续可在此处挂接云同步）。
 */
import { runInAction } from "mobx-miniprogram";
import { createSeedPlan } from "../mock/seed-plan";
import {
  loadPersistedSnapshot,
  savePersistedSnapshot,
} from "../services/plan-repository";
import { trainingStore } from "./training-store";

export { trainingStore } from "./training-store";

/** 冷启动：优先恢复本地快照，否则写入 seed 计划。 */
export function initTrainingStore(): void {
  const snap = loadPersistedSnapshot();
  if (snap?.plan) {
    runInAction(() => {
      trainingStore.replacePlanAndLogs(snap.plan, snap.logs ?? []);
      trainingStore.lastLocalPersistedAt = snap.savedAt ?? 0;
    });
    return;
  }
  const seed = createSeedPlan();
  runInAction(() => {
    trainingStore.replacePlanAndLogs(seed, []);
    trainingStore.lastLocalPersistedAt = Date.now();
  });
  savePersistedSnapshot(seed, []);
}
