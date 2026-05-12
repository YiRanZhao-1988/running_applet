/**
 * day-detail 完成态与反馈：仅本地缓存，不接入后端。
 */
import type { DayDetailStoreShape, TrainingFeedback } from "../types/day-detail";

const STORAGE_KEY = "running_day_detail_state_v1";

function readRoot(): DayDetailStoreShape {
  try {
    const raw = wx.getStorageSync(STORAGE_KEY) as unknown;
    if (raw && typeof raw === "object" && "byDate" in (raw as object)) {
      return raw as DayDetailStoreShape;
    }
  } catch {
    // 忽略读取异常，回退空结构
  }
  return { byDate: {} };
}

function writeRoot(root: DayDetailStoreShape): void {
  try {
    wx.setStorageSync(STORAGE_KEY, root);
  } catch {
    wx.showToast({ title: "本地保存失败", icon: "none" });
  }
}

export function loadDayTodosState(dateKey: string): Record<
  string,
  { done: boolean; feedback?: TrainingFeedback }
> {
  const root = readRoot();
  return root.byDate[dateKey]?.items ?? {};
}

/** 勾选/取消：取消时移除该条记录 */
export function persistTodoToggle(args: {
  dateKey: string;
  itemId: string;
  done: boolean;
}): void {
  const { dateKey, itemId, done } = args;
  const root = readRoot();
  if (!root.byDate[dateKey]) root.byDate[dateKey] = { items: {} };
  const bucket = root.byDate[dateKey].items;

  if (!done) {
    delete bucket[itemId];
  } else {
    const prev = bucket[itemId];
    bucket[itemId] = { done: true, feedback: prev?.feedback };
  }

  writeRoot(root);
}

export function persistTodoFeedback(args: {
  dateKey: string;
  itemId: string;
  feedback: TrainingFeedback;
}): void {
  const { dateKey, itemId, feedback } = args;
  const root = readRoot();
  if (!root.byDate[dateKey]) root.byDate[dateKey] = { items: {} };
  const bucket = root.byDate[dateKey].items;
  const prev = bucket[itemId];
  bucket[itemId] = {
    ...(prev ?? {}),
    done: true,
    feedback,
  };
  writeRoot(root);
}
