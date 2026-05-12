import { CLOUD_COLLECTIONS } from "../../constants/cloud-collections";
import type { CloudAiReportDoc } from "../../types/cloud-db";
import { assertCloudDatabase, isCloudEnabled } from "./cloud-init";
import { runCloudOp, type CloudResult } from "./cloud-runner";
import { CloudServiceError } from "./cloud-error";

/**
 * AI 分析报告写入（预留）：后续接云函数 + 模型时在此扩展参数与幂等策略。
 */
export const aiReportCloudService = {
  async appendStubReport(
    summary: string,
    options?: { loading?: boolean; meta?: Record<string, unknown> },
  ): Promise<CloudResult<string>> {
    if (!isCloudEnabled()) {
      return {
        ok: false,
        error: new CloudServiceError(
          "aiReport.appendStubReport",
          "未配置云环境",
          "CLOUD_OFF",
        ),
      };
    }
    return runCloudOp(
      "aiReport.appendStubReport",
      async () => {
        const db = assertCloudDatabase();
        const doc: CloudAiReportDoc = {
          createdAt: Date.now(),
          summary,
          source: "stub",
          meta: options?.meta ?? { note: "placeholder_for_model_call" },
        };
        const res = await db.collection(CLOUD_COLLECTIONS.ai_reports).add({
          data: doc,
        });
        return res._id as string;
      },
      options?.loading ? { loading: true, loadingTitle: "写入报告…" } : undefined,
    );
  },
};
