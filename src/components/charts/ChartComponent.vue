<template>
  <div class="chart-component">
    <div class="chart-title" v-if="config.props?.title">
      {{ config.props.title }}
    </div>
    <div class="chart-content" ref="chartRef"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'

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

const chartRef = ref(null)
let chartInstance = null

const getChartOption = () => {
  const data = props.config.data?.source || [
    { name: 'A', value: 100 },
    { name: 'B', value: 80 },
    { name: 'C', value: 60 },
    { name: 'D', value: 40 },
    { name: 'E', value: 20 }
  ]

  const colors = ['#2080f0', '#18a058', '#f0a020', '#d03050', '#722ed1', '#13c2c2']

  switch (props.type) {
    case 'bar-chart':
      return {
        color: colors,
        tooltip: { trigger: 'axis' },
        xAxis: {
          type: 'category',
          data: data.map(d => d.name),
          axisLine: { lineStyle: { color: '#1e3a5f' } },
          axisLabel: { color: '#a0aec0' }
        },
        yAxis: {
          type: 'value',
          axisLine: { lineStyle: { color: '#1e3a5f' } },
          axisLabel: { color: '#a0aec0' },
          splitLine: { lineStyle: { color: '#1e3a5f' } }
        },
        series: [{
          type: 'bar',
          data: data.map(d => d.value),
          barWidth: '60%',
          itemStyle: {
            borderRadius: [4, 4, 0, 0]
          }
        }]
      }

    case 'line-chart':
      return {
        color: colors,
        tooltip: { trigger: 'axis' },
        xAxis: {
          type: 'category',
          data: data.map(d => d.name),
          axisLine: { lineStyle: { color: '#1e3a5f' } },
          axisLabel: { color: '#a0aec0' }
        },
        yAxis: {
          type: 'value',
          axisLine: { lineStyle: { color: '#1e3a5f' } },
          axisLabel: { color: '#a0aec0' },
          splitLine: { lineStyle: { color: '#1e3a5f' } }
        },
        series: [{
          type: 'line',
          data: data.map(d => d.value),
          smooth: true,
          areaStyle: {
            opacity: 0.3
          }
        }]
      }

    case 'pie-chart':
      return {
        color: colors,
        tooltip: { trigger: 'item' },
        series: [{
          type: 'pie',
          radius: ['40%', '70%'],
          data: data.map(d => ({ name: d.name, value: d.value })),
          label: {
            color: '#a0aec0'
          }
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
          pointer: { width: 4 }
        }]
      }

    case 'radar-chart':
      return {
        color: colors,
        radar: {
          indicator: data.map(d => ({ name: d.name, max: 100 })),
          axisLine: { lineStyle: { color: '#1e3a5f' } },
          splitLine: { lineStyle: { color: '#1e3a5f' } },
          axisName: { color: '#a0aec0' }
        },
        series: [{
          type: 'radar',
          data: [{
            value: data.map(d => d.value),
            name: '数据'
          }]
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
}

const updateChart = () => {
  if (chartInstance) {
    chartInstance.setOption(getChartOption())
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
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
})

watch(
  () => props.config.data,
  () => updateChart(),
  { deep: true }
)
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
}

.chart-content {
  flex: 1;
  min-height: 0;
}
</style>
