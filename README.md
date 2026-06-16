# LtdView

[English](README.en.md)

可视化 BI 大屏报表生成系统，支持拖拽式布局、图表配置、数据绑定，既能做大屏展示也能做分析型仪表盘。

## 功能特性

- **拖拽布局** — 组件库拖入画布，自由移动、调整大小
- **图表组件** — 柱状图、折线图、饼图、仪表盘、雷达图等
- **表格组件** — 数据表格（排序/筛选/分页）、排名列表
- **表单组件** — 输入框、下拉选择、日期选择、级联选择
- **下钻功能** — 图表和表格支持点击下钻，面包屑导航返回
- **数据层** — 静态 JSON + API 数据源，支持字段映射与轮询刷新
- **表单联动** — 字段显隐、选项级联、值变化触发组件刷新
- **预览导出** — 全屏预览、导出 JSON 配置 / 独立 HTML 文件
- **草稿保存** — 编辑器状态自动保存到 localStorage，刷新不丢失

## 技术栈

| 类别 | 选型 | 版本 |
|------|------|------|
| 框架 | Vue 3 | ^3.4 |
| 构建 | Vite | ^5.4 |
| 状态管理 | Pinia | ^2.1 |
| 图表 | ECharts（按需引入） | ^5.5 |
| UI 组件 | Naive UI | ^2.38 |
| 样式 | SCSS | ^1.77 |
| 测试 | Vitest | ^4.1 |
| 文档 | VitePress | ^1.3 |

## 快速开始

### 环境要求

- Node.js 18.0+（推荐 20.x）
- npm 9.0+（或 yarn / pnpm）

### 安装与运行

```bash
git clone https://gitee.com/ltd_1/ltd-view.git
cd ltd-view
npm install
npm run dev
```

浏览器打开 `http://localhost:3000` 即可使用。

## 基本使用

1. **拖拽组件** — 从左侧组件库选择组件，拖入画布
2. **调整布局** — 拖拽移动组件，拖拽边角调整大小
3. **配置属性** — 右侧面板配置样式、数据源、交互事件
4. **预览** — 顶部工具栏点击「预览」进入全屏模式
5. **导出** — 导出 JSON 配置文件或独立 HTML 文件

## 开发命令

```bash
npm run dev          # 启动开发服务器
npm run build        # 构建生产版本
npm run test         # 运行单元测试
npm run test:watch   # 监听模式测试
npm run analyze      # Bundle 分析
npm run lint         # 代码检查
npm run format       # 格式化代码
npm run docs:dev     # 启动文档站点
npm run docs:build   # 构建文档
```

## 项目结构

```
ltd-view/
├── src/
│   ├── components/       # Vue 组件
│   │   ├── layout/       # 布局组件（编辑器三栏）
│   │   ├── charts/       # 图表组件
│   │   ├── tables/       # 表格组件
│   │   ├── forms/        # 表单组件
│   │   └── base/         # 基础组件
│   ├── composables/      # Vue 组合式函数
│   ├── stores/           # Pinia 状态管理
│   ├── config/           # 组件注册表、主题配置
│   ├── utils/            # 工具函数
│   ├── __tests__/        # 单元测试
│   └── views/            # 页面（编辑器/预览）
├── docs/                 # VitePress 文档站点
└── package.json
```

## 浏览器支持

| 浏览器 | 版本 |
|--------|------|
| Chrome | 最新版 |
| Firefox | 最新版 |
| Safari | 最新版 |
| Edge | 最新版 |

## 贡献

欢迎贡献！请阅读 [CONTRIBUTING.md](CONTRIBUTING.md) 了解开发规范。

## 开源协议

[MIT License](LICENSE)
