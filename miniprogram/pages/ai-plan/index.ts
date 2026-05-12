/**
 * AI 计划 Tab：展示内容由 store 暴露的 mock 结构驱动。
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
        aiPage: "aiPlanPage",
      },
      actions: [],
    });
  },

  onUnload() {
    this.storeBindings.destroyStoreBindings();
  },
});
