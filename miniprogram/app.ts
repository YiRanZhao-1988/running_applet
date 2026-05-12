/**
 * 小程序入口文件。
 * - 初始化全局训练数据层（MobX + 本地快照）。
 * - 后续可在此调用 wx.cloud.init。
 */
import { initTrainingStore } from "./store";

App<IAppOption>({
  onLaunch() {
    initTrainingStore();
  },

  onShow() {},

  onHide() {},
});
