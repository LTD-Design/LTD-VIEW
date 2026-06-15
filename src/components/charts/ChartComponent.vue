<template>
  <div class="chart-component">
    <!-- 面包屑导航 -->
    <DrillBreadcrumb
      v-if="showBreadcrumb && breadcrumb.length > 0"
      :breadcrumb="breadcrumb"
      @drill-to="handleDrillTo"
    />

    <div class="chart-title" v-if="config.props?.title && breadcrumb.length === 0">
      {{ config.props.title }}
    </div>
    <div class="chart-title" v-else-if="breadcrumb.length > 0">
      {{ breadcrumb[breadcrumb.length - 1].name }}
    </div>

    <div class="chart-content" ref="chartRef"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import * as echarts from 'echarts'
import { getChartColors, getThemeConfig } from '@/config/themes'
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

const emit = defineEmits(['drill-down', 'data-click'])

const chartRef = ref(null)
let chartInstance = null
let resizeObserver = null
const dataStore = useDataStore()
const canvasStore = useCanvasStore()

// 下钻相关
const showBreadcrumb = computed(() => {
  return props.config.interaction?.click?.showBreadcrumb ?? true
})

const breadcrumb = computed(() => {
  return dataStore.getBreadcrumb(props.config.id)
})

// 获取图表数据（优先使用 dataStore 中的实时数据）
const getChartData = () => {
  const storeData = dataStore.getComponentData(props.config.id)
  if (storeData && storeData.length > 0) return storeData

  // 回退到组件自身数据
  const source = props.config.data?.source || []
  if (source.length > 0) return source

  // 默认示例数据
  return [
    { name: '华东区', value: 125000 },
    { name: '华北区', value: 89000 },
    { name: '华南区', value: 156000 },
    { name: '华中区', value: 67000 },
    { name: '西南区', value: 45000 }
  ]
}

const getChartOption = () => {
  const data = getChartData()
  const themeName = props.config.props?.theme || 'dark'
  const colors = getChartColors(themeName)
  const themeConfig = getThemeConfig(themeName)
  const showLegend = props.config.props?.showLegend ?? true
  const showTooltip = props.config.props?.showTooltip ?? true

  const tooltip = showTooltip ? { trigger: 'axis' } : undefined
  const legend = showLegend ? {
    textStyle: { color: themeConfig.textSecondary }
  } : undefined

  const axisCommon = {
    axisLine: { lineStyle: { color: themeConfig.border } },
    axisLabel: { color: themeConfig.textSecondary }
  }

  switch (props.type) {
    case 'bar-chart':
      return {
        color: colors,
        tooltip,
        legend,
        xAxis: {
          type: 'category',
          data: data.map(d => d.name),
          ...axisCommon
        },
        yAxis: {
          type: 'value',
          ...axisCommon,
          splitLine: { lineStyle: { color: themeConfig.border } }
        },
        series: [{
          type: 'bar',
          data: data.map(d => d.value),
          barWidth: '60%',
          itemStyle: { borderRadius: [4, 4, 0, 0] }
        }],
        grid: { left: 50, right: 20, top: showLegend ? 40 : 20, bottom: 30 }
      }

    case 'line-chart':
      return {
        color: colors,
        tooltip,
        legend,
        xAxis: {
          type: 'category',
          data: data.map(d => d.name),
          ...axisCommon
        },
        yAxis: {
          type: 'value',
          ...axisCommon,
          splitLine: { lineStyle: { color: themeConfig.border } }
        },
        series: [{
          type: 'line',
          data: data.map(d => d.value),
          smooth: props.config.props?.smooth ?? true,
          areaStyle: { opacity: 0.3 }
        }],
        grid: { left: 50, right: 20, top: showLegend ? 40 : 20, bottom: 30 }
      }

    case 'pie-chart':
      return {
        color: colors,
        tooltip: showTooltip ? { trigger: 'item' } : undefined,
        legend: showLegend ? {
          orient: 'vertical',
          right: 10,
          top: 'center',
          textStyle: { color: themeConfig.textSecondary }
        } : undefined,
        series: [{
          type: 'pie',
          radius: ['40%', '70%'],
          data: data.map(d => ({ name: d.name, value: d.value })),
          label: { color: themeConfig.textSecondary }
        }]
      }

    case 'gauge-chart':
      return {
        series: [{
          type: 'gauge',
          min: props.config.props?.min || 0,
          max: props.config.props?.max || 100,
          data: [{ value: data[0]?.value || 50 }],
          axisLine: {
            lineStyle: {
              width: 10,
              color: [[0.3, '#18a058'], [0.7, '#f0a020'], [1, '#d03050']]
            }
          },
          pointer: { width: 4 },
          detail: { color: themeConfig.text }
        }]
      }

    case 'radar-chart':
      return {
        color: colors,
        tooltip: showTooltip ? {} : undefined,
        legend: showLegend ? {
          textStyle: { color: themeConfig.textSecondary }
        } : undefined,
        radar: {
          indicator: data.map(d => ({ name: d.name, max: 100 })),
          axisLine: { lineStyle: { color: themeConfig.border } },
          splitLine: { lineStyle: { color: themeConfig.border } },
          axisName: { color: themeConfig.textSecondary }
        },
        series: [{
          type: 'radar',
          data: [{ value: data.map(d => d.value), name: '数据' }]
        }]
      }

    default:
      return {}
  }
}

const initChart = () => {
  if (!chartRef.value) return
  chartInstance = echarts.init(chartRef.value)
  chartInstance.setOption(getChartOption())

  // 绑定点击事件（下钻）
  bindChartEvents()
}

const bindChartEvents = () => {
  if (!chartInstance) return

  const clickConfig = props.config.interaction?.click

  chartInstance.on('click', (params) => {
    // 发送点击事件
    emit('data-click', {
      type: props.type,
      name: params.name,
      value: params.value,
      dataIndex: params.dataIndex,
      componentId: props.config.id
    })

    // 下钻处理
    if (clickConfig?.type === 'drillDown') {
      handleDrillClick(params.name, clickConfig)
    }
  })
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
    updateChart()
    emit('drill-down', {
      componentId: props.config.id,
      value,
      breadcrumb: result.breadcrumb
    })

    // 联动其他组件
    handleLinkage()
  }
}

const handleDrillTo = (targetLevel) => {
  const result = dataStore.drillToLevel(props.config.id, targetLevel)
  updateChart()

  emit('drill-down', {
    componentId: props.config.id,
    breadcrumb: result.breadcrumb
  })
}

// 联动其他组件刷新
const handleLinkage = () => {
  const linkageTargets = props.config.interaction?.click?.targets
  if (!linkageTargets?.length) return

  linkageTargets.forEach(targetId => {
    const target = canvasStore.components.find(c => c.id === targetId)
    if (target) {
      // 触发目标组件刷新数据
      dataStore.initComponentData(target)
    }
  })
}

const updateChart = () => {
  if (chartInstance) {
    chartInstance.setOption(getChartOption(), true)
    // 重新绑定事件（因为 setOption 会重置事件）
    bindChartEvents()
  }
}

const handleResize = () => {
  if (chartInstance) {
    chartInstance.resize()
  }
}

onMounted(() => {
  initChart()
  window.addEventListener('resize', handleResize)

  // 监听容器尺寸变化（拖拽调整大小时触发）
  if (chartRef.value) {
    resizeObserver = new ResizeObserver(() => {
      if (chartInstance) {
        chartInstance.resize()
      }
    })
    resizeObserver.observe(chartRef.value)
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
})

// 监听数据和属性变化
watch(
  () => [props.config.data, props.config.props, dataStore.getComponentData(props.config.id)],
  () => updateChart(),
  { deep: true }
)

// 初始化数据
onMounted(async () => {
  if (props.config.data?.type === 'api') {
    await dataStore.initComponentData(props.config)
  }
})
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.chart-component {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: $spacing-xs;
}

.chart-title {
  font-size: $font-size-md;
  font-weight: 500;
  color: $text-primary;
  padding: $spacing-xs $spacing-sm;
  flex-shrink: 0;
}

.chart-content {
  flex: 1;
  min-height: 0;
}
</style>
