# BI 报表生成系统 — 技术方案

## 一、项目概述

构建一个可视化 BI 大屏报表生成系统，支持拖拽式布局、图表配置、数据绑定，既能做大屏展示也能做分析型仪表盘。

## 二、技术栈

| 类别 | 选型 | 理由 |
|------|------|------|
| 框架 | Vue 3 + Vite | 响应式系统、构建速度快 |
| 状态管理 | Pinia | Vue 3 官方推荐，轻量 |
| 图表 | ECharts 5 | 功能全面，大屏效果好 |
| 拖拽 | vuedraggable (SortableJS) | 成熟稳定，Vue 3 支持好 |
| 布局 | vue-grid-layout | 网格布局，自由拖拽调整大小 |
| UI 组件 | Naive UI | Vue 3 原生，TypeScript 友好，主题定制强 |
| 样式 | SCSS | 变量/混入方便，大屏样式管理灵活 |
| 文档 | VitePress | Vue 生态原生，部署方便 |
| 数据转换 | Lodash | 数据处理工具函数 |

## 三、核心架构

```
┌─────────────────────────────────────────────────────┐
│                    应用入口 App.vue                   │
├─────────┬───────────────────────────┬───────────────┤
│ 工具栏  │       画布区域             │   属性面板    │
│ (左侧)  │    (中间核心区域)          │   (右侧)      │
│         │                           │               │
│ 组件库  │  ┌─────────┬─────────┐   │  样式配置     │
│ 拖拽到  │  │ 图表1   │ 图表2   │   │  数据配置     │
│ 画布    │  ├─────────┴─────────┤   │  动画配置     │
│         │  │     图表3         │   │               │
│         │  └───────────────────┘   │               │
├─────────┴───────────────────────────┴───────────────┤
│                   状态管理层 (Pinia)                   │
│  canvasStore / componentStore / dataStore            │
└─────────────────────────────────────────────────────┘
```

## 四、功能模块设计

### 4.1 组件库（左侧面板）

分组管理，支持拖拽到画布：

- **图表类**：柱状图、折线图、饼图、环形图、仪表盘、雷达图、散点图、热力图、地图
- **表格类**：数据表格（支持排序/筛选/下钻）、透视表、排名列表
- **表单类**：输入框、下拉选择、日期选择、开关、滑块、级联选择
- **文本类**：标题、副标题、富文本、数字翻牌器
- **媒体类**：图片、视频、iframe
- **装饰类**：边框、分割线、背景色块
- **容器类**：卡片、Tab 容器、滚动列表

### 4.2 表格组件（重点）

#### 4.2.1 数据表格

```typescript
interface TableConfig {
  columns: ColumnDef[]        // 列定义
  dataSource: DataSource      // 数据源（静态/API）
  pagination: boolean         // 分页
  pageSize: number            // 每页条数
  sorting: boolean            // 排序
  filtering: boolean          // 筛选
  rowSelection: boolean       // 行选择
  stripe: boolean             // 斑马纹
  border: boolean             // 边框
  fixedHeader: boolean        // 固定表头
  columnResize: boolean       // 列宽可调
}

interface ColumnDef {
  key: string                 // 字段名
  title: string               // 列标题
  width: number               // 列宽
  sortable: boolean           // 可排序
  filterable: boolean         // 可筛选
  formatter: string           // 格式化函数名
  align: 'left' | 'center' | 'right'
}
```

#### 4.2.2 下钻功能（表格 + 图表通用）

```typescript
interface DrillDownConfig {
  enabled: boolean
  trigger: 'click' | 'dblclick' | 'context-menu'   // 表格: cell-click / row-click
  levels: DrillLevel[]          // 下钻层级定义
  behavior: 'replace' | 'navigate' | 'modal' | 'linkage'
  breadcrumb: boolean           // 显示面包屑
  linkageTargets: string[]      // 联动的组件 ID 列表
}

interface DrillLevel {
  name: string                  // 层级名称
  field: string                 // 对应字段（表格列字段 / 图表维度字段）
  apiEndpoint: string           // 该层级的数据接口
  parentParam: string           // 传给上级的参数名
}
```

**图表下钻**：
- 触发：点击柱子/扇区/数据点/地图区域
- 行为：当前图表替换为下一级数据，或弹窗/跳转/联动
- 面包屑：图表顶部显示层级路径，点击可返回上层

**表格下钻**：
- 触发：点击单元格/行/右键菜单
- 行为：替换表格数据，或弹窗/跳转/联动
- 面包屑：表格顶部显示层级路径

**下钻示例流程**：
1. 柱状图展示「各区域销售额」→ 点击「华东」
2. 图表切换为「华东各城市销售额」，面包屑：`全国 > 华东`
3. 点击「杭州」→ 图表切换为「杭州各区销售额」，面包屑：`全国 > 华东 > 杭州`
4. 点击面包屑「全国」→ 返回顶层数据
```

#### 4.2.3 表格交互

- 单元格点击事件 → 触发下钻或联动
- 行悬停高亮
- 列宽拖拽调整
- 表头排序（单击升序 → 降序 → 取消）
- 列筛选（下拉选择 / 范围筛选）
- 固定列（左/右侧）
- 自适应内容宽度

### 4.3 表单组件

#### 4.3.1 表单容器

```typescript
interface FormConfig {
  layout: 'horizontal' | 'vertical' | 'inline'
  labelWidth: number
  labelPosition: 'left' | 'right' | 'top'
  size: 'small' | 'default' | 'large'
  disabled: boolean
  fields: FormField[]
}

interface FormField {
  key: string
  type: 'input' | 'select' | 'date' | 'switch' | 'slider' | 'cascade' | 'textarea'
  label: string
  placeholder: string
  required: boolean
  rules: ValidationRule[]
  options: OptionItem[]           // select/cascade 选项
  defaultValue: any
  visible: boolean                // 是否显示
  dependOn: string[]              // 依赖字段（联动显隐）
}
```

#### 4.3.2 表单用途

- **筛选器**：表单作为仪表盘的全局筛选条件，影响其他组件数据
- **数据录入**：提交数据到后端 API
- **参数面板**：配置查询参数，联动图表/表格刷新

#### 4.3.3 表单联动

- 字段显隐联动（选择类型 A 才显示字段 B）
- 选项联动（选择省份后加载对应城市）
- 值变化触发其他组件刷新

### 4.4 画布系统（中间区域）

- 网格布局，支持拖拽放置、调整大小、对齐
- 缩放与平移（适配不同分辨率大屏）
- 多选、组合、层级调整（上移/下移/置顶/置底）
- 撤销/重做（Undo/Redo）
- 标尺与辅助线

### 4.3 属性面板（右侧）

选中组件后显示对应配置：

- **样式**：尺寸、位置、背景、边框、字体、阴影、透明度
- **数据**：静态 JSON 编辑 / API 地址配置 / 数据映射
- **交互**：点击事件、跳转链接、数据联动
- **动画**：入场动画、轮播、数字滚动

### 4.4 数据层

```
数据源配置
├── 静态数据 → JSON 编辑器输入
├── API 数据 → 配置 URL、Method、Headers、Params
├── 数据映射 → 将接口字段映射到图表维度/指标
└── 联动机制
    ├── 表单值变化 → 触发目标组件重新请求数据
    └── 下钻点击 → 携带参数请求下级数据
```

### 4.5 预览与导出

- 实时预览模式
- 全屏展示（适配 1920×1080 等分辨率）
- 导出为 JSON 配置文件（可导入复用）
- 导出为独立 HTML 文件（离线展示）

## 五、数据模型设计

### 5.1 画布配置（整体 JSON Schema）

```json
{
  "id": "dashboard-001",
  "name": "销售数据大屏",
  "width": 1920,
  "height": 1080,
  "background": "#0a1929",
  "components": [
    {
      "id": "comp-001",
      "type": "bar-chart",
      "x": 100,
      "y": 50,
      "width": 600,
      "height": 400,
      "zIndex": 1,
      "props": {
        "title": "月度销售额",
        "theme": "dark"
      },
      "data": {
        "type": "api",
        "url": "/api/sales/monthly",
        "method": "GET",
        "mapping": {
          "xField": "month",
          "yField": "amount"
        }
      },
      "style": {
        "border": "1px solid #1e3a5f",
        "borderRadius": 8,
        "background": "rgba(13,25,45,0.8)"
      },
      "animation": {
        "entrance": "fadeIn",
        "duration": 1000
      }
    },
    {
      "id": "comp-002",
      "type": "data-table",
      "x": 100,
      "y": 460,
      "width": 800,
      "height": 400,
      "zIndex": 2,
      "props": {
        "title": "区域销售明细",
        "pagination": true,
        "pageSize": 10,
        "sorting": true,
        "filtering": true,
        "stripe": true,
        "border": true,
        "columns": [
          { "key": "region", "title": "区域", "sortable": true, "filterable": true },
          { "key": "product", "title": "产品", "sortable": true },
          { "key": "sales", "title": "销售额", "sortable": true, "align": "right", "formatter": "currency" },
          { "key": "count", "title": "销量", "sortable": true, "align": "right" }
        ]
      },
      "data": {
        "type": "api",
        "url": "/api/sales/region",
        "method": "GET",
        "mapping": {}
      },
      "drillDown": {
        "enabled": true,
        "trigger": "cell-click",
        "levels": [
          {
            "name": "区域",
            "field": "region",
            "apiEndpoint": "/api/sales/city",
            "parentParam": "region"
          },
          {
            "name": "城市",
            "field": "city",
            "apiEndpoint": "/api/sales/detail",
            "parentParam": "city"
          }
        ],
        "behavior": "replace",
        "breadcrumb": true,
        "linkageTargets": ["comp-001"]
      },
      "style": {
        "headerBg": "#0d192d",
        "headerColor": "#4fc3f7",
        "rowColor": "#e0e0e0",
        "borderColor": "#1e3a5f"
      }
    },
    {
      "id": "comp-003",
      "type": "form-filter",
      "x": 920,
      "y": 50,
      "width": 400,
      "height": 200,
      "zIndex": 3,
      "props": {
        "layout": "inline",
        "labelWidth": 80,
        "fields": [
          {
            "key": "dateRange",
            "type": "date",
            "label": "日期范围",
            "placeholder": "选择日期",
            "required": true
          },
          {
            "key": "category",
            "type": "select",
            "label": "产品类别",
            "options": [
              { "label": "全部", "value": "" },
              { "label": "电子产品", "value": "electronics" },
              { "label": "食品", "value": "food" }
            ]
          }
        ]
      },
      "linkage": {
        "targets": ["comp-001", "comp-002"],
        "trigger": "onChange",
        "paramMapping": {
          "dateRange": "startDate,endDate",
          "category": "category"
        }
      }
    }
  ]
}
```

### 5.2 组件类型注册表

```typescript
interface ComponentMeta {
  type: string          // 组件唯一标识
  name: string          // 显示名称
  category: 'chart' | 'table' | 'form' | 'text' | 'media' | 'decorator' | 'container'
  icon: string          // 图标
  defaultProps: object  // 默认配置
  defaultSize: { width: number, height: number }
}
```

## 六、开源仓库规范

### 6.1 必备文件

| 文件 | 用途 |
|------|------|
| README.md | 项目介绍、功能特性、快速开始、截图演示 |
| LICENSE | 开源许可证（推荐 MIT） |
| CONTRIBUTING.md | 贡献指南（开发环境搭建、分支规范、PR 流程） |
| CODE_OF_CONDUCT.md | 社区行为准则 |
| CHANGELOG.md | 版本更新日志（遵循 Keep a Changelog） |
| .gitignore | 忽略 node_modules、dist、.env 等 |
| .editorconfig | 统一编辑器格式（缩进、换行、编码） |
| package.json | 项目元信息（名称、描述、作者、仓库地址、脚本） |

### 6.2 GitHub 模板

```
.github/
├── ISSUE_TEMPLATE/
│   ├── bug_report.md           # Bug 报告模板
│   └── feature_request.md      # 功能请求模板
├── PULL_REQUEST_TEMPLATE.md    # PR 模板
└── workflows/
    ├── ci.yml                  # CI 流水线（lint + build）
    └── deploy-docs.yml         # 文档自动部署
```

### 6.3 CI/CD 配置

- **CI 流水线**：PR 提交时自动运行 lint 检查 + 构建验证
- **文档部署**：main 分支更新时自动部署 VitePress 文档到 GitHub Pages
- **发布流程**：打 tag 时自动构建并发布到 npm（可选）

### 6.4 文档站点（VitePress）

```
docs/
├── .vitepress/
│   └── config.js               # 站点配置（标题、导航、侧边栏）
├── index.md                    # 首页（Hero + Features）
├── guide/
│   ├── introduction.md         # 项目介绍
│   ├── quickstart.md           # 快速开始
│   ├── features.md             # 功能特性
│   └── contribute.md           # 贡献指南
├── components/
│   ├── chart.md                # 图表组件文档
│   ├── table.md                # 表格组件文档（含下钻）
│   └── form.md                 # 表单组件文档
├── api/
│   ├── data-source.md          # 数据源配置
│   └── export.md               # 导入导出
└── examples/
    ├── dashboard.md            # 示例：分析仪表盘
    └── bigscreen.md            # 示例：数据大屏
```

### 6.5 质量保障

- **ESLint**：代码规范检查
- **Prettier**：代码格式化
- **Commitlint**：提交信息规范化（`feat:` / `fix:` / `docs:` 等）
- **Husky + lint-staged**：提交前自动检查

## 七、项目目录结构

```
ltd-view/
├── .editorconfig                # 编辑器统一配置
├── .gitignore                   # Git 忽略规则
├── .github/                     # GitHub 模板与 CI
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   └── feature_request.md
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── workflows/
│       ├── ci.yml
│       └── deploy-docs.yml
├── index.html
├── package.json
├── vite.config.js
├── .eslintrc.cjs
├── .prettierrc
├── commitlint.config.js
├── CHANGELOG.md
├── CONTRIBUTING.md
├── LICENSE
├── README.md
├── src/
│   ├── main.js
│   ├── App.vue
│   ├── styles/
│   │   ├── variables.scss
│   │   ├── mixins.scss
│   │   ├── editor.scss
│   │   └── themes/
│   │       ├── dark.scss
│   │       └── blue.scss
│   ├── router/
│   │   └── index.js
│   ├── stores/
│   │   ├── canvas.js
│   │   ├── preview.js
│   │   └── data.js
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppHeader.vue
│   │   │   ├── ComponentPanel.vue
│   │   │   ├── Canvas.vue
│   │   │   └── PropertyPanel.vue
│   │   ├── base/
│   │   │   ├── DraggableItem.vue
│   │   │   └── ResizeHandle.vue
│   │   ├── charts/
│   │   │   ├── BarChart.vue
│   │   │   ├── LineChart.vue
│   │   │   ├── PieChart.vue
│   │   │   ├── GaugeChart.vue
│   │   │   └── RadarChart.vue
│   │   ├── tables/
│   │   │   ├── DataTable.vue
│   │   │   ├── RankList.vue
│   │   │   └── PivotTable.vue
│   │   └── forms/
│   │       ├── FormFilter.vue
│   │       ├── FormInput.vue
│   │       ├── FormSelect.vue
│   │       └── FormDate.vue
│   ├── config/
│   │   ├── components.js
│   │   └── themes.js
│   ├── utils/
│   │   ├── dataAdapter.js
│   │   ├── drillDown.js
│   │   ├── formLinkage.js
│   │   ├── export.js
│   │   └── shortcuts.js
│   └── views/
│       ├── Editor.vue
│       └── Preview.vue
└── docs/
    ├── .vitepress/
    │   └── config.js
    ├── index.md
    ├── guide/
    │   ├── introduction.md
    │   ├── quickstart.md
    │   ├── features.md
    │   └── contribute.md
    ├── components/
    │   ├── chart.md
    │   ├── table.md
    │   └── form.md
    ├── api/
    │   ├── data-source.md
    │   └── export.md
    └── examples/
        ├── dashboard.md
        └── bigscreen.md
```

## 七、开发计划（分 4 期）

### 第 1 期：基础框架搭建（3-5 天）

- [ ] 项目初始化：Vue 3 + Vite + Naive UI + SCSS + Pinia
- [ ] 编辑器三栏布局（组件面板 / 画布 / 属性面板）
- [ ] 组件注册表机制
- [ ] 画布基础网格布局

### 第 2 期：核心拖拽与组件（5-7 天）

- [ ] 左侧组件拖拽到画布
- [ ] 画布内组件拖拽移动、调整大小
- [ ] ECharts 图表组件接入（柱状图、折线图、饼图）
- [ ] 表格组件（排序、筛选、分页、列宽调整）
- [ ] 表单组件（输入框、下拉、日期选择）
- [ ] 右侧属性面板（样式配置）
- [ ] 组件选中、多选、删除

### 第 3 期：数据与交互（5-7 天）

- [ ] 静态数据 JSON 编辑器
- [ ] API 数据源配置
- [ ] 数据字段映射
- [ ] **图表下钻**（点击柱子/扇区切换下级数据 + 面包屑导航）
- [ ] **表格下钻**（点击单元格/行切换下级数据 + 面包屑导航）
- [ ] 下钻联动其他组件刷新
- [ ] **表单联动**（字段显隐、选项联动、值变化触发组件刷新）
- [ ] 撤销/重做功能
- [ ] 组件动画配置

### 第 4 期：预览与导出（3-5 天）

- [ ] 全屏预览模式
- [ ] 导出 JSON 配置
- [ ] 导入 JSON 恢复
- [ ] 导出独立 HTML
- [ ] 大屏分辨率适配

### 第 5 期：文档站点（2-3 天）

- [ ] VitePress 文档站点搭建
- [ ] 项目介绍与快速开始
- [ ] 组件开发文档
- [ ] API 接口文档
- [ ] 部署指南

## 八、推荐开源库

### 核心依赖

| 库名 | 版本 | 用途 | npm 包名 |
|------|------|------|----------|
| Vue 3 | ^3.4 | 前端框架 | `vue` |
| Vite | ^5.x | 构建工具 | `vite` |
| Pinia | ^2.x | 状态管理 | `pinia` |
| ECharts | ^5.5 | 图表渲染 | `echarts` |
| Naive UI | ^2.x | UI 组件库 | `naive-ui` |
| vue-router | ^4.x | 路由管理 | `vue-router` |

### 拖拽与布局

| 库名 | 版本 | 用途 | npm 包名 |
|------|------|------|----------|
| vuedraggable | ^4.x | 拖拽排序（Vue 3） | `vuedraggable` |
| vue-grid-layout | ^4.x | 网格布局系统 | `vue3-grid-layout` |
| sortablejs | ^1.x | 底层拖拽引擎 | `sortablejs` |

### 数据处理与工具

| 库名 | 版本 | 用途 | npm 包名 |
|------|------|------|----------|
| lodash-es | ^4.x | 工具函数库 | `lodash-es` |
| axios | ^1.x | HTTP 请求 | `axios` |
| dayjs | ^1.x | 日期处理 | `dayjs` |
| uuid | ^9.x | 生成唯一 ID | `uuid` |

### 编辑器相关

| 库名 | 版本 | 用途 | npm 包名 |
|------|------|------|----------|
| monaco-editor | ^0.x | JSON/代码编辑器 | `monaco-editor` |
| @vueup/vue-quill | ^1.x | 富文本编辑 | `@vueup/vue-quill` |
| v-colorpicker | ^2.x | 颜色选择器 | `v-colorpicker` |

### 文档与构建

| 库名 | 版本 | 用途 | npm 包名 |
|------|------|------|----------|
| vitepress | ^1.x | 文档站点生成 | `vitepress` |
| sass | ^1.x | SCSS 编译 | `sass` |

### 可选增强

| 库名 | 版本 | 用途 | npm 包名 |
|------|------|------|----------|
| @vueuse/core | ^10.x | 组合式 API 工具集 | `@vueuse/core` |
| file-saver | ^2.x | 文件下载 | `file-saver` |
| html2canvas | ^1.x | 截图导出 | `html2canvas` |
| nprogress | ^0.x | 顶部加载条 | `nprogress` |

## 九、关键技术点

1. **拖拽实现**：vuedraggable 负责组件库拖入画布，vue-grid-layout 负责画布内布局调整
2. **ECharts 封装**：每个图表组件是 Vue 组件，内部管理 ECharts 实例的 init/resize/dispose
3. **表格组件**：基于 Naive UI DataTable 封装，支持列定义、排序、筛选、固定列、下钻
4. **下钻引擎**：统一的下钻管理器，管理层级栈、面包屑、数据请求、组件联动
5. **表单联动**：依赖追踪机制，字段值变化时自动触发关联组件的数据刷新
6. **状态快照**：Pinia store 中维护历史栈，支持 Undo/Redo
7. **数据驱动**：组件通过 `data` 配置自动获取并渲染数据，支持静态和 API 两种模式
8. **主题系统**：预置多套大屏主题（深蓝、科技、暗黑），一键切换

---

*方案确认后即可开始第 1 期开发。*
