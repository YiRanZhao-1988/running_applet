/**
 * 今日激励语：按间隔随机切换，语气克制、强调长期一致性。
 * 若父级传入 messages 为空，则回退到 mocks/training-home 预置文案。
 */
import { MOTIVATION_LINES } from "../../mocks/training-home";

const TIMER_KEY = "__motivationTimerId";

type TimerAware = WechatMiniprogram.Component.TrivialInstance & {
  [TIMER_KEY]?: ReturnType<typeof setInterval>;
};

Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    /** 文案池；可为空 */
    messages: {
      type: Array,
      value: [] as string[],
    },
    /** 切换间隔（毫秒） */
    intervalMs: {
      type: Number,
      value: 12000,
    },
  },
  data: {
    currentLine: "",
  },

  lifetimes: {
    attached() {
      this.startRotation();
    },
    detached() {
      this.stopRotation();
    },
  },

  observers: {
    messages() {
      this.startRotation();
    },
    intervalMs() {
      this.startRotation();
    },
  },

  methods: {
    resolvePool(): string[] {
      const list = this.properties.messages as unknown as string[];
      return list && list.length > 0 ? list : MOTIVATION_LINES;
    },

    pickNext(pool: string[], previous: string): string {
      if (pool.length === 0) return "";
      if (pool.length === 1) return pool[0];
      let next = pool[Math.floor(Math.random() * pool.length)];
      let guard = 0;
      while (next === previous && guard < 10) {
        next = pool[Math.floor(Math.random() * pool.length)];
        guard += 1;
      }
      return next;
    },

    startRotation() {
      this.stopRotation();
      const pool = this.resolvePool();
      if (pool.length === 0) return;

      const first = pool[Math.floor(Math.random() * pool.length)];
      this.setData({ currentLine: first });

      const ms = Math.max(
        4000,
        Number(this.properties.intervalMs) || 12000,
      );
      const self = this as TimerAware;
      self[TIMER_KEY] = setInterval(() => {
        const p = this.resolvePool();
        const prev = this.data.currentLine;
        const next = this.pickNext(p, prev);
        this.setData({ currentLine: next });
      }, ms);
    },

    stopRotation() {
      const self = this as TimerAware;
      const id = self[TIMER_KEY];
      if (id) clearInterval(id);
      self[TIMER_KEY] = undefined;
    },
  },
});
