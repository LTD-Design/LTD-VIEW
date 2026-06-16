<template>
  <div class="rank-list-component">
    <div v-if="config.title" class="rank-list-title">{{ config.title }}</div>
    <div class="rank-list-body">
      <div
        v-for="(item, index) in rankData"
        :key="index"
        class="rank-item"
        :class="{ animated: config.animation }"
        :style="{ animationDelay: `${index * 0.1}s` }"
      >
        <span class="rank-num" :class="rankClass(index)">{{ index + 1 }}</span>
        <span class="rank-name">{{ item.name }}</span>
        <div class="rank-bar-wrap">
          <div
            class="rank-bar"
            :style="{
              width: `${getBarWidth(item.value)}%`,
              background: getBarColor(index)
            }"
          ></div>
        </div>
        <span v-if="config.showNumber" class="rank-value">{{ formatValue(item.value) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useDataStore } from '@/stores/data'

const props = defineProps({
  type: {
    type: String,
    required: true
  },
  config: {
    type: Object,
    required: true
  }
})

const dataStore = useDataStore()

const rankData = computed(() => {
  const storeData = dataStore.getComponentData(props.config.id)
  const source = storeData?.length > 0 ? storeData : props.config.data?.source || []
  return [...source].sort((a, b) => (b.value || 0) - (a.value || 0))
})

const maxValue = computed(() => {
  if (rankData.value.length === 0) return 1
  return Math.max(...rankData.value.map((d) => d.value || 0))
})

const getBarWidth = (value) => {
  return Math.max(5, (value / maxValue.value) * 100)
}

const rankClass = (index) => {
  if (index === 0) return 'first'
  if (index === 1) return 'second'
  if (index === 2) return 'third'
  return 'normal'
}

const rankColors = ['#f0a020', '#a0aec0', '#cd7f32', '#2080f0']
const getBarColor = (index) => {
  return rankColors[index] || rankColors[3]
}

const formatValue = (val) => {
  if (val >= 10000) return (val / 10000).toFixed(1) + 'w'
  if (val >= 1000) return (val / 1000).toFixed(1) + 'k'
  return String(val)
}
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.rank-list-component {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: $spacing-xs;
  overflow: hidden;
}

.rank-list-title {
  font-size: $font-size-md;
  font-weight: 500;
  color: $text-primary;
  padding: $spacing-xs $spacing-sm;
  flex-shrink: 0;
}

.rank-list-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  overflow: hidden;
}

.rank-item {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  padding: 4px 0;

  &.animated {
    animation: slideIn 0.5s ease both;
  }
}

.rank-num {
  width: 22px;
  height: 22px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: $font-size-xs;
  font-weight: 600;
  flex-shrink: 0;

  &.first {
    background: rgba(240, 160, 32, 0.2);
    color: #f0a020;
  }
  &.second {
    background: rgba(160, 174, 192, 0.2);
    color: #a0aec0;
  }
  &.third {
    background: rgba(205, 127, 50, 0.2);
    color: #cd7f32;
  }
  &.normal {
    background: $bg-hover;
    color: $text-muted;
  }
}

.rank-name {
  font-size: $font-size-sm;
  color: $text-secondary;
  min-width: 60px;
  flex-shrink: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.rank-bar-wrap {
  flex: 1;
  height: 6px;
  background: $bg-hover;
  border-radius: 3px;
  overflow: hidden;
}

.rank-bar {
  height: 100%;
  border-radius: 3px;
  transition: width 0.5s ease;
}

.rank-value {
  font-size: $font-size-xs;
  color: $text-primary;
  font-weight: 500;
  min-width: 40px;
  text-align: right;
  flex-shrink: 0;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
