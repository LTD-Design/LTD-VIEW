# 表单组件

## 筛选器 (form-filter)

多字段表单容器，支持多种字段类型和联动。

### 默认配置

```javascript
{
  type: 'form-filter',
  name: '筛选器',
  defaultProps: {
    layout: 'inline',
    labelWidth: 80,
    fields: [
      {
        key: 'dateRange',
        type: 'daterange',
        label: '日期范围',
        placeholder: '选择日期范围'
      },
      {
        key: 'category',
        type: 'select',
        label: '产品类别',
        placeholder: '请选择',
        options: [
          { label: '全部', value: '' },
          { label: '电子产品', value: 'electronics' },
          { label: '食品', value: 'food' },
          { label: '服装', value: 'clothing' }
        ]
      }
    ]
  },
  defaultSize: { width: 600, height: 100 }
}
```

### 布局

| 布局 | 说明 |
|------|------|
| inline | 行内排列 |
| horizontal | 水平排列（标签在左） |
| vertical | 垂直排列（标签在上） |

### 字段类型

| 类型 | 说明 | 额外属性 |
|------|------|----------|
| input | 输入框 | - |
| select | 下拉选择 | options: [{label, value}] |
| date | 日期选择 | dateType: 'date'/'datetime' |
| daterange | 日期范围 | - |
| switch | 开关 | - |
| slider | 滑块 | min, max, step |

### 字段定义

```typescript
interface FormField {
  key: string           // 字段标识
  type: string          // 字段类型
  label: string         // 标签文本
  placeholder: string   // 占位文本
  required: boolean     // 是否必填
  options: OptionItem[] // 选项（select 类型）
  defaultValue: any     // 默认值
  min: number           // 最小值（slider）
  max: number           // 最大值（slider）
  step: number          // 步长（slider）
  dateType: string      // 日期类型（date）
}
```

### 表单联动

筛选器支持与画布中其他组件联动：

1. 配置 `linkage.targets`：选择要联动的组件 ID
2. 字段值变化时，自动更新目标组件的 `filterParams`
3. 目标组件根据 `filterParams` 过滤数据

### 查询/重置

- **查询**：触发 `search` 事件，携带当前所有字段值
- **重置**：清空所有字段值为默认值，触发查询

## 输入框 (form-input)

单字段输入框组件。

```javascript
{
  type: 'form-input',
  defaultProps: {
    label: '输入框',
    placeholder: '请输入',
    value: ''
  },
  defaultSize: { width: 200, height: 60 }
}
```

## 下拉选择 (form-select)

单字段下拉选择组件。

```javascript
{
  type: 'form-select',
  defaultProps: {
    label: '下拉选择',
    placeholder: '请选择',
    options: [
      { label: '选项1', value: 'opt1' },
      { label: '选项2', value: 'opt2' }
    ],
    value: null
  },
  defaultSize: { width: 200, height: 60 }
}
```

## 日期选择 (form-date)

单字段日期选择组件。

```javascript
{
  type: 'form-date',
  defaultProps: {
    label: '日期选择',
    placeholder: '请选择日期',
    type: 'date',  // date / datetime / daterange
    value: null
  },
  defaultSize: { width: 200, height: 60 }
}
```

## 配置联动

在属性面板中配置表单联动：

1. 选中表单组件
2. 属性面板 → 数据 → 联动配置
3. 选择目标组件（可多选）
4. 字段值变化时自动触发目标组件刷新

### 联动数据流

```
表单字段值变化
  → 更新 filterParams
  → 目标组件读取 filterParams
  → 目标组件过滤/刷新数据
```
