/**
 * 我的 Tab 展示数据。
 */
export const PROFILE_PAGE = {
  user: {
    title: "账号",
    subtitle: "登录后同步计划进度与历史记录（占位说明）",
  },
  overviewTitle: "数据概览",
  stats: [
    { id: "total_km", label: "总跑量", valueKey: "totalKm" as const },
    { id: "completion", label: "计划完成率", valueKey: "completionRate" as const },
  ],
  historyEntry: {
    id: "history",
    title: "历史训练",
    description: "按时间查看已完成与错过的训练安排",
  },
  settings: {
    title: "设置",
    items: [
      {
        id: "notify",
        title: "通知",
        description: "训练提醒与计划变更（占位）",
      },
      {
        id: "privacy",
        title: "隐私与数据",
        description: "本地与云同步策略（占位）",
      },
      {
        id: "about",
        title: "关于",
        description: "版本与协议入口（占位）",
      },
    ],
  },
} as const;
