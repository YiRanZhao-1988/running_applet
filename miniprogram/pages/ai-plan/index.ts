/**
 * AI 计划 Tab：编排各输入组件；展示内容由 trainingStore.aiPlanPage（mock）驱动。
 */
import { createStoreBindings } from "mobx-miniprogram-bindings";
import { trainingStore } from "../../store";
import { createPageOptions } from "../../utils/page-options";

type Bindings = ReturnType<typeof createStoreBindings>;

Page(
  createPageOptions({
    storeBindings: null as unknown as Bindings,

    onLoad() {
      this.storeBindings = createStoreBindings(this, {
        store: trainingStore,
        fields: {
          aiPlan: "aiPlanPage",
        },
        actions: [],
      });
    },

    onUnload() {
      this.storeBindings.destroyStoreBindings();
    },

    onUploadChanged() {
      // 占位：接入识别服务后可据此刷新分析区
    },

    onVoiceMockDone() {
      wx.showToast({ title: "已记录（演示）", icon: "none", duration: 1400 });
    },
  }),
);
