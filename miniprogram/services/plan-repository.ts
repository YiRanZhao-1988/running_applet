/**
 * 计划与日志的本地持久化。云端读写请统一使用 `services/cloud/` 下模块，勿在页面直接调用数据库。
 */
import type { Plan, TrainingLog, TrainingPersistedSnapshot } from "../types/domain";

const STORAGE_KEY = "running_training_core_v1";

export function loadPersistedSnapshot(): TrainingPersistedSnapshot | null {
  try {
    const raw = wx.getStorageSync(STORAGE_KEY) as unknown;
    if (!raw || typeof raw !== "object") return null;
    const s = raw as Partial<TrainingPersistedSnapshot>;
    if (!s.plan || !Array.isArray(s.logs)) return null;
    return s as TrainingPersistedSnapshot;
  } catch {
    return null;
  }
}

export function savePersistedSnapshot(plan: Plan, logs: TrainingLog[]): void {
  const payload: TrainingPersistedSnapshot = {
    plan,
    logs,
    savedAt: Date.now(),
  };
  try {
    wx.setStorageSync(STORAGE_KEY, payload);
  } catch {
    wx.showToast({ title: "本地保存失败", icon: "none" });
  }
}
