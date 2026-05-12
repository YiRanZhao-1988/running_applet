/**
 * 云 service 统一错误类型（页面禁止直连 DB，错误均由 service 归一）。
 */
export class CloudServiceError extends Error {
  readonly code: string;
  readonly context: string;

  constructor(context: string, message: string, code: string) {
    super(message);
    this.name = "CloudServiceError";
    this.context = context;
    this.code = code;
  }
}

export function normalizeCloudError(
  err: unknown,
  context: string,
): CloudServiceError {
  if (err instanceof CloudServiceError) return err;
  if (err && typeof err === "object") {
    const o = err as Record<string, unknown>;
    const msg =
      (typeof o.errMsg === "string" && o.errMsg) ||
      (typeof o.message === "string" && o.message) ||
      "请求失败";
    const code =
      (typeof o.errCode === "string" && o.errCode) ||
      (typeof o.code === "string" && o.code && o.code) ||
      "UNKNOWN";
    return new CloudServiceError(context, msg, code);
  }
  return new CloudServiceError(context, "未知错误", "UNKNOWN");
}
