/**
 * 标题展示组件：使用全局 .u-title--* 字号体系，避免页面散落硬编码。
 * 若需要插入富文本，可传空 text 并使用默认 slot。
 */
Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    /** 标题文案；为空时渲染 slot */
    text: {
      type: String,
      value: "",
    },
    /** page | section | card — 与 styles/title.wxss 对齐 */
    variant: {
      type: String,
      value: "section",
    },
  },
});
