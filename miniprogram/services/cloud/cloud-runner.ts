import { normalizeCloudError, type CloudServiceError } from "./cloud-error";

export type CloudResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: CloudServiceError };

/**
 * 统一云操作：包装 try/catch、可选 Loading；禁止页面直接绕过此层调用数据库。
 */
export async function runCloudOp<T>(  
  context: string,
  operation: () => Promise<T>,
  options?: { loading?: boolean; loadingTitle?: string },
): Promise<CloudResult<T>> {
  if (options?.loading) {
    wx.showLoading({
      title: options.loadingTitle ?? "加载中",
      mask: true,
    });
  }
  try {
    const data = await operation();
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: normalizeCloudError(err, context) };
  } finally {
    if (options?.loading) {
      wx.hideLoading();
    }
  }
}

export function wxLoginAsync(): Promise<WechatMiniprogram.LoginSuccessCallbackResult> {
  return new Promise((resolve, reject) => {
    wx.login({ success: resolve, fail: reject });
  });
}
