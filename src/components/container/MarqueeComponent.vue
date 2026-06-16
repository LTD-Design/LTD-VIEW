<template>
  <div class="marquee-container" :style="containerStyle">
    <div class="marquee-content" :style="marqueeStyle">
      <span class="marquee-text" :style="textStyle">{{ displayText }}</span>
      <span v-if="!scrollMode" class="marquee-text" :style="textStyle">{{ displayText }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  config: { type: Object, default: () => ({}) }
})

const displayText = computed(() => props.config?.text || '滚动文字内容')
const speed = computed(() => props.config?.speed || 3)
const direction = computed(() => props.config?.direction || 'left')
const scrollMode = computed(() => props.config?.scrollMode || false)

const containerStyle = computed(() => ({
  background: props.config?.background || 'transparent'
}))

const marqueeStyle = computed(() => {
  const dur = 10 / speed.value
  const dir = direction.value === 'right' ? 'reverse' : 'normal'
  return {
    animationDuration: `${dur}s`,
    animationDirection: dir
  }
})

const textStyle = computed(() => ({
  color: props.config?.color || '#ffffff',
  fontSize: `${props.config?.fontSize || 16}px`,
  fontWeight: props.config?.fontWeight || '400'
}))
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.marquee-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
}

.marquee-content {
  display: inline-flex;
  white-space: nowrap;
  animation: marquee-scroll linear infinite;
}

.marquee-text {
  padding-right: 60px;
}

@keyframes marquee-scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}
</style>
