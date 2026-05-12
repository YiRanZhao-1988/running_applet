/**
 * 统计信息卡片骨架：标签 + 占位数值（默认 “—” 表示未接入数据）。
 */
Component({
  options: {
    addGlobalClass: true,
  },
  externalClasses: ['ext-class'],
  properties: {
    /** 指标名称 */
    label: {
      type: String,
      value: '',
    },
    /** 指标值；未接入数据前保持占位符即可 */
    value: {
      type: String,
      value: '—',
    },
  },
});
