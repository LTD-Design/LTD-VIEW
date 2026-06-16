# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- 草稿自动保存（localStorage）
- 画布网格背景可视化
- 组件对齐工具（6 种对齐模式）
- API 数据轮询刷新
- 表单联动工具函数
- 单元测试框架（Vitest）及核心测试用例
- Bundle 分析工具（rollup-plugin-visualizer）
- ESLint + Prettier + Commitlint 代码质量工具链
- 开源文档（README、LICENSE、CONTRIBUTING 等）

### Changed

- ECharts 改为按需引入，Bundle 减小约 47%
- 移除 axios 依赖，使用原生 fetch API
- 导出/导入逻辑抽取为 `useExportDashboard` 组合式函数
- 画布尺寸更新改用 Store action 而非直接修改 state
- 组件库支持点击添加（双击或单击）

### Fixed

- `canUndo` 判断条件错误（`> 0` 修正为 `>= 0`）
- `undo()` 在空历史时访问越界
- 日期范围过滤误匹配字符串数组
- `InteractionProperties` 中 `componentOptions` 响应性丢失

## [0.1.0] - 2024-01-01

### Added

- 项目初始化
- 拖拽布局引擎
- 图表组件（柱状图、折线图、饼图、仪表盘、雷达图）
- 表格组件（数据表格、排名列表）
- 表单组件（输入框、下拉选择、日期选择、级联选择）
- 下钻功能与面包屑导航
- 数据层（静态 JSON + API 数据源 + 字段映射）
- 表单联动
- 全屏预览
- JSON / HTML 导出
- VitePress 文档站点
