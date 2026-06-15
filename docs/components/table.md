# 表格组件

## 数据表格 (data-table)

基于 Naive UI DataTable 封装，支持排序、筛选、分页、下钻。

### 默认配置

```javascript
{
  type: 'data-table',
  name: '数据表格',
  category: 'table',
  defaultProps: {
    title: '数据表格',
    pagination: true,
    pageSize: 10,
    sorting: true,
    filtering: true,
    stripe: true,
    border: true,
    columns: [
      { key: 'region', title: '区域', sortable: true, filterable: true },
      { key: 'product', title: '产品', sortable: true, filterable: true },
      { key: 'sales', title: '销售额', sortable: true, align: 'right', formatter: 'currency' },
      { key: 'count', title: '销量', sortable: true, align: 'right' }
    ]
  },
  defaultSize: { width: 800, height: 400 }
}
```

### 数据格式

```json
[
  { "id": 1, "region": "华东区", "product": "电子产品", "sales": 125000, "count": 520 },
  { "id": 2, "region": "华北区", "product": "食品", "sales": 89000, "count": 380 }
]
```

### 列定义

```typescript
interface ColumnDef {
  key: string          // 字段名
  title: string        // 列标题
  width: number        // 列宽
  sortable: boolean    // 可排序
  filterable: boolean  // 可筛选
  align: 'left' | 'center' | 'right'
  formatter: string    // 格式化（支持 'currency'）
}
```

### 属性配置

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| title | string | '数据表格' | 表格标题 |
| pagination | boolean | true | 启用分页 |
| pageSize | number | 10 | 每页条数 |
| sorting | boolean | true | 启用排序 |
| filtering | boolean | true | 启用筛选 |
| stripe | boolean | true | 斑马纹 |
| border | boolean | true | 边框 |
| columns | ColumnDef[] | [...] | 列定义 |

### 排序

- 单击表头：升序 → 降序 → 取消
- 仅对 `sortable: true` 的列生效
- 数值列按数值排序，字符串按 localeCompare 排序

### 筛选

- 当 `filtering: true` 时，表格上方显示筛选栏
- 筛选栏自动从数据中提取可选值
- 支持多选筛选
- `filterable: true` 的列才会显示筛选器

### 分页

- `pagination: true` 时显示底部分页
- 支持切换每页条数：10 / 20 / 50
- 显示总条数

## 排名列表 (rank-list)

用于展示排名数据。

### 默认配置

```javascript
{
  type: 'rank-list',
  name: '排名列表',
  defaultProps: {
    title: '排名列表',
    showNumber: true,
    animation: true
  },
  defaultSize: { width: 400, height: 400 }
}
```

## 下钻配置

表格组件支持行点击下钻：

1. 选中表格组件
2. 右侧属性面板 → 交互 → 点击事件 → 数据下钻
3. 配置下钻层级
4. 设置参数名（默认使用第一列字段名）

### 下钻示例

```
点击 "华东区" 行 →
表格切换为华东区各城市数据
面包屑：全部数据 > 华东区
```

### 联动其他组件

在下钻配置中选择「联动组件」，下钻时会自动刷新选中的目标组件。
