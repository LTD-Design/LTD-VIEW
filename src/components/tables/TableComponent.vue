<template>
  <div class="table-component">
    <!-- 面包屑导航 -->
    <DrillBreadcrumb
      v-if="showBreadcrumb && breadcrumb.length > 0"
      :breadcrumb="breadcrumb"
      @drill-to="handleDrillTo"
    />

    <div class="table-title" v-if="config.props?.title">
      {{ config.props.title }}
    </div>

    <!-- 列筛选栏 -->
    <div class="table-filters" v-if="config.props?.filtering && filterableColumns.length > 0">
      <n-select
        v-for="col in filterableColumns"
        :key="col.key"
        v-model:value="filterValues[col.key]"
        :placeholder="`筛选${col.title}`"
        size="tiny"
        clearable
        multiple
        :options="getFilterOptions(col.key)"
        class="filter-select"
      />
    </div>

    <div class="table-content">
      <n-data-table
        :columns="columns"
        :data="filteredData"
        :bordered="config.props?.border"
        :striped="config.props?.stripe"
        :pagination="pagination"
        :row-props="rowProps"
        size="small"
        :checked-row-keys="checkedKeys"
        @update:checked-row-keys="handleCheck"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { NDataTable } from 'naive-ui'
import { useDataStore } from '@/stores/data'
import { useCanvasStore } from '@/stores/canvas'
import DrillBreadcrumb from '@/components/base/DrillBreadcrumb.vue'

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

const emit = defineEmits(['cell-click', 'row-click', 'drill-down'])

const dataStore = useDataStore()
const canvasStore = useCanvasStore()

const checkedKeys = ref([])
const filterValues = ref({})

// 下钻相关
const showBreadcrumb = computed(() => {
  return props.config.interaction?.click?.showBreadcrumb ?? true
})

const breadcrumb = computed(() => {
  return dataStore.getBreadcrumb(props.config.id)
})

// 表格数据
const rawData = computed(() => {
  // 优先使用 dataStore 中的数据（可能经过下钻或筛选）
  const storeData = dataStore.getComponentData(props.config.id)
  if (storeData && storeData.length > 0) return storeData

  if (props.config.data?.source?.length > 0) {
    return props.config.data.source
  }

  return [
    { id: 1, region: '华东区', product: '电子产品', sales: 125000, count: 520 },
    { id: 2, region: '华北区', product: '食品', sales: 89000, count: 380 },
    { id: 3, region: '华南区', product: '电子产品', sales: 156000, count: 650 },
    { id: 4, region: '华中区', product: '服装', sales: 67000, count: 290 },
    { id: 5, region: '西南区', product: '食品', sales: 45000, count: 180 },
    { id: 6, region: '西北区', product: '电子产品', sales: 32000, count: 140 },
    { id: 7, region: '东北区', product: '服装', sales: 51000, count: 220 }
  ]
})

// 可筛选的列
const filterableColumns = computed(() => {
  if (!props.config.props?.filtering) return []
  if (props.config.props?.columns?.length > 0) {
    return props.config.props.columns.filter(col => col.filterable)
  }
  return [
    { key: 'region', title: '区域' },
    { key: 'product', title: '产品' }
  ]
})

const getFilterOptions = (key) => {
  const values = [...new Set(rawData.value.map(d => d[key]).filter(Boolean))]
  return values.map(v => ({ label: v, value: v }))
}

// 筛选后的数据
const filteredData = computed(() => {
  let data = [...rawData.value]

  Object.keys(filterValues.value).forEach(key => {
    const values = filterValues.value[key]
    if (values && values.length > 0) {
      data = data.filter(d => values.includes(d[key]))
    }
  })

  return data
})

// 列配置
const columns = computed(() => {
  if (props.config.props?.columns?.length > 0) {
    return props.config.props.columns.map(col => ({
      title: col.title,
      key: col.key,
      width: col.width,
      align: col.align || 'left',
      sorter: props.config.props?.sorting ? 'default' : false,
      render: col.formatter === 'currency'
        ? (row) => `¥${Number(row[col.key]).toLocaleString()}`
        : undefined
    }))
  }

  return [
    { title: '区域', key: 'region', width: 100 },
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

// 分页
const pagination = computed(() => {
  if (!props.config.props?.pagination) return false
  return {
    page: 1,
    pageSize: props.config.props?.pageSize || 10,
    showSizePicker: true,
    pageSizes: [10, 20, 50],
    itemCount: filteredData.value.length,
    prefix: ({ itemCount }) => `共 ${itemCount} 条`
  }
})

// 行属性 - 点击触发下钻
const rowProps = (row) => ({
  style: 'cursor: pointer;',
  onClick: (e) => handleRowClick(row, e)
})

const handleRowClick = (row, event) => {
  emit('row-click', row)

  // 下钻处理
  const clickConfig = props.config.interaction?.click
  if (clickConfig?.type === 'drillDown') {
    // 确定下钻字段和值
    const field = clickConfig.paramName || Object.keys(row)[0]
    const value = row[field]
    if (value) {
      handleDrillClick(value, clickConfig)
    }
  }
}

const handleDrillClick = (value, clickConfig) => {
  const level = dataStore.getDrillLevel(props.config.id)
  const drillLevels = clickConfig.levels || []
  const currentLevel = drillLevels[level]

  if (!currentLevel) return

  const result = dataStore.executeDrillDown(
    props.config.id,
    { levels: drillLevels },
    value,
    currentLevel.field
  )

  if (result) {
    emit('drill-down', {
      componentId: props.config.id,
      value,
      breadcrumb: result.breadcrumb
    })
    handleLinkage()
  }
}

const handleDrillTo = (targetLevel) => {
  const result = dataStore.drillToLevel(props.config.id, targetLevel)
  emit('drill-down', {
    componentId: props.config.id,
    breadcrumb: result.breadcrumb
  })
}

// 联动其他组件
const handleLinkage = () => {
  const linkageTargets = props.config.interaction?.click?.targets
  if (!linkageTargets?.length) return

  linkageTargets.forEach(targetId => {
    const target = canvasStore.components.find(c => c.id === targetId)
    if (target) {
      dataStore.initComponentData(target)
    }
  })
}

const handleCheck = (keys) => {
  checkedKeys.value = keys
}

// 初始化数据
onMounted(async () => {
  if (props.config.data?.type === 'api') {
    await dataStore.initComponentData(props.config)
  }
})

watch(() => props.config.props?.columns, () => {
  filterValues.value = {}
}, { deep: true })
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
  flex-shrink: 0;
}

.table-filters {
  display: flex;
  gap: $spacing-xs;
  padding: $spacing-xs $spacing-sm;
  flex-wrap: wrap;
  flex-shrink: 0;
}

.filter-select {
  min-width: 120px;
}

.table-content {
  flex: 1;
  min-height: 0;
  overflow: auto;
}
</style>
