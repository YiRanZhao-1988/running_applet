/**
 * 页面注册选项工厂（仅占位）：后续可在此处统一注入 onShareAppMessage、通用埋点钩子等。
 * 当前返回同一引用，保持 Page() 的类型推导不被破坏。
 */
export function createPageOptions<
  TData extends WechatMiniprogram.Page.DataOption,
  TCustom extends WechatMiniprogram.Page.CustomOption,
>(
  options: WechatMiniprogram.Page.Options<TData, TCustom>,
): WechatMiniprogram.Page.Options<TData, TCustom> {
  return options;
}
