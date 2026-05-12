/**
 * AI 计划 Tab：结构与文案 mock（演示输出；不接真实模型）。
 * 页面负责编排；具体区块由各 `ai-*` 组件展示。
 */

export type AiUploadSourceHint = {
  id: string;
  label: string;
};

export type AiWeekPlanDayRow = {
  id: string;
  weekday: string;
  /** 短标签，如「轻松」「间歇」 */
  focus: string;
  detail: string;
  /** 展示用 */
  loadTag: string;
  /** 样式用：low | mid | high */
  loadKey: "low" | "mid" | "high";
};

export type AiAnalysisHighlight = {
  id: string;
  text: string;
};

export type AiAnalysisMetric = {
  id: string;
  label: string;
  value: string;
};

export const AI_PLAN_PAGE = {
  title: "训练参谋",
  subtitle:
    "汇总本周截图与口述要点，输出负荷判断与下周可执行草案。（当前为本地演示）",
  demoNotice: "演示数据 · 未连接 AI",

  upload: {
    sectionTitle: "上传训练截图",
    hint: "支持运动手表或训练 App 的完成页截图，便于对齐距离、心率与配速区间。",
    sources: [
      { id: "garmin", label: "Garmin 截图" },
      { id: "apple_watch", label: "Apple Watch 截图" },
      { id: "keep", label: "Keep 训练截图" },
    ] satisfies AiUploadSourceHint[],
    chooseLabel: "选择图片",
  },

  voice: {
    sectionTitle: "语音补充",
    hint: "简要说明体感、睡眠或酸痛部位，纳入下周强度与休整日安排。",
    holdLabel: "按住说说（演示）",
    holdingLabel: "录入中…",
    doneHint: "已写入占位描述",
  },

  analysis: {
    sectionTitle: "分析摘要",
    contextLine: "基于示例跑量与心率分布（mock）",
    highlights: [
      {
        id: "h1",
        text: "本周有氧占比偏高，强度课刺激偏少，适合在下周安排一节阈值维持。",
      },
      {
        id: "h2",
        text: "连续三天主观疲劳登记偏低，恢复窗口充足，可小幅上调周二跑量。",
      },
      {
        id: "h3",
        text: "周末长距离心率漂移不明显，有氧效率稳定。",
      },
    ] satisfies AiAnalysisHighlight[],
    metrics: [
      { id: "m1", label: "估算周跑量", value: "≈ 42 km" },
      { id: "m2", label: "强度课次数", value: "1 次" },
      { id: "m3", label: "主观疲劳均值", value: "4.2 / 10" },
      { id: "m4", label: "建议负荷带", value: "维持 · 微增量" },
    ] satisfies AiAnalysisMetric[],
    caution:
      "若出现关节疼痛或静息心率连续升高，请先减强度并预留额外休息日。",
  },

  weekPlan: {
    sectionTitle: "下周计划草案",
    rangeLine: "自下周一起 · 共 7 天 · 可拖到训练首页核对",
    days: [
      {
        id: "d1",
        weekday: "周一",
        focus: "休息",
        detail: "步行或拉伸 20–30 分钟",
        loadTag: "低",
        loadKey: "low",
      },
      {
        id: "d2",
        weekday: "周二",
        focus: "有氧基础",
        detail: "45–50 分钟 · Z2 心率中段",
        loadTag: "中",
        loadKey: "mid",
      },
      {
        id: "d3",
        weekday: "周三",
        focus: "阈值维持",
        detail: "10′ 热身 + 4×6′ @ 阈值配速 / 慢跑间歇",
        loadTag: "高",
        loadKey: "high",
      },
      {
        id: "d4",
        weekday: "周四",
        focus: "恢复跑",
        detail: "35 分钟 · 轻松对话强度",
        loadTag: "低",
        loadKey: "low",
      },
      {
        id: "d5",
        weekday: "周五",
        focus: "休息",
        detail: "可选核心力量 15 分钟",
        loadTag: "低",
        loadKey: "low",
      },
      {
        id: "d6",
        weekday: "周六",
        focus: "长跑",
        detail: "75–85 分钟 · 末段可加速 10–15 分钟",
        loadTag: "高",
        loadKey: "high",
      },
      {
        id: "d7",
        weekday: "周日",
        focus: "放松跑",
        detail: "30–40 分钟 · 完全放松",
        loadTag: "中",
        loadKey: "mid",
      },
    ] satisfies AiWeekPlanDayRow[],
  },
} as const;
