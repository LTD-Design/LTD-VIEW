<template>
  <div
    class="datav-water-ball-wrapper"
    style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center"
  >
    <WaterBall :percent="percent" :colors="colors">
      <div class="water-ball-content">{{ percent }}%</div>
    </WaterBall>
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

const percent = computed(() => props.config.percent || 50)
const colors = computed(
  () =>
    props.config.colors || [
      { color: '#2080f0', rgb: '32, 128, 240' },
      { color: '#40a9ff', rgb: '64, 169, 255' }
    ]
)
</script>

<style scoped lang="scss">
.water-ball-content {
  font-size: 24px;
  font-weight: 700;
  color: #fff;
}
</style>
