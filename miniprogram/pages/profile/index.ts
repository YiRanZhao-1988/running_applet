/**
 * 我的 Tab：展示数据由 trainingStore 与 mock 结构驱动。
 */
import { createStoreBindings } from "mobx-miniprogram-bindings";
import { trainingStore } from "../../store";

type Bindings = ReturnType<typeof createStoreBindings>;

Page({
  storeBindings: null as unknown as Bindings,

  onLoad() {
    this.storeBindings = createStoreBindings(this, {
      store: trainingStore,
      fields: {
        profilePage: "profilePageModel",
        profileStats: "profileStatRows",
        profileSettingRows: "profileSettingRows",
        cloudSyncHint: "cloudSyncHintLine",
      },
      actions: [],
    });
  },

  onUnload() {
    this.storeBindings.destroyStoreBindings();
  },
});
