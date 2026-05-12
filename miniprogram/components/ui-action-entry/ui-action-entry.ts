/**
 * 列表/入口行骨架：可用于 AI 能力入口或设置项。
 * elevated=true 时表现为独立卡片；false 时适合嵌入同一卡片内的多行列表。
 */
Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    /** 主标题 */
    title: {
      type: String,
      value: "",
    },
    /** 辅助说明；空字符串时不展示第二行 */
    description: {
      type: String,
      value: "",
    },
    /** 是否为独立卡片样式 */
    elevated: {
      type: Boolean,
      value: true,
    },
    /** 是否展示右侧提示符（仅占位，无跳转逻辑） */
    showChevron: {
      type: Boolean,
      value: true,
    },
    /**
     * 扁平列表末行：置为 true 以移除底部分割线（用于同卡片内多入口收尾）。
     */
    isLast: {
      type: Boolean,
      value: false,
    },
  },
});
