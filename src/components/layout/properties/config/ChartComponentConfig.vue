<template>
  <div class="chart-config">
    <!-- 通用图表配置 -->
    <div class="config-section">
      <div class="section-title">显示控制</div>
      <div class="config-row">
        <label>显示图例</label>
        <n-switch
          :value="getProp('showLegend', true)"
          size="small"
          @update:value="(v) => setProp('showLegend', v)"
        />
      </div>
      <div class="config-row">
        <label>显示提示框</label>
        <n-switch
          :value="getProp('showTooltip', true)"
          size="small"
          @update:value="(v) => setProp('showTooltip', v)"
        />
      </div>
    </div>

    <!-- 自定义颜色 -->
    <div class="config-section">
      <div class="section-title">自定义颜色</div>
      <div class="color-palette">
        <div v-for="(color, index) in customColors" :key="index" class="color-item">
          <n-color-picker
            :value="color"
            size="small"
            :show-alpha="false"
            @update:value="(v) => updateColor(index, v)"
          />
        </div>
        <n-button size="tiny" quaternary @click="addColor">+ 添加颜色</n-button>
      </div>
    </div>

    <!-- 图例配置 -->
    <div class="config-section">
      <div class="section-title">图例设置</div>
      <div class="config-row">
        <label>位置</label>
        <n-select
          :value="getProp('legendPosition', 'right')"
          :options="legendPositionOptions"
          size="small"
          style="flex: 1"
          @update:value="(v) => setProp('legendPosition', v)"
        />
      </div>
    </div>

    <!-- 柱状图配置 -->
    <template v-if="component.type === 'bar-chart'">
      <div class="config-section">
        <div class="section-title">柱状图设置</div>
        <div class="config-row">
          <label>柱宽</label>
          <n-input-number
            :value="getProp('barWidth', 60)"
            :min="10"
            :max="100"
            :step="5"
            size="small"
            @update:value="(v) => setProp('barWidth', v)"
          />
        </div>
        <div class="config-row">
          <label>堆叠模式</label>
          <n-switch
            :value="getProp('stack', false)"
            size="small"
            @update:value="(v) => setProp('stack', v)"
          />
        </div>
        <div class="config-row">
          <label>显示标签</label>
          <n-switch
            :value="getProp('showLabel', false)"
            size="small"
            @update:value="(v) => setProp('showLabel', v)"
          />
        </div>
      </div>
    </template>

    <!-- 折线图配置 -->
    <template v-else-if="component.type === 'line-chart'">
      <div class="config-section">
        <div class="section-title">折线图设置</div>
        <div class="config-row">
          <label>平滑曲线</label>
          <n-switch
            :value="getProp('smooth', true)"
            size="small"
            @update:value="(v) => setProp('smooth', v)"
          />
        </div>
        <div class="config-row">
          <label>线条宽度</label>
          <n-input-number
            :value="getProp('lineWidth', 2)"
            :min="1"
            :max="10"
            :step="1"
            size="small"
            @update:value="(v) => setProp('lineWidth', v)"
          />
        </div>
        <div class="config-row">
          <label>面积透明度</label>
          <n-slider
            :value="getProp('areaOpacity', 0.3)"
            :min="0"
            :max="1"
            :step="0.1"
            @update:value="(v) => setProp('areaOpacity', v)"
          />
        </div>
        <div class="config-row">
          <label>符号大小</label>
          <n-input-number
            :value="getProp('symbolSize', 6)"
            :min="0"
            :max="30"
            :step="1"
            size="small"
            @update:value="(v) => setProp('symbolSize', v)"
          />
        </div>
      </div>
    </template>

    <!-- 饼图配置 -->
    <template v-else-if="component.type === 'pie-chart'">
      <div class="config-section">
        <div class="section-title">饼图设置</div>
        <div class="config-row">
          <label>内半径 (%)</label>
          <n-input-number
            :value="getProp('innerRadius', 40)"
            :min="0"
            :max="80"
            :step="5"
            size="small"
            @update:value="(v) => setProp('innerRadius', v)"
          />
        </div>
        <div class="config-row">
          <label>外半径 (%)</label>
          <n-input-number
            :value="getProp('outerRadius', 70)"
            :min="20"
            :max="90"
            :step="5"
            size="small"
            @update:value="(v) => setProp('outerRadius', v)"
          />
        </div>
        <div class="config-row">
          <label>南丁格尔图</label>
          <n-switch
            :value="getProp('roseType', false)"
            size="small"
            @update:value="(v) => setProp('roseType', v)"
          />
        </div>
      </div>
    </template>

    <!-- 仪表盘配置 -->
    <template v-else-if="component.type === 'gauge-chart'">
      <div class="config-section">
        <div class="section-title">仪表盘设置</div>
        <div class="config-row">
          <label>最小值</label>
          <n-input-number
            :value="getProp('min', 0)"
            size="small"
            @update:value="(v) => setProp('min', v)"
          />
        </div>
        <div class="config-row">
          <label>最大值</label>
          <n-input-number
            :value="getProp('max', 100)"
            size="small"
            @update:value="(v) => setProp('max', v)"
          />
        </div>
        <div class="config-row">
          <label>分割段数</label>
          <n-input-number
            :value="getProp('splitNumber', 10)"
            :min="1"
            :max="30"
            :step="1"
            size="small"
            @update:value="(v) => setProp('splitNumber', v)"
          />
        </div>
      </div>
    </template>

    <!-- 雷达图配置 -->
    <template v-else-if="component.type === 'radar-chart'">
      <div class="config-section">
        <div class="section-title">雷达图设置</div>
        <div class="config-row">
          <label>形状</label>
          <n-select
            :value="getProp('shape', 'polygon')"
            :options="radarShapeOptions"
            size="small"
            style="flex: 1"
            @update:value="(v) => setProp('shape', v)"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { NColorPicker, NSelect, NSwitch, NSlider, NInputNumber, NButton } from 'naive-ui'
import { useCanvasStore } from '@/stores/canvas'

const props = defineProps({
  component: { type: Object, required: true }
})

const canvasStore = useCanvasStore()

const getProp = (key, defaultVal) => props.component.props?.[key] ?? defaultVal

const setProp = (key, value) => {
  canvasStore.updateComponentProps(props.component.id, { [key]: value })
}

const customColors = computed(() => props.component.props?.customColors || [])

const addColor = () => {
  const colors = [...customColors.value, '#2080f0']
  setProp('customColors', colors)
}

const updateColor = (index, value) => {
  const colors = [...customColors.value]
  colors[index] = value
  setProp('customColors', colors)
}

const legendPositionOptions = [
  { label: '上方', value: 'top' },
  { label: '下方', value: 'bottom' },
  { label: '左侧', value: 'left' },
  { label: '右侧', value: 'right' }
]

const radarShapeOptions = [
  { label: '多边形', value: 'polygon' },
  { label: '圆形', value: 'circle' }
]
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.chart-config {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.config-section {
  .section-title {
    font-size: $font-size-xs;
    color: $text-muted;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: $spacing-sm;
    padding-bottom: $spacing-xs;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }
}

.config-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: $spacing-sm;

  label {
    font-size: $font-size-sm;
    color: $text-secondary;
  }
}

.color-palette {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-xs;
  align-items: center;
}

.color-item {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  overflow: hidden;
}
</style>
