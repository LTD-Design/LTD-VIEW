<template>
  <div class="datav-decoration-wrapper" style="width: 100%; height: 100%">
    <Decoration1 v-if="type === 'decoration-1'" :color="color" />
    <Decoration2 v-else-if="type === 'decoration-2'" :color="color" :reverse="reverse" />
    <Decoration3 v-else-if="type === 'decoration-3'" :color="color" />
    <Decoration4 v-else-if="type === 'decoration-4'" :color="color" :reverse="reverse" />
    <Decoration5 v-else-if="type === 'decoration-5'" :color="color" />
    <Decoration6 v-else-if="type === 'decoration-6'" :color="color" />
    <Decoration7 v-else-if="type === 'decoration-7'" :color="color" />
    <Decoration8 v-else-if="type === 'decoration-8'" :color="color" :reverse="reverse" />
    <Decoration9 v-else-if="type === 'decoration-9'" :color="color" />
    <Decoration10 v-else-if="type === 'decoration-10'" :color="color" />
    <Decoration1 v-else :color="color" />
  </div>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'decoration-1'
  },
  color: {
    type: Array,
    default: () => ['#2080f0', '#40a9ff']
  },
  reverse: {
    type: Boolean,
    default: false
  }
})
</script>
