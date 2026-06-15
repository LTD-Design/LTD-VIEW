# 示例：分析仪表盘

本示例展示如何构建一个销售数据分析仪表盘。

## 布局设计

```
┌─────────────────────────────────────────────────┐
│                  筛选器区域                       │
│         [日期范围] [产品类别] [查询]              │
├─────────────────────┬───────────────────────────┤
│                     │                           │
│     柱状图          │        饼图               │
│   区域销售额        │     产品占比              │
│                     │                           │
├─────────────────────┼───────────────────────────┤
│                     │                           │
│     折线图          │       数据表格            │
│   月度趋势          │    销售明细              │
│                     │                           │
└─────────────────────┴───────────────────────────┘
```

## 画布配置

```json
{
  "name": "销售分析仪表盘",
  "width": 1920,
  "height": 1080,
  "background": "#0a1929",
  "components": [
    {
      "type": "form-filter",
      "x": 20, "y": 20, "width": 1880, "height": 80,
      "props": {
        "layout": "inline",
        "fields": [
          { "key": "dateRange", "type": "daterange", "label": "日期范围" },
          { "key": "category", "type": "select", "label": "产品类别",
            "options": [
              { "label": "全部", "value": "" },
              { "label": "电子产品", "value": "electronics" },
              { "label": "食品", "value": "food" }
            ]
          }
        ]
      },
      "linkage": {
        "targets": ["chart-1", "chart-2", "table-1"],
        "trigger": "onChange"
      }
    },
    {
      "type": "bar-chart",
      "x": 20, "y": 120, "width": 930, "height": 450,
      "props": { "title": "区域销售额", "theme": "dark" }
    },
    {
      "type": "pie-chart",
      "x": 970, "y": 120, "width": 930, "height": 450,
      "props": { "title": "产品占比", "theme": "dark" }
    },
    {
      "type": "line-chart",
      "x": 20, "y": 590, "width": 930, "height": 450,
      "props": { "title": "月度趋势", "theme": "dark", "smooth": true }
    },
    {
      "type": "data-table",
      "x": 970, "y": 590, "width": 930, "height": 450,
      "props": {
        "title": "销售明细",
        "pagination": true,
        "pageSize": 5,
        "sorting": true,
        "filtering": true
      }
    }
  ]
}
```

## 数据配置

### 柱状图数据

```json
[
  { "name": "华东区", "value": 125000 },
  { "name": "华北区", "value": 89000 },
  { "name": "华南区", "value": 156000 },
  { "name": "华中区", "value": 67000 },
  { "name": "西南区", "value": 45000 }
]
```

### 表格数据

```json
[
  { "region": "华东区", "product": "电子产品", "sales": 125000, "count": 520 },
  { "region": "华北区", "product": "食品", "sales": 89000, "count": 380 },
  { "region": "华南区", "product": "电子产品", "sales": 156000, "count": 650 },
  { "region": "华中区", "product": "服装", "sales": 67000, "count": 290 },
  { "region": "西南区", "product": "食品", "sales": 45000, "count": 180 }
]
```

## 交互配置

### 表单联动

筛选器配置联动目标：柱状图、饼图、表格。

字段值变化时，目标组件自动根据筛选条件过滤数据。

### 表格下钻

表格配置行点击下钻：

- 触发方式：行点击
- 层级 1：区域 → 城市
- 层级 2：城市 → 区
- 显示面包屑

## 使用步骤

1. 打开编辑器 (`npm run dev`)
2. 从左侧拖入筛选器组件，调整大小
3. 拖入柱状图、饼图、折线图、表格
4. 选中每个组件，在右侧属性面板配置数据
5. 配置筛选器的联动目标
6. 配置表格的下钻层级
7. 点击「预览」查看效果
8. 导出为 JSON 或 HTML
