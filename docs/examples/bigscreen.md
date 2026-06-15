# 示例：数据大屏

本示例展示如何构建一个深色科技风数据大屏。

## 设计要点

- 深色背景 (#0a1929)
- 霓虹蓝主色调
- 卡片式布局，半透明背景
- 数字翻牌器突出关键指标
- 大字体标题

## 布局设计

```
┌──────────────────────────────────────────────────────┐
│                    数据大屏标题                        │
├──────┬──────┬──────┬──────┬──────┬──────┬────────────┤
│ 翻牌 │ 翻牌 │ 翻牌 │ 翻牌 │ 翻牌 │ 翻牌 │   翻牌     │
│  总销 │ 总量 │ 客户 │ 订单 │ 均价 │ 增长 │   达成率   │
├──────┴──────┴──────┴──────┴──────┴──────┴────────────┤
│                                                      │
│    柱状图（区域对比）      │    饼图（产品占比）       │
│                           │                          │
├───────────────────────────┼──────────────────────────┤
│                           │                          │
│    折线图（趋势）          │    表格（排名）           │
│                           │                          │
└───────────────────────────┴──────────────────────────┘
```

## 画布配置

```json
{
  "name": "销售数据大屏",
  "width": 1920,
  "height": 1080,
  "background": "#0a1929",
  "theme": "dark",
  "components": [
    {
      "type": "title",
      "x": 0, "y": 20, "width": 1920, "height": 60,
      "props": { "text": "2024年度销售数据大屏", "level": 1, "align": "center", "color": "#4fc3f7" }
    },
    {
      "type": "number",
      "x": 60, "y": 100, "width": 220, "height": 100,
      "props": { "value": 12500000, "prefix": "¥", "suffix": "", "duration": 2000 },
      "style": { "background": "rgba(13,25,45,0.8)", "borderStyle": "solid", "borderColor": "#1e3a5f", "borderRadius": 8 }
    },
    {
      "type": "number",
      "x": 310, "y": 100, "width": 220, "height": 100,
      "props": { "value": 52800, "prefix": "", "suffix": "件", "duration": 2000 },
      "style": { "background": "rgba(13,25,45,0.8)", "borderStyle": "solid", "borderColor": "#1e3a5f", "borderRadius": 8 }
    },
    {
      "type": "bar-chart",
      "x": 60, "y": 240, "width": 880, "height": 380,
      "props": { "title": "区域销售额对比", "theme": "dark" },
      "style": { "background": "rgba(13,25,45,0.8)", "borderStyle": "solid", "borderColor": "#1e3a5f", "borderRadius": 8 }
    },
    {
      "type": "pie-chart",
      "x": 980, "y": 240, "width": 880, "height": 380,
      "props": { "title": "产品类别占比", "theme": "dark" },
      "style": { "background": "rgba(13,25,45,0.8)", "borderStyle": "solid", "borderColor": "#1e3a5f", "borderRadius": 8 }
    },
    {
      "type": "line-chart",
      "x": 60, "y": 640, "width": 880, "height": 380,
      "props": { "title": "月度销售趋势", "theme": "dark", "smooth": true },
      "style": { "background": "rgba(13,25,45,0.8)", "borderStyle": "solid", "borderColor": "#1e3a5f", "borderRadius": 8 }
    },
    {
      "type": "data-table",
      "x": 980, "y": 640, "width": 880, "height": 380,
      "props": {
        "title": "区域销售排名",
        "pagination": false,
        "sorting": true,
        "filtering": false,
        "stripe": true,
        "border": true
      },
      "style": { "background": "rgba(13,25,45,0.8)", "borderStyle": "solid", "borderColor": "#1e3a5f", "borderRadius": 8 }
    }
  ]
}
```

## 样式要点

### 卡片背景

```javascript
{
  background: 'rgba(13, 25, 45, 0.8)',  // 半透明深蓝
  borderStyle: 'solid',
  borderColor: '#1e3a5f',                // 低饱和蓝边框
  borderRadius: 8
}
```

### 主题配色

使用 `dark` 主题，颜色方案：
- 主色：#2080f0（科技蓝）
- 成功：#18a058（绿色）
- 警告：#f0a020（橙色）
- 危险：#d03050（红色）

## 全屏展示

1. 点击「预览」进入预览模式
2. 按 F11 或点击「全屏」按钮
3. 控制栏 3 秒后自动隐藏
4. 鼠标移动显示控制栏
5. 按 ESC 退出全屏

## 分辨率适配

大屏通常使用 1920x1080 分辨率。在预览模式中：

- 选择「适应窗口」模式，自动缩放适配当前屏幕
- 选择「填充窗口」模式，铺满屏幕（可能裁切边缘）
- 选择「宽度适配」模式，宽度铺满保持比例
