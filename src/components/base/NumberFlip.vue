<template>
  <div class="number-flip">
    <span class="number-prefix" v-if="prefix">{{ prefix }}</span>
    <span class="number-value">{{ displayValue }}</span>
    <span class="number-suffix" v-if="suffix">{{ suffix }}</span>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
  config: {
    type: Object,
    default: () => ({
      value: 0,
      prefix: '',
      suffix: '',
      duration: 2000,
      separator: ','
    })
  }
})

const displayValue = ref('0')
let animationFrame = null

const formatNumber = (num) => {
  const separator = props.config?.separator || ','
  const parts = num.toString().split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator)
  return parts.join('.')
}

const animate = (start, end, duration) => {
  const startTime = performance.now()

  const update = (currentTime) => {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)

    // easeOutQuart 缓动函数
    const eased = 1 - Math.pow(1 - progress, 4)
    const current = Math.round(start + (end - start) * eased)

    displayValue.value = formatNumber(current)

    if (progress < 1) {
      animationFrame = requestAnimationFrame(update)
    }
  }

  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }

  animationFrame = requestAnimationFrame(update)
}

onMounted(() => {
  animate(0, props.config?.value || 0, props.config?.duration || 2000)
})

watch(
  () => props.config?.value,
  (newVal, oldVal) => {
    animate(oldVal || 0, newVal || 0, props.config?.duration || 2000)
  }
)
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.number-flip {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'DIN', 'Helvetica Neue', sans-serif;
  color: $color-primary;
}

.number-prefix,
.number-suffix {
  font-size: $font-size-lg;
  color: $text-secondary;
  margin: 0 $spacing-xs;
}

.number-value {
  font-size: 32px;
  font-weight: 700;
  letter-spacing: 2px;
}
</style>
