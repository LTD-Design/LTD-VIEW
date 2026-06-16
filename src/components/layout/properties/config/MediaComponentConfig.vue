<template>
  <div class="media-config">
    <div class="config-section">
      <div class="section-title">图片设置</div>
      <div class="config-row">
        <label>图片地址</label>
        <n-input
          :value="getProp('src', '')"
          size="small"
          placeholder="https://..."
          @update:value="(v) => setProp('src', v)"
        />
      </div>
      <div class="config-row">
        <label>填充方式</label>
        <n-select
          :value="getProp('fit', 'contain')"
          :options="fitOptions"
          size="small"
          style="flex: 1"
          @update:value="(v) => setProp('fit', v)"
        />
      </div>
      <div class="config-row">
        <label>替代文字</label>
        <n-input
          :value="getProp('alt', '')"
          size="small"
          placeholder="alt text"
          @update:value="(v) => setProp('alt', v)"
        />
      </div>
      <div class="config-row">
        <label>圆角</label>
        <n-input-number
          :value="getProp('borderRadius', 0)"
          :min="0"
          :max="100"
          size="small"
          @update:value="(v) => setProp('borderRadius', v)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { NInput, NSelect, NInputNumber } from 'naive-ui'
import { useCanvasStore } from '@/stores/canvas'

const props = defineProps({
  component: { type: Object, required: true }
})

const canvasStore = useCanvasStore()

const getProp = (key, defaultVal) => props.component.props?.[key] ?? defaultVal
const setProp = (key, value) =>
  canvasStore.updateComponentProps(props.component.id, { [key]: value })

const fitOptions = [
  { label: '包含', value: 'contain' },
  { label: '覆盖', value: 'cover' },
  { label: '填充', value: 'fill' },
  { label: '无', value: 'none' }
]
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.media-config {
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
