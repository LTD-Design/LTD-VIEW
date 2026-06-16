<template>
  <div class="datav-config">
    <!-- DataV 边框配置 -->
    <template v-if="component.type === 'datav-border'">
      <PropertySection title="边框样式">
        <div class="property-row">
          <span class="property-label">类型</span>
          <n-select
            :value="component.props?.borderType || 'border-1'"
            size="small"
            :options="borderTypeOptions"
            @update:value="(val) => updateProp('borderType', val)"
          />
        </div>
        <div class="property-row">
          <span class="property-label">颜色</span>
          <n-color-picker
            :value="component.props?.color || '#2080f0'"
            size="small"
            @update:value="(val) => updateProp('color', val)"
          />
        </div>
        <div class="property-row">
          <span class="property-label">背景色</span>
          <n-color-picker
            :value="component.props?.backgroundColor || 'transparent'"
            size="small"
            :show-alpha="true"
            @update:value="(val) => updateProp('backgroundColor', val)"
          />
        </div>
      </PropertySection>
    </template>

    <!-- DataV 装饰器配置 -->
    <template v-if="component.type === 'datav-decoration'">
      <PropertySection title="装饰器样式">
        <div class="property-row">
          <span class="property-label">类型</span>
          <n-select
            :value="component.props?.decorationType || 'decoration-1'"
            size="small"
            :options="decorationTypeOptions"
            @update:value="(val) => updateProp('decorationType', val)"
          />
        </div>
        <div class="property-row">
          <n-checkbox
            :checked="component.props?.reverse"
            @update:checked="(val) => updateProp('reverse', val)"
          >
            反向
          </n-checkbox>
        </div>
      </PropertySection>
    </template>

    <!-- DataV 轮播表格配置 -->
    <template v-if="component.type === 'datav-scroll-board'">
      <PropertySection title="表格配置">
        <div class="property-row">
          <span class="property-label">行数</span>
          <n-input-number
            :value="component.props?.rowNum || 5"
            size="small"
            :min="1"
            :max="20"
            @update:value="(val) => updateProp('rowNum', val)"
          />
        </div>
        <div class="property-row">
          <span class="property-label">等待时间</span>
          <n-input-number
            :value="component.props?.waitTime || 2000"
            size="small"
            :min="500"
            :step="500"
            @update:value="(val) => updateProp('waitTime', val)"
          />
        </div>
        <div class="property-row">
          <n-checkbox
            :checked="component.props?.autoPlay !== false"
            @update:checked="(val) => updateProp('autoPlay', val)"
          >
            自动轮播
          </n-checkbox>
        </div>
        <div class="property-row">
          <span class="property-label">头部背景</span>
          <n-color-picker
            :value="component.props?.headerBGC || '#1e3a5f'"
            size="small"
            @update:value="(val) => updateProp('headerBGC', val)"
          />
        </div>
        <div class="property-row">
          <span class="property-label">头部文字</span>
          <n-color-picker
            :value="component.props?.headerColor || '#4fc3f7'"
            size="small"
            @update:value="(val) => updateProp('headerColor', val)"
          />
        </div>
      </PropertySection>
    </template>

    <!-- DataV 数字翻牌器配置 -->
    <template v-if="component.type === 'datav-digital-flop'">
      <PropertySection title="翻牌器配置">
        <div class="property-row">
          <span class="property-label">数值</span>
          <n-input-number
            :value="component.props?.value || 0"
            size="small"
            @update:value="(val) => updateProp('value', val)"
          />
        </div>
        <div class="property-row">
          <span class="property-label">小数位</span>
          <n-input-number
            :value="component.props?.decimals || 0"
            size="small"
            :min="0"
            :max="10"
            @update:value="(val) => updateProp('decimals', val)"
          />
        </div>
        <div class="property-row">
          <span class="property-label">字号</span>
          <n-input-number
            :value="component.props?.fontSize || 32"
            size="small"
            :min="12"
            :max="120"
            @update:value="(val) => updateProp('fontSize', val)"
          />
        </div>
      </PropertySection>
    </template>

    <!-- DataV 水球图配置 -->
    <template v-if="component.type === 'datav-water-ball'">
      <PropertySection title="水球图配置">
        <div class="property-row">
          <span class="property-label">水位</span>
          <n-slider
            :value="component.props?.percent || 50"
            :min="0"
            :max="100"
            @update:value="(val) => updateProp('percent', val)"
          />
        </div>
        <div class="property-row">
          <span class="property-label">百分比</span>
          <span class="property-value">{{ component.props?.percent || 50 }}%</span>
        </div>
      </PropertySection>
    </template>

    <!-- DataV 加载动画配置 -->
    <template v-if="component.type === 'datav-loading'">
      <PropertySection title="加载动画配置">
        <div class="property-row">
          <span class="property-label">尺寸</span>
          <n-input-number
            :value="component.props?.size || 60"
            size="small"
            :min="20"
            :max="200"
            @update:value="(val) => updateProp('size', val)"
          />
        </div>
      </PropertySection>
    </template>
  </div>
</template>

<script setup>
import { useCanvasStore } from '@/stores/canvas'
import PropertySection from '../PropertySection.vue'

const props = defineProps({
  component: {
    type: Object,
    required: true
  }
})

const canvasStore = useCanvasStore()

const updateProp = (key, value) => {
  canvasStore.updateComponentProps(props.component.id, {
    [key]: value
  })
}

const borderTypeOptions = [
  { label: '基础边框', value: 'border-1' },
  { label: '渐变边框', value: 'border-2' },
  { label: '双层边框', value: 'border-3' },
  { label: '科技感边框', value: 'border-4' },
  { label: '圆角边框', value: 'border-5' },
  { label: '六角边框', value: 'border-6' },
  { label: '简约边框', value: 'border-7' },
  { label: '动态边框', value: 'border-8' },
  { label: '飘带边框', value: 'border-9' },
  { label: '炫光边框', value: 'border-10' },
  { label: '三角边框', value: 'border-11' },
  { label: '菱形边框', value: 'border-12' },
  { label: '完整边框', value: 'border-13' }
]

const decorationTypeOptions = [
  { label: '线条装饰', value: 'decoration-1' },
  { label: '渐变线条', value: 'decoration-2' },
  { label: '分叉装饰', value: 'decoration-3' },
  { label: '矩阵装饰', value: 'decoration-4' },
  { label: '波浪装饰', value: 'decoration-5' },
  { label: '飞线装饰', value: 'decoration-6' },
  { label: '阶梯装饰', value: 'decoration-7' },
  { label: '三角装饰', value: 'decoration-8' },
  { label: '点阵装饰', value: 'decoration-9' },
  { label: '环形装饰', value: 'decoration-10' }
]
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.property-row {
  display: flex;
  align-items: center;
  margin-bottom: $spacing-sm;
}

.property-label {
  width: 80px;
  font-size: $font-size-sm;
  color: $text-muted;
  flex-shrink: 0;
}

.property-value {
  font-size: $font-size-sm;
  color: $text-secondary;
}
</style>
