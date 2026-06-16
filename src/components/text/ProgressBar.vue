<template>
  <div class="progress-bar-wrapper" :style="wrapperStyle">
    <div class="progress-bar-track" :style="trackStyle">
      <div class="progress-bar-fill" :style="fillStyle"></div>
    </div>
    <div v-if="config.showLabel" class="progress-bar-label" :style="labelStyle">
      {{ formattedValue }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  config: {
    type: Object,
    default: () => ({})
  }
})

const percentage = computed(() => {
  const max = props.config.max || 100
  const val = props.config.value || 0
  return Math.min(100, Math.max(0, (val / max) * 100))
})

const formattedValue = computed(() => {
  const format = props.config.format || '{value}%'
  const val = props.config.value || 0
  const max = props.config.max || 100
  return format
    .replace('{value}', val)
    .replace('{percent}', Math.round(percentage.value))
    .replace('{max}', max)
})

const wrapperStyle = computed(() => {
  const isVertical = props.config.direction === 'vertical'
  return {
    display: 'flex',
    flexDirection: isVertical ? 'row' : 'column',
    alignItems: 'center',
    gap: '8px',
    width: '100%',
    height: '100%'
  }
})

const trackStyle = computed(() => {
  const isVertical = props.config.direction === 'vertical'
  const h = props.config.height || 8
  return {
    [isVertical ? 'width' : 'height']: `${h}px`,
    [isVertical ? 'minHeight' : 'minHeight']: `${h}px`,
    [isVertical ? 'flex' : 'flex']: '1',
    background: props.config.trackColor || '#1e3a5f',
    borderRadius: `${h / 2}px`,
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center'
  }
})

const fillStyle = computed(() => {
  const isVertical = props.config.direction === 'vertical'
  return {
    [isVertical ? 'width' : 'height']: '100%',
    [isVertical ? 'height' : 'width']: `${percentage.value}%`,
    background: props.config.color || '#2080f0',
    borderRadius: 'inherit',
    transition: 'width 0.5s ease'
  }
})

const labelStyle = computed(() => ({
  fontSize: '12px',
  color: '#a0aec0',
  whiteSpace: 'nowrap',
  minWidth: '40px',
  textAlign: 'center'
}))
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.progress-bar-wrapper {
  padding: $spacing-xs;
}
</style>
