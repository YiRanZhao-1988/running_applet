/**
 * 云开发初始化：与业务 service 解耦，仅负责 wx.cloud.init。
 */
import { CLOUD_ENV_ID } from "../../config/cloud-env";

let inited = false;

export function initCloudIfConfigured(): boolean {
  if (inited) return true;
  if (!CLOUD_ENV_ID || typeof wx.cloud === "undefined") {
    return false;
  }
  try {
    wx.cloud.init({
      env: CLOUD_ENV_ID,
      traceUser: true,
    });
    inited = true;
    return true;
  } catch {
    return false;
  }
}

export function isCloudEnabled(): boolean {
  return Boolean(CLOUD_ENV_ID) && typeof wx.cloud !== "undefined";
}

export function isCloudInited(): boolean {
  return inited;
}

export function assertCloudDatabase() {
  if (!inited && !initCloudIfConfigured()) {
    throw new Error("云开发未初始化或未配置 CLOUD_ENV_ID");
  }
  return wx.cloud.database();
}
