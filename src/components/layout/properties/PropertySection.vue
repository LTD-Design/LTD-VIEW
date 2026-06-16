<template>
  <div class="property-section-card" :class="{ collapsed: !expanded }">
    <div class="property-section-header" @click="expanded = !expanded">
      <span class="property-section-title">{{ title }}</span>
      <span class="property-section-chevron" :class="{ open: expanded }">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M3 4.5L6 7.5L9 4.5"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </span>
    </div>
    <transition name="section-collapse">
      <div v-show="expanded" class="property-section-body">
        <slot />
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  title: {
    type: String,
    required: true
  },
  defaultExpanded: {
    type: Boolean,
    default: true
  }
})

const expanded = ref(true)
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.property-section-card {
  background: rgba(30, 58, 95, 0.15);
  border: 1px solid rgba(30, 58, 95, 0.3);
  border-radius: $border-radius-lg;
  margin-bottom: $spacing-sm;
  overflow: hidden;
  transition: border-color $transition-fast;
}

.property-section-card:hover {
  border-color: rgba(30, 58, 95, 0.5);
}

.property-section-card.collapsed {
  .property-section-body {
    display: none;
  }
}

.property-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-sm $spacing-md;
  cursor: pointer;
  user-select: none;
  transition: background $transition-fast;
}

.property-section-header:hover {
  background: rgba(30, 58, 95, 0.2);
}

.property-section-title {
  font-size: $font-size-sm;
  font-weight: 500;
  color: $text-secondary;
}

.property-section-chevron {
  display: flex;
  align-items: center;
  color: $text-muted;
  transition: transform $transition-fast;

  &.open {
    transform: rotate(180deg);
  }
}

.property-section-body {
  padding: 0 $spacing-md $spacing-md;
}

.section-collapse-enter-active,
.section-collapse-leave-active {
  transition: all $transition-fast;
  overflow: hidden;
}

.section-collapse-enter-from,
.section-collapse-leave-to {
  opacity: 0;
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
}

.section-collapse-enter-to,
.section-collapse-leave-from {
  opacity: 1;
  max-height: 500px;
}
</style>
