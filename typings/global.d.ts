/// <reference types="miniprogram-api-typings" />

/**
 * 全局类型补充：与 miniprogram-api-typings 配合使用。
 * 后续可在此声明云函数返回体、全局自定义属性等。
 */

/** 预留：接入 MobX / 全局 store 后可扩展 App 实例类型。 */
interface IAppOption {
  /** 占位字段，便于 TS 识别接口非空（无业务含义）。 */
  __engineInit?: never;
}
