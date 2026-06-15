# 图表组件

LtdView 内置 5 种 ECharts 图表组件，支持主题切换、下钻交互。

## 柱状图 (bar-chart)

用于分类数据的对比展示。

### 默认配置

```javascript
{
  type: 'bar-chart',
  name: '柱状图',
  category: 'chart',
  defaultProps: {
    title: '柱状图',
    theme: 'dark',
    showLegend: true,
    showTooltip: true
  },
  defaultSize: { width: 600, height: 400 }
}
```

### 数据格式

```json
[
  { "name": "华东区", "value": 125000 },
  { "name": "华北区", "value": 89000 },
  { "name": "华南区", "value": 156000 }
]
```

### 属性配置

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| title | string | '柱状图' | 图表标题 |
| theme | string | 'dark' | 主题：dark/blue/green/purple |
| showLegend | boolean | true | 显示图例 |
| showTooltip | boolean | true | 显示提示框 |

## 折线图 (line-chart)

用于趋势数据的展示。

### 数据格式

与柱状图相同。

### 额外属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| smooth | boolean | true | 曲线平滑 |

## 饼图 (pie-chart)

用于占比数据的展示。

### 数据格式

```json
[
  { "name": "电子产品", "value": 45 },
  { "name": "食品", "value": 30 },
  { "name": "服装", "value": 25 }
]
```

### 特性

- 默认环形饼图（内半径 40%，外半径 70%）
- 右侧垂直图例

## 仪表盘 (gauge-chart)

用于单值指标的展示。

### 数据格式

取第一个数据项的值：

```json
[{ "name": "完成率", "value": 75 }]
```

### 额外属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| min | number | 0 | 最小值 |
| max | number | 100 | 最大值 |

## 雷达图 (radar-chart)

用于多维度数据的对比。

### 数据格式

```json
[
  { "name": "性能", "value": 80 },
  { "name": "可靠性", "value": 90 },
  { "name": "安全性", "value": 70 }
]
```

### 特性

- 每个维度最大值固定为 100
- 支持多组数据叠加（通过 seriesField）

## 下钻配置

所有图表组件支持点击下钻：

1. 选中图表组件
2. 右侧属性面板 → 交互 → 点击事件 → 数据下钻
3. 配置下钻层级：
   - 层级名称（如 "区域"、"城市"）
   - 字段名（如 "region"、"city"）
   - API 接口（可选，留空使用模拟数据）
4. 勾选「显示面包屑」

### 下钻示例

```
第 1 级：各区域销售额
  点击 "华东区" →
第 2 级：华东区各城市销售额
  点击 "上海" →
第 3 级：上海各区销售额
```

面包屑：`全部数据 / 华东区 / 上海`

## 主题适配

图表颜色自动跟随主题切换：

| 主题 | 配色方案 |
|------|----------|
| dark | #2080f0, #18a058, #f0a020, #d03050, #722ed1 |
| blue | #1890ff, #52c41a, #faad14, #f5222d, #722ed1 |
| green | #52c41a, #1890ff, #faad14, #f5222d, #722ed1 |
| purple | #722ed1, #1890ff, #52c41a, #f5222d, #13c2c2 |

轴线、标签、分割线颜色自动适配主题的 `border` 和 `textSecondary`。
