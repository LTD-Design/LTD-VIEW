<template>
  <div class="kpi-card">
    <div class="kpi-header">
      <div
        class="kpi-icon"
        :style="{ background: `${config.color || '#18a058'}20`, color: config.color || '#18a058' }"
      >
        <svg v-if="config.trend === 'up'" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 3L13 8H10V13H6V8H3L8 3Z" fill="currentColor" />
        </svg>
        <svg v-else width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 13L3 8H6V3H10V8H13L8 13Z" fill="currentColor" />
        </svg>
      </div>
      <div class="kpi-label">{{ config.label || '指标' }}</div>
    </div>
    <div class="kpi-value-row">
      <span class="kpi-prefix">{{ config.prefix || '' }}</span>
      <span class="kpi-value">{{ displayValue }}</span>
      <span class="kpi-suffix">{{ config.suffix || '' }}</span>
    </div>
    <div v-if="config.trendValue" class="kpi-trend" :class="config.trend">
      {{ config.trendValue }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
  config: {
    type: Object,
    default: () => ({})
  }
})

const displayValue = ref(0)

const animateValue = (start, end, duration = 1000) => {
  const startTime = performance.now()
  const animate = (currentTime) => {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    displayValue.value = Math.round(start + (end - start) * eased).toLocaleString()
    if (progress < 1) requestAnimationFrame(animate)
  }
  requestAnimationFrame(animate)
}

onMounted(() => {
  animateValue(0, props.config.value || 0)
})

watch(
  () => props.config.value,
  (newVal, oldVal) => {
    const start = parseInt(String(oldVal || 0).replace(/,/g, '')) || 0
    animateValue(start, newVal || 0)
  }
)
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.kpi-card {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: $spacing-md;
}

.kpi-header {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  margin-bottom: $spacing-sm;
}

.kpi-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.kpi-label {
  font-size: $font-size-sm;
  color: $text-secondary;
}

.kpi-value-row {
  display: flex;
  align-items: baseline;
  gap: 2px;
}

.kpi-prefix {
  font-size: $font-size-lg;
  color: $text-secondary;
  font-weight: 500;
}

.kpi-value {
  font-size: 28px;
  font-weight: 700;
  color: $text-primary;
  line-height: 1;
}

.kpi-suffix {
  font-size: $font-size-sm;
  color: $text-secondary;
}

.kpi-trend {
  font-size: $font-size-xs;
  margin-top: $spacing-xs;

  &.up {
    color: $color-success;
  }

  &.down {
    color: $color-error;
  }
}
</style>
