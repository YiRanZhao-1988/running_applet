/**
 * AI 计划 Tab 展示数据（后续可替换为模型输出）。
 */
export const AI_PLAN_PAGE = {
  title: "计划输入",
  subtitle: "用文字、图片或语音描述目标节奏与健康约束",
  primaryCta: "AI 生成计划",
  entries: [
    {
      id: "ai_analyze",
      title: "AI 分析",
      description: "阅读当前计划结构并给出调整建议（占位）",
    },
    {
      id: "ai_image",
      title: "图片上传",
      description: "选择课表或记录截图以供结构化识别（占位）",
    },
    {
      id: "ai_voice",
      title: "语音输入",
      description: "口述关键变量，例如可训练日与身体感受（占位）",
    },
  ],
} as const;
