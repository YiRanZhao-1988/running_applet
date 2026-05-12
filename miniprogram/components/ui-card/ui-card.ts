/**
 * 通用卡片容器：配合全局样式 token（.u-card）使用，仅做布局包裹。
 * 不参与业务数据，不发起请求。
 */
Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    /** 是否套用 mid 内边距（与 .u-card--pad-md 对齐） */
    padded: {
      type: Boolean,
      value: true,
    },
    /** 是否使用极弱阴影抬升层次 */
    soft: {
      type: Boolean,
      value: false,
    },
  },
});
