# DataV 装饰组件

基于 [@kjgl77/datav-vue3](https://github.com/kjgl77/datav-vue3) 封装的数据可视化装饰组件，用于大屏场景的视觉增强。

## 边框 (datav-border)

科技感边框组件，提供 13 种边框样式。

### 默认配置

```javascript
{
  type: 'datav-border',
  name: 'DataV 边框',
  category: 'decorator',
  props: {
    borderType: 'border-1',
    color: '#2080f0',
    backgroundColor: 'transparent'
  },
  defaultSize: { width: 400, height: 300 }
}
```

### 边框类型

| 类型 | 说明 |
|------|------|
| border-1 | 基础边框 |
| border-2 | 渐变边框 |
| border-3 | 双层边框 |
| border-4 | 科技感边框 |
| border-5 | 圆角边框 |
| border-6 | 六角边框 |
| border-7 | 简约边框 |
| border-8 | 动态边框 |
| border-9 | 飘带边框 |
| border-10 | 炫光边框 |
| border-11 | 三角边框 |
| border-12 | 菱形边框 |
| border-13 | 完整边框 |

### 属性配置

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| borderType | string | 'border-1' | 边框类型 |
| color | string | '#2080f0' | 边框颜色 |
| backgroundColor | string | 'transparent' | 背景色 |

## 装饰器 (datav-decoration)

线条装饰组件，提供 10 种装饰样式。

### 默认配置

```javascript
{
  type: 'datav-decoration',
  name: 'DataV 装饰',
  category: 'decorator',
  props: {
    decorationType: 'decoration-1',
    color: '#2080f0',
    reverse: false
  },
  defaultSize: { width: 300, height: 30 }
}
```

### 装饰类型

| 类型 | 说明 |
|------|------|
| decoration-1 | 线条装饰 |
| decoration-2 | 渐变线条 |
| decoration-3 | 分叉装饰 |
| decoration-4 | 矩阵装饰 |
| decoration-5 | 波浪装饰 |
| decoration-6 | 飞线装饰 |
| decoration-7 | 阶梯装饰 |
| decoration-8 | 三角装饰 |
| decoration-9 | 点阵装饰 |
| decoration-10 | 环形装饰 |

### 属性配置

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| decorationType | string | 'decoration-1' | 装饰类型 |
| color | string | '#2080f0' | 装饰颜色 |
| reverse | boolean | false | 反向显示 |

## 轮播表格 (datav-scroll-board)

自动轮播的数据表格，适合大屏展示关键指标。

### 默认配置

```javascript
{
  type: 'datav-scroll-board',
  name: 'DataV 轮播表格',
  category: 'decorator',
  props: {
    header: ['名称', '数值', '趋势'],
    data: [
      ['指标A', '1,250', '↑ 12%'],
      ['指标B', '890', '↓ 5%'],
      ['指标C', '2,100', '↑ 8%']
    ],
    rowNum: 5,
    waitTime: 2000,
    autoPlay: true,
    headerBGC: '#1e3a5f',
    headerColor: '#4fc3f7'
  },
  defaultSize: { width: 500, height: 300 }
}
```

### 属性配置

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| header | string[] | [...] | 表头字段 |
| data | string[][] | [...] | 表格数据（二维数组） |
| rowNum | number | 5 | 可见行数 |
| waitTime | number | 2000 | 轮播间隔（ms） |
| autoPlay | boolean | true | 自动轮播 |
| headerBGC | string | '#1e3a5f' | 表头背景色 |
| headerColor | string | '#4fc3f7' | 表头文字颜色 |

## 数字翻牌器 (datav-digital-flop)

数字翻牌动画效果，适合展示核心指标。

### 默认配置

```javascript
{
  type: 'datav-digital-flop',
  name: 'DataV 翻牌器',
  category: 'decorator',
  props: {
    value: 12580,
    decimals: 0,
    fontSize: 32
  },
  defaultSize: { width: 200, height: 80 }
}
```

### 属性配置

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| value | number | 0 | 数值 |
| decimals | number | 0 | 小数位数 |
| fontSize | number | 32 | 字号 |

## 水球图 (datav-water-ball)

水位动画效果，适合展示百分比指标。

### 默认配置

```javascript
{
  type: 'datav-water-ball',
  name: 'DataV 水球图',
  category: 'decorator',
  props: {
    percent: 50
  },
  defaultSize: { width: 200, height: 200 }
}
```

### 属性配置

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| percent | number | 50 | 水位百分比（0-100） |

## 加载动画 (datav-loading)

科技感加载动画，适合数据加载过渡。

### 默认配置

```javascript
{
  type: 'datav-loading',
  name: 'DataV 加载动画',
  category: 'decorator',
  props: {
    size: 60
  },
  defaultSize: { width: 100, height: 100 }
}
```

### 属性配置

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| size | number | 60 | 动画尺寸 |
