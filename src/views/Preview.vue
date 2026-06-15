<template>
  <div class="preview-page" :style="previewStyle">
    <!-- 返回按钮 -->
    <div class="preview-back" v-show="showControls">
      <n-button quaternary @click="goBack">
        <template #icon><n-icon><ArrowLeftOutlined /></n-icon></template>
        返回编辑
      </n-button>
    </div>

    <!-- 画布 -->
    <div class="preview-canvas" :style="canvasStyle">
      <div
        v-for="component in canvasStore.components"
        :key="component.id"
        class="preview-component"
        :style="getComponentStyle(component)"
      >
        <ComponentRenderer :component="component" />
      </div>
    </div>

    <!-- 全屏按钮 -->
    <div class="preview-fullscreen" v-show="showControls">
      <n-button quaternary @click="toggleFullscreen">
        <template #icon><n-icon><FullscreenOutlined /></n-icon></template>
      </n-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeftOutlined, FullscreenOutlined } from '@vicons/antd'
import { useCanvasStore } from '@/stores/canvas'
import ComponentRenderer from '@/components/base/ComponentRenderer.vue'

const router = useRouter()
const canvasStore = useCanvasStore()

const showControls = ref(true)
const isFullscreen = ref(false)

let hideTimer = null

const previewStyle = computed(() => ({
  background: canvasStore.canvasConfig.background
}))

const canvasStyle = computed(() => ({
  width: `${canvasStore.canvasConfig.width}px`,
  height: `${canvasStore.canvasConfig.height}px`
}))

const getComponentStyle = (component) => ({
  left: `${component.x}px`,
  top: `${component.y}px`,
  width: `${component.width}px`,
  height: `${component.height}px`,
  zIndex: component.zIndex
})

const goBack = () => {
  router.push('/')
}

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
    isFullscreen.value = true
  } else {
    document.exitFullscreen()
    isFullscreen.value = false
  }
}

const handleMouseMove = () => {
  showControls.value = true
  clearTimeout(hideTimer)
  hideTimer = setTimeout(() => {
    if (isFullscreen.value) {
      showControls.value = false
    }
  }, 3000)
}

const handleKeydown = (event) => {
  if (event.key === 'Escape') {
    if (isFullscreen.value) {
      document.exitFullscreen()
      isFullscreen.value = false
    } else {
      goBack()
    }
  }

  if (event.key === 'F11') {
    event.preventDefault()
    toggleFullscreen()
  }
}

onMounted(() => {
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('keydown', handleKeydown)
  clearTimeout(hideTimer)
})
</script>

<style scoped lang="scss">
.preview-page {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-canvas {
  position: relative;
  transform-origin: center center;
}

.preview-component {
  position: absolute;
}

.preview-back {
  position: fixed;
  top: 16px;
  left: 16px;
  z-index: 1000;
  opacity: 0.5;
  transition: opacity 0.3s;

  &:hover {
    opacity: 1;
  }
}

.preview-fullscreen {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 1000;
  opacity: 0.5;
  transition: opacity 0.3s;

  &:hover {
    opacity: 1;
  }
}
</style>
