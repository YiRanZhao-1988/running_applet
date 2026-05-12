# 27-running-applet

长期跑步**训练执行与计划管理**方向的微信原生小程序工程示例。产品强调**极简、任务驱动、低干扰**，定位为训练执行系统，而非运动社交。

## 技术栈

- 微信原生小程序（`miniprogramRoot`: `miniprogram/`）
- TypeScript（`tsconfig.json` + `miniprogram-api-typings`）
- [TDesign 小程序组件库](https://tdesign.tencent.com/miniprogram/overview)（npm 依赖，按需/全局可在 `app.json` 与各页 `usingComponents` 中配置）
- 预留：`store/`（MobX 等）、`services/cloud.ts`（云开发）

## 环境要求

- Node.js（用于安装依赖与类型检查）
- [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)

## 快速开始

1. 克隆或打开本仓库，在项目根目录安装依赖：

   ```bash
   npm install
   ```

2. 使用微信开发者工具导入项目，目录选择**本仓库根目录**（包含 `project.config.json` 的目录）。

3. 在 `project.config.json` 中填写你的 **AppID**（测试可使用测试号流程，按官方文档操作）。

4. 菜单栏选择 **工具 → 构建 npm**，生成 `miniprogram/miniprogram_npm/` 后，TDesign 等 npm 组件路径才会生效。

5. （可选）类型检查：

   ```bash
   npm run typecheck
   ```

## 脚本说明

| 命令 | 说明 |
|------|------|
| `npm run typecheck` | 运行 `tsc --noEmit`，不产出 JS |

## 目录结构（摘要）

```text
.
├── miniprogram/                 # 小程序源码根
│   ├── app.ts / app.json / app.wxss
│   ├── pages/                   # 页面：训练、AI 计划、我的、日程详情、登录等
│   ├── components/              # 通用 UI 与业务相关组件（week-calendar、training-card 等）
│   ├── styles/                  # 全局样式分片：theme、spacing、card、button 等
│   ├── mocks/                   # 本地演示数据（无后端时）
│   ├── services/                # 封装：如 day-detail 本地存储
│   ├── store/                   # 全局状态预留
│   ├── types/                   # TS 类型
│   ├── constants/               # 路由等常量
│   └── assets/                  # 如图标等资源
├── typings/                     # 小程序全局类型补充
├── package.json
├── project.config.json          # 含 miniprogramRoot、npm 构建关系
└── tsconfig.json
```

## 功能要点（当前实现）

- **训练首页**：周日历切换、今日课表卡片、激励语轮播、统计区（部分为本地 mock）。
- **日程详情**（`pages/day-detail`）：单日多条训练 Todo、勾选完成、简短完成动效、训练反馈弹窗；完成态与反馈写入 **本地缓存**（键名见 `services/day-detail-storage.ts`）。

## Tab 与路由

- Tab：`训练`、`AI计划`、`我的`
- 非 Tab：`day-detail`（由训练周历 `navigateTo` 并带 `date=YYYY-MM-DD`）、`login`

路由常量见 `miniprogram/constants/routes.ts`。

## 设计与约定

- 视觉：灰白、低饱和、卡片与留白为主；复杂渐变与高社交化 UI 刻意避免。
- 业务数据：当前以 **mock + 本地存储** 为主；接入云开发后可逐步替换 `mocks/` 与存储实现。

## 许可证

ISC（见 `package.json`）。
