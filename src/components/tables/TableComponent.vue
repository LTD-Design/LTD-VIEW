<template>
  <div class="table-component">
    <div class="table-title" v-if="config.props?.title">
      {{ config.props.title }}
    </div>
    <div class="table-content">
      <n-data-table
        :columns="columns"
        :data="tableData"
        :bordered="config.props?.border"
        :striped="config.props?.stripe"
        :pagination="pagination"
        size="small"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { NDataTable } from 'naive-ui'

const props = defineProps({
  type: {
    type: String,
    required: true
  },
  config: {
    type: Object,
    required: true
  }
})

// 模拟数据
const tableData = computed(() => {
  if (props.config.data?.source?.length > 0) {
    return props.config.data.source
  }

  return [
    { id: 1, name: '华东区', product: '电子产品', sales: 125000, count: 520 },
    { id: 2, name: '华北区', product: '食品', sales: 89000, count: 380 },
    { id: 3, name: '华南区', product: '电子产品', sales: 156000, count: 650 },
    { id: 4, name: '华中区', product: '服装', sales: 67000, count: 290 },
    { id: 5, name: '西南区', product: '食品', sales: 45000, count: 180 }
  ]
})

// 列配置
const columns = computed(() => {
  if (props.config.props?.columns?.length > 0) {
    return props.config.props.columns.map(col => ({
      title: col.title,
      key: col.key,
      width: col.width,
      align: col.align || 'left',
      sorter: col.sortable ? 'default' : false
    }))
  }

  return [
    { title: '区域', key: 'name', width: 100 },
    { title: '产品', key: 'product', width: 100 },
    {
      title: '销售额',
      key: 'sales',
      width: 120,
      align: 'right',
      sorter: (a, b) => a.sales - b.sales,
      render: (row) => `¥${row.sales.toLocaleString()}`
    },
    {
      title: '销量',
      key: 'count',
      width: 80,
      align: 'right',
      sorter: (a, b) => a.count - b.count
    }
  ]
})

// 分页配置
const pagination = computed(() => {
  if (!props.config.props?.pagination) return false

  return {
    page: 1,
    pageSize: props.config.props?.pageSize || 10,
    showSizePicker: true,
    pageSizes: [10, 20, 50],
    itemCount: tableData.value.length,
    prefix: ({ itemCount }) => `共 ${itemCount} 条`
  }
})
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.table-component {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: $spacing-xs;
}

.table-title {
  font-size: $font-size-md;
  font-weight: 500;
  color: $text-primary;
  padding: $spacing-xs $spacing-sm;
}

.table-content {
  flex: 1;
  min-height: 0;
  overflow: auto;
}
</style>
