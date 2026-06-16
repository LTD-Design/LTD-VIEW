<template>
  <div v-if="breadcrumb.length > 0" class="drill-breadcrumb">
    <span class="breadcrumb-item breadcrumb-root" @click="$emit('drill-to', 0)"> 全部数据 </span>
    <template v-for="(item, index) in breadcrumb" :key="index">
      <span class="breadcrumb-separator">/</span>
      <span
        class="breadcrumb-item"
        :class="{ 'breadcrumb-current': index === breadcrumb.length - 1 }"
        @click="index < breadcrumb.length - 1 && $emit('drill-to', index + 1)"
      >
        {{ item.name }}
      </span>
    </template>
  </div>
</template>

<script setup>
defineProps({
  breadcrumb: {
    type: Array,
    default: () => []
  }
})

defineEmits(['drill-to'])
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.drill-breadcrumb {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  font-size: $font-size-xs;
  background: rgba(32, 128, 240, 0.08);
  border-bottom: 1px solid $border-color;
  flex-shrink: 0;
  overflow-x: auto;
  white-space: nowrap;
  @include scrollbar;
}

.breadcrumb-item {
  color: $color-primary;
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 2px;
  transition: background $transition-fast;

  &:hover {
    background: rgba(32, 128, 240, 0.15);
  }

  &.breadcrumb-current {
    color: $text-primary;
    cursor: default;

    &:hover {
      background: transparent;
    }
  }
}

.breadcrumb-separator {
  color: $text-muted;
}
</style>
