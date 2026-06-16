<template>
  <div class="container-config">
    <div class="config-section">
      <div class="section-title">卡片设置</div>
      <div class="config-row">
        <label>标题</label>
        <n-input
          :value="getProp('title', '')"
          size="small"
          placeholder="卡片标题"
          @update:value="(v) => setProp('title', v)"
        />
      </div>
      <div class="config-row">
        <label>边框</label>
        <n-switch
          :value="getProp('bordered', true)"
          size="small"
          @update:value="(v) => setProp('bordered', v)"
        />
      </div>
      <div class="config-row">
        <label>悬停效果</label>
        <n-switch
          :value="getProp('hoverable', false)"
          size="small"
          @update:value="(v) => setProp('hoverable', v)"
        />
      </div>
      <div class="config-row">
        <label>内边距</label>
        <n-input-number
          :value="getProp('padding', 16)"
          :min="0"
          :max="64"
          :step="4"
          size="small"
          @update:value="(v) => setProp('padding', v)"
        />
      </div>
      <div class="config-row">
        <label>阴影</label>
        <n-select
          :value="getProp('shadow', 'none')"
          :options="shadowOptions"
          size="small"
          style="flex: 1"
          @update:value="(v) => setProp('shadow', v)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { NInput, NSwitch, NInputNumber, NSelect } from 'naive-ui'
import { useCanvasStore } from '@/stores/canvas'

const props = defineProps({
  component: { type: Object, required: true }
})

const canvasStore = useCanvasStore()

const getProp = (key, defaultVal) => props.component.props?.[key] ?? defaultVal
const setProp = (key, value) =>
  canvasStore.updateComponentProps(props.component.id, { [key]: value })

const shadowOptions = [
  { label: '无', value: 'none' },
  { label: '小', value: 'sm' },
  { label: '中', value: 'md' },
  { label: '大', value: 'lg' }
]
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.container-config {
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
