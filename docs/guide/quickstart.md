# 快速开始

## 环境要求

- **Node.js**: 18.0+ (推荐 20.x)
- **npm**: 9.0+ (或 yarn / pnpm)

## 安装

```bash
# 克隆仓库
git clone https://gitee.com/ltd_1/ltd-view.git
cd ltd-view

# 安装依赖
npm install
```

## 开发

```bash
# 启动开发服务器
npm run dev
```

启动后在浏览器打开 `http://localhost:5173`，即可看到编辑器界面。

## 基本使用

### 1. 拖拽组件到画布

从左侧组件库中选择一个组件（如柱状图），拖拽到中间画布区域释放。

### 2. 调整组件位置和大小

- **移动**：在画布中拖拽组件
- **调整大小**：选中组件后，拖拽边角的手柄

### 3. 配置组件属性

选中组件后，右侧面板显示三个配置标签：

- **样式**：位置、尺寸、背景色、边框、圆角、透明度、层级
- **数据**：静态 JSON 数据 / API 数据源 / 字段映射
- **交互**：点击事件（下钻/跳转/联动）、悬停效果、入场动画

### 4. 预览

点击顶部工具栏的「预览」按钮，进入全屏预览模式。

### 5. 导出

- **JSON 配置**：导出仪表盘配置文件，可导入复用
- **独立 HTML**：导出自包含 HTML 文件，可离线展示

## 构建生产版本

```bash
npm run build
```

构建产物输出到 `dist/` 目录。

## 测试

```bash
# 运行单元测试
npm run test

# 监听模式运行测试
npm run test:watch
```

## Bundle 分析

```bash
npm run analyze
```

生成 `stats.html` 可视化分析报告。

## 文档开发

```bash
# 启动文档站点
npm run docs:dev

# 构建文档
npm run docs:build
```
