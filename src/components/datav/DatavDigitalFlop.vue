<template>
  <div
    class="datav-digital-flop-wrapper"
    style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center"
  >
    <DigitalFlop :config="flopConfig" />
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

const flopConfig = computed(() => ({
  value: props.config.value || 0,
  decimals: props.config.decimals || 0,
  textAlign: props.config.textAlign || 'center',
  colors: props.config.colors || ['#2080f0', '#40a9ff'],
  fontSize: props.config.fontSize || 32,
  formatter: props.config.formatter
}))
</script>
