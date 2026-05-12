/**
 * 小程序入口文件。
 * - 初始化微信云开发（配置 CLOUD_ENV_ID 后生效）。
 * - 初始化全局训练数据层（MobX + 本地快照 + 云同步钩子）。
 */
import { initCloudIfConfigured, runCloudBootstrapAsync } from "./services/cloud";
import { initTrainingStore } from "./store";

App<IAppOption>({
  onLaunch() {
    initCloudIfConfigured();
    initTrainingStore();
    runCloudBootstrapAsync();
  },

  onShow() {},

  onHide() {},
});
