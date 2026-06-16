<template>
  <div
    class="datav-loading-wrapper"
    style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center"
  >
    <Loading :size="size" />
  </div>
</template>

<script setup>
defineProps({
  config: {
    type: Object,
    default: () => ({})
  }
})
</script>

<style scoped lang="scss">
.datav-loading-wrapper {
  :deep(.datav-loading) {
    width: 100%;
    height: 100%;
  }
}
</style>
