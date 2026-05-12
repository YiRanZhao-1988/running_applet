/**
 * 语音入口演示：按住触发占位流程，不采集真实音频。
 */
let hideDoneHintTimer: ReturnType<typeof setTimeout> | null = null;

Component({
  properties: {
    voice: {
      type: Object,
      value: {},
    },
  },

  data: {
    holding: false,
    done: false,
  },

  lifetimes: {
    detached() {
      if (hideDoneHintTimer) {
        clearTimeout(hideDoneHintTimer);
        hideDoneHintTimer = null;
      }
    },
  },

  methods: {
    onTouchStart() {
      if (hideDoneHintTimer) {
        clearTimeout(hideDoneHintTimer);
        hideDoneHintTimer = null;
      }
      this.setData({ holding: true, done: false });
    },

    onTouchEnd() {
      if (!this.data.holding) return;
      this.setData({ holding: false, done: true });
      this.triggerEvent("mockdone", { at: Date.now() });
      hideDoneHintTimer = setTimeout(() => {
        this.setData({ done: false });
        hideDoneHintTimer = null;
      }, 2200);
    },
  },
});
