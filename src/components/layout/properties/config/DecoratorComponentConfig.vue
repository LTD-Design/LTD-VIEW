<template>
  <div class="decorator-config">
    <!-- 边框配置 -->
    <template v-if="component.type === 'border'">
      <div class="config-section">
        <div class="section-title">边框设置</div>
        <div class="config-row">
          <label>样式</label>
          <n-select
            :value="getProp('style', 'solid')"
            :options="borderStyleOptions"
            size="small"
            style="flex: 1"
            @update:value="(v) => setProp('style', v)"
          />
        </div>
        <div class="config-row">
          <label>宽度</label>
          <n-input-number
            :value="getProp('width', 1)"
            :min="1"
            :max="10"
            size="small"
            @update:value="(v) => setProp('width', v)"
          />
        </div>
        <div class="config-row">
          <label>颜色</label>
          <n-color-picker
            :value="getProp('color', '#1e3a5f')"
            :show-alpha="false"
            size="small"
            @update:value="(v) => setProp('color', v)"
          />
        </div>
        <div class="config-row">
          <label>圆角</label>
          <n-input-number
            :value="getProp('radius', 0)"
            :min="0"
            :max="100"
            size="small"
            @update:value="(v) => setProp('radius', v)"
          />
        </div>
      </div>
    </template>

    <!-- 分割线配置 -->
    <template v-else-if="component.type === 'divider'">
      <div class="config-section">
        <div class="section-title">分割线设置</div>
        <div class="config-row">
          <label>方向</label>
          <n-select
            :value="getProp('direction', 'horizontal')"
            :options="directionOptions"
            size="small"
            style="flex: 1"
            @update:value="(v) => setProp('direction', v)"
          />
        </div>
        <div class="config-row">
          <label>粗细</label>
          <n-input-number
            :value="getProp('width', 1)"
            :min="1"
            :max="10"
            size="small"
            @update:value="(v) => setProp('width', v)"
          />
        </div>
        <div class="config-row">
          <label>颜色</label>
          <n-color-picker
            :value="getProp('color', '#1e3a5f')"
            :show-alpha="false"
            size="small"
            @update:value="(v) => setProp('color', v)"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { NSelect, NInputNumber, NColorPicker } from 'naive-ui'
import { useCanvasStore } from '@/stores/canvas'

const props = defineProps({
  component: { type: Object, required: true }
})

const canvasStore = useCanvasStore()

const getProp = (key, defaultVal) => props.component.props?.[key] ?? defaultVal
const setProp = (key, value) =>
  canvasStore.updateComponentProps(props.component.id, { [key]: value })

const borderStyleOptions = [
  { label: '实线', value: 'solid' },
  { label: '虚线', value: 'dashed' },
  { label: '点线', value: 'dotted' }
]

const directionOptions = [
  { label: '水平', value: 'horizontal' },
  { label: '垂直', value: 'vertical' }
]
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.decorator-config {
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
</style>
