<template>
  <div class="datav-scroll-board-wrapper" style="width: 100%; height: 100%">
    <ScrollBoard :config="boardConfig" :style="{ width: '100%', height: '100%' }" />
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

const boardConfig = computed(() => ({
  header: props.config.header || ['名称', '数值'],
  data: props.config.data || [
    ['示例数据 1', '128'],
    ['示例数据 2', '256'],
    ['示例数据 3', '512']
  ],
  rowNum: props.config.rowNum || 5,
  waitTime: props.config.waitTime || 2000,
  autoPlay: props.config.autoPlay !== false,
  autoPlayTimeout: props.config.autoPlayTimeout || 5000,
  headerBGC: props.config.headerBGC || '#1e3a5f',
  headerColor: props.config.headerColor || '#4fc3f7',
  oddRowBGC: props.config.oddRowBGC || 'transparent',
  evenRowBGC: props.config.evenRowBGC || 'rgba(255,255,255,0.03)',
  oddRowColor: props.config.oddRowColor || '#e0e0e0',
  evenRowColor: props.config.evenRowColor || '#e0e0e0',
  scrollSpeed: props.config.scrollSpeed || 2
}))
</script>
