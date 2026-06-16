<template>
  <div class="video-component">
    <video
      v-if="config.src"
      ref="videoRef"
      :src="config.src"
      :autoplay="config.autoplay"
      :loop="config.loop"
      :muted="config.muted"
      :controls="config.controls"
      :poster="config.poster"
      :style="{ objectFit: config.fit || 'contain' }"
    ></video>
    <div v-else class="video-placeholder">
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="4"
          y="8"
          width="40"
          height="32"
          rx="4"
          stroke="#1e3a5f"
          stroke-width="2"
          fill="#0d192d"
        />
        <polygon points="20,16 20,32 34,24" fill="#2080f0" />
      </svg>
      <span>视频</span>
    </div>
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
@use '@/styles/variables' as *;

.video-component {
  width: 100%;
  height: 100%;

  video {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}

.video-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: $bg-card;
  color: $text-muted;
  gap: $spacing-sm;
  font-size: $font-size-md;
}
</style>
