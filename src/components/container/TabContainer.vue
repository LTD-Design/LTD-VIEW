<template>
  <div class="tab-container" :style="containerStyle">
    <div class="tab-header">
      <div
        v-for="(tab, index) in tabs"
        :key="index"
        class="tab-item"
        :class="{ active: activeTab === index }"
        @click="activeTab = index"
      >
        {{ tab.label }}
      </div>
    </div>
    <div class="tab-body">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  config: { type: Object, default: () => ({}) }
})

const activeTab = ref(0)

const tabs = computed(() => props.config?.tabs || [{ label: '标签 1' }, { label: '标签 2' }])

const containerStyle = computed(() => ({
  background: props.config?.background || 'transparent',
  borderRadius: `${props.config?.borderRadius || 0}px`
}))
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.tab-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.tab-header {
  display: flex;
  gap: 2px;
  padding: 0 $spacing-sm;
  background: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid $border-color;
  flex-shrink: 0;
}

.tab-item {
  padding: $spacing-sm $spacing-md;
  font-size: $font-size-sm;
  color: $text-secondary;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    color: $text-primary;
  }

  &.active {
    color: $color-primary;
    border-bottom-color: $color-primary;
  }
}

.tab-body {
  flex: 1;
  overflow: auto;
  @include scrollbar;
}
</style>
