# 27-running-applet

长期跑步**训练执行与计划管理**方向的微信原生小程序工程示例。产品强调**极简、任务驱动、低干扰**，定位为训练执行系统，而非运动社交。

## 技术栈

- 微信原生小程序（`miniprogramRoot`: `miniprogram/`）
- TypeScript（`tsconfig.json` + `miniprogram-api-typings`）
- **全局状态**：[`mobx-miniprogram`](https://github.com/wechat-miniprogram/mobx-miniprogram) + `mobx-miniprogram-bindings`；训练计划、勾选与反馈等由 `miniprogram/store/training-store.ts` 集中管理，页面通过 `createStoreBindings` 绑定。
- [TDesign 小程序组件库](https://tdesign.tencent.com/miniprogram/overview)（npm 依赖，按需/全局可在 `app.json` 与各页 `usingComponents` 中配置）
- 持久化：`miniprogram/services/plan-repository.ts` 封装本地快照，存储键 `running_training_core_v1`；后续可替换为云数据库实现同一接口。
- 预留：`services/cloud.ts`（云开发）

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
│   ├── mock/                    # 种子计划与文案（仅数据与展示 copy，无业务逻辑）
│   ├── services/                # 日期工具、计划查找、本地/未来云端 plan-repository、统计派生等
│   ├── store/                   # `initTrainingStore`、`trainingStore`（MobX）
│   ├── types/                   # TS 类型
│   ├── constants/               # 路由等常量
│   └── assets/                  # 如图标等资源
├── typings/                     # 小程序全局类型补充
├── package.json
├── project.config.json          # 含 miniprogramRoot、npm 构建关系
└── tsconfig.json
```

## 功能要点（当前实现）

- **启动**：`app.ts` 的 `onLaunch` 调用 `initTrainingStore()`，从本地读取快照，若无则写入 `mock/seed-plan` 种子并落盘。
- **训练首页**：周日历切换、今日课表、激励语、统计区等均从 `trainingStore` 派生；文案与区块结构来自 `mock/training-page-copy` 等。
- **日程详情**（`pages/day-detail`）：Todo 勾选、反馈弹窗等直接改 `trainingStore` 并经由 `plan-repository` 持久化（与首页共用同一数据源）。

## Tab 与路由

- Tab：`训练`、`AI计划`、`我的`
- 非 Tab：`day-detail`（由训练周历 `navigateTo` 并带 `date=YYYY-MM-DD`）、`login`

路由常量见 `miniprogram/constants/routes.ts`。

## 设计与约定

- 视觉：灰白、低饱和、卡片与留白为主；复杂渐变与高社交化 UI 刻意避免。
- 业务数据：域模型见 `types/domain.ts`；演示与文案集中在 `mock/`；写入走 `plan-repository`，便于日后换云数据库而不改页面绑定。

## 许可证

ISC（见 `package.json`）。
