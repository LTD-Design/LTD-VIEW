# 文本与媒体组件

## 标题 (title)

用于展示标题文字。

### 默认配置

```javascript
{
  type: 'title',
  name: '标题',
  category: 'text',
  props: {
    text: '标题文字',
    level: 1,
    color: '#ffffff',
    align: 'left'
  },
  defaultSize: { width: 300, height: 50 }
}
```

### 属性配置

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| text | string | '标题文字' | 标题内容 |
| level | number | 1 | 标题级别（1/2/3） |
| color | string | '#ffffff' | 文字颜色 |
| align | string | 'left' | 对齐方式（left/center/right） |

## 副标题 (subtitle)

用于展示副标题或说明文字。

### 属性配置

与标题相同，默认字号 14px。

## KPI 卡片 (kpi-card)

核心指标卡片，带数字动画和趋势箭头。

### 默认配置

```javascript
{
  type: 'kpi-card',
  name: 'KPI 卡片',
  category: 'text',
  props: {
    label: '总销售额',
    value: 125800,
    prefix: '¥',
    suffix: '',
    trend: 'up',
    trendValue: 12.5,
    decimals: 0,
    fontSize: 36,
    gradientFrom: '#2080f0',
    gradientTo: '#18a058'
  },
  defaultSize: { width: 250, height: 150 }
}
```

### 属性配置

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| label | string | '指标名称' | 指标标签 |
| value | number | 0 | 指标数值 |
| prefix | string | '' | 数值前缀（如 ¥、$） |
| suffix | string | '' | 数值后缀（如 %） |
| trend | string | 'up' | 趋势方向（up/down） |
| trendValue | number | 0 | 趋势百分比 |
| decimals | number | 0 | 小数位数 |
| fontSize | number | 36 | 数字字号 |
| gradientFrom | string | '#2080f0' | 渐变起始色 |
| gradientTo | string | '#18a058' | 渐变结束色 |

## 进度条 (progress-bar)

水平或垂直进度条，支持自定义颜色。

### 默认配置

```javascript
{
  type: 'progress-bar',
  name: '进度条',
  category: 'text',
  props: {
    value: 65,
    max: 100,
    color: '#2080f0',
    trackColor: '#1e3a5f',
    showLabel: true,
    direction: 'horizontal',
    height: 20,
    borderRadius: 10
  },
  defaultSize: { width: 400, height: 40 }
}
```

### 属性配置

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| value | number | 0 | 当前值 |
| max | number | 100 | 最大值 |
| color | string | '#2080f0' | 进度条颜色 |
| trackColor | string | '#1e3a5f' | 轨道颜色 |
| showLabel | boolean | true | 显示百分比 |
| direction | string | 'horizontal' | 方向（horizontal/vertical） |
| height | number | 20 | 进度条高度 |
| borderRadius | number | 10 | 圆角半径 |

## 图片 (image)

图片展示组件，支持多种填充模式。

### 默认配置

```javascript
{
  type: 'image',
  name: '图片',
  category: 'media',
  props: {
    src: '',
    alt: '图片',
    fit: 'contain'
  },
  defaultSize: { width: 300, height: 200 }
}
```

### 填充模式 (fit)

| 模式 | 说明 |
|------|------|
| contain | 保持比例，完整显示 |
| cover | 保持比例，填满容器 |
| fill | 拉伸填满 |
| none | 原始尺寸 |
| scale-down | 取 contain 和 none 中较小的 |

## 视频 (video)

HTML5 视频播放器。

### 默认配置

```javascript
{
  type: 'video',
  name: '视频',
  category: 'media',
  props: {
    src: '',
    autoplay: false,
    loop: false,
    muted: false,
    controls: true
  },
  defaultSize: { width: 640, height: 360 }
}
```

### 属性配置

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| src | string | '' | 视频地址 |
| autoplay | boolean | false | 自动播放 |
| loop | boolean | false | 循环播放 |
| muted | boolean | false | 静音 |
| controls | boolean | true | 显示控件 |

## 排名列表 (rank-list)

带动画效果的排名列表，前三名显示金银铜色。

### 默认配置

```javascript
{
  type: 'rank-list',
  name: '排名列表',
  category: 'table',
  props: {
    title: '排名列表',
    showNumber: true,
    animation: true
  },
  defaultSize: { width: 400, height: 400 }
}
```

### 数据格式

```json
[
  { "name": "华东区", "value": 125000 },
  { "name": "华南区", "value": 156000 },
  { "name": "华北区", "value": 89000 }
]
```

### 属性配置

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| title | string | '排名列表' | 列表标题 |
| showNumber | boolean | true | 显示排名数字 |
| animation | boolean | true | 入场动画 |

## 容器组件

### 卡片 (card)

带标题的容器卡片。

```javascript
{
  type: 'card',
  name: '卡片',
  category: 'container',
  props: {
    title: '卡片标题'
  },
  defaultSize: { width: 400, height: 300 }
}
```

### 标签页容器 (tab-container)

多标签页切换容器。

```javascript
{
  type: 'tab-container',
  name: '标签页',
  category: 'container',
  props: {
    tabs: [
      { label: '标签1', value: 'tab1' },
      { label: '标签2', value: 'tab2' }
    ],
    activeTab: 'tab1'
  },
  defaultSize: { width: 500, height: 400 }
}
```

### 跑马灯 (marquee)

水平滚动文字。

```javascript
{
  type: 'marquee',
  name: '跑马灯',
  category: 'container',
  props: {
    text: '欢迎使用 LtdView BI 报表生成系统',
    speed: 50,
    direction: 'left'
  },
  defaultSize: { width: 600, height: 40 }
}
```

## 装饰组件

### 边框 (border)

基础边框装饰。

```javascript
{
  type: 'border',
  name: '边框',
  category: 'decorator',
  props: {
    style: 'solid',
    width: 1,
    color: '#2080f0',
    radius: 0
  },
  defaultSize: { width: 400, height: 300 }
}
```

### 分割线 (divider)

水平或垂直分割线。

```javascript
{
  type: 'divider',
  name: '分割线',
  category: 'decorator',
  props: {
    direction: 'horizontal',
    width: 1,
    color: '#2080f0'
  },
  defaultSize: { width: 400, height: 2 }
}
```
