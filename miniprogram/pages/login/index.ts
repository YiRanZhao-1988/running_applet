/**
 * 登录页：沉浸式背景 + 品牌区 + 微信登录；云开发开启时通过 service 层同步 users。
 */
import { AUTH_LOGGED_IN_AT_KEY } from "../../constants/auth";
import { ROUTES } from "../../constants/routes";
import {
  LOGIN_MOTIVATION_LINES,
  LOGIN_PAGE_BRAND,
} from "../../mock/login-page";
import { isCloudEnabled, userCloudService } from "../../services/cloud";
import { createPageOptions } from "../../utils/page-options";

const LINE_INTERVAL_MS = 6500;

let motivationRotateTimer: ReturnType<typeof setInterval> | null = null;

Page(
  createPageOptions({
    data: {
      statusBarHeightPx: 44,
      safeBottomPx: 0,
      brand: LOGIN_PAGE_BRAND,
      lines: [...LOGIN_MOTIVATION_LINES],
      lineIndex: 0,
      quoteOpacity: 1,
      loginBusy: false,
    },

    onLoad() {
      try {
        const win = wx.getWindowInfo();
        const safe = win.screenHeight - win.safeArea.bottom;
        this.setData({
          statusBarHeightPx: win.statusBarHeight,
          safeBottomPx: safe > 0 ? safe : 0,
        });
      } catch {
        // ignore
      }
    },

    onShow() {
      this.startLineRotation();
    },

    onHide() {
      this.stopLineRotation();
    },

    onUnload() {
      this.stopLineRotation();
    },

    startLineRotation() {
      if (motivationRotateTimer) return;
      motivationRotateTimer = setInterval(() => {
        const lines = this.data.lines as string[];
        if (!lines.length) return;
        const next = (this.data.lineIndex + 1) % lines.length;
        this.setData({ quoteOpacity: 0 });
        setTimeout(() => {
          this.setData({ lineIndex: next, quoteOpacity: 1 });
        }, 420);
      }, LINE_INTERVAL_MS);
    },

    stopLineRotation() {
      if (motivationRotateTimer) {
        clearInterval(motivationRotateTimer);
        motivationRotateTimer = null;
      }
    },

    async onWxLogin() {
      if (this.data.loginBusy) return;
      this.setData({ loginBusy: true });
      wx.login({
        success: async (res) => {
          if (!res.code) {
            wx.showToast({ title: "未获取授权码", icon: "none" });
            this.setData({ loginBusy: false });
            return;
          }
          try {
            wx.setStorageSync(AUTH_LOGGED_IN_AT_KEY, Date.now());
          } catch {
            // ignore
          }

          if (isCloudEnabled()) {
            const touch = await userCloudService.touchUser({
              loading: true,
              loadingTitle: "同步账号…",
            });
            if (!touch.ok) {
              wx.showToast({
                title: touch.error.message.slice(0, 16),
                icon: "none",
              });
            }
          }

          wx.showToast({ title: "已授权", icon: "success", duration: 1200 });
          setTimeout(() => this._leaveLoginPage(), 400);
        },
        fail: () => {
          wx.showToast({ title: "登录未完成", icon: "none" });
          this.setData({ loginBusy: false });
        },
      });
    },

    _leaveLoginPage() {
      this.setData({ loginBusy: false });
      const stack = getCurrentPages();
      if (stack.length > 1) {
        wx.navigateBack({ delta: 1 });
        return;
      }
      wx.switchTab({ url: ROUTES.training });
    },
  }),
);
