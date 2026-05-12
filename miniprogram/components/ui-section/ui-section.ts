/**
 * 页面纵向区块：统一分组间距与 header/body 结构。
 * header 通过具名 slot 提供；不需要标题时将 showHeader 设为 false。
 */
Component({
  options: {
    addGlobalClass: true,
    multipleSlots: true,
  },
  properties: {
    /** 是否渲染头部插槽区域 */
    showHeader: {
      type: Boolean,
      value: false,
    },
  },
});
