<template>
  <div
    class="preview-page"
    :style="previewStyle"
    @mousemove="handleMouseMove"
  >
    <!-- 控制按钮 -->
    <transition name="fade">
      <div class="preview-controls" v-show="showControls">
        <n-button quaternary size="small" @click="goBack">
          <template #icon><n-icon><ArrowLeftOutlined /></n-icon></template>
          返回编辑
        </n-button>

        <div class="preview-controls-right">
          <n-select
            v-model:value="fitMode"
            :options="fitModeOptions"
            size="tiny"
            class="fit-mode-select"
          />
          <n-button quaternary size="small" @click="toggleFullscreen">
            <template #icon>
              <n-icon>
                <FullscreenExitOutlined v-if="isFullscreen" />
                <FullscreenOutlined v-else />
              </n-icon>
            </template>
            {{ isFullscreen ? '退出全屏' : '全屏' }}
          </n-button>
        </div>
      </div>
    </transition>

    <!-- 画布 -->
    <div class="preview-canvas-wrapper" ref="wrapperRef">
      <div
        class="preview-canvas"
        :style="canvasStyle"
        ref="canvasRef"
      >
        <div
          v-for="component in canvasStore.components"
          :key="component.id"
          class="preview-component"
          :style="getComponentStyle(component)"
        >
          <ComponentRenderer :component="component" />
        </div>
      </div>
    </div>

    <!-- 分辨率信息 -->
    <transition name="fade">
      <div class="preview-info" v-show="showControls">
        {{ canvasStore.canvasConfig.width }} x {{ canvasStore.canvasConfig.height }}
        | 缩放 {{ scalePercent }}%
        | {{ fitModeLabels[fitMode] }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import {
  ArrowLeftOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined
} from '@vicons/antd'
import { useCanvasStore } from '@/stores/canvas'
import ComponentRenderer from '@/components/base/ComponentRenderer.vue'

const router = useRouter()
const canvasStore = useCanvasStore()

const showControls = ref(true)
const isFullscreen = ref(false)
const fitMode = ref('contain')
const wrapperRef = ref(null)
const canvasRef = ref(null)
const windowWidth = ref(window.innerWidth)
const windowHeight = ref(window.innerHeight)

let hideTimer = null

const fitModeOptions = [
  { label: '适应窗口', value: 'contain' },
  { label: '填充窗口', value: 'cover' },
  { label: '原始大小', value: 'none' },
  { label: '宽度适配', value: 'fitWidth' },
  { label: '高度适配', value: 'fitHeight' }
]

const fitModeLabels = {
  contain: '适应窗口',
  cover: '填充窗口',
  none: '原始大小',
  fitWidth: '宽度适配',
  fitHeight: '高度适配'
}

// 计算缩放比例
const scale = computed(() => {
  const cw = canvasStore.canvasConfig.width
  const ch = canvasStore.canvasConfig.height
  const ww = windowWidth.value
  const wh = windowHeight.value

  switch (fitMode.value) {
    case 'contain':
      return Math.min(ww / cw, wh / ch, 1)
    case 'cover':
      return Math.max(ww / cw, wh / ch)
    case 'fitWidth':
      return ww / cw
    case 'fitHeight':
      return wh / ch
    case 'none':
    default:
      return 1
  }
})

const scalePercent = computed(() => Math.round(scale.value * 100))

const previewStyle = computed(() => ({
  background: canvasStore.canvasConfig.background
}))

const canvasStyle = computed(() => ({
  width: `${canvasStore.canvasConfig.width}px`,
  height: `${canvasStore.canvasConfig.height}px`,
  transform: `scale(${scale.value})`,
  transformOrigin: 'center center'
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

const handleResize = () => {
  windowWidth.value = window.innerWidth
  windowHeight.value = window.innerHeight
}

const handleFullscreenChange = () => {
  isFullscreen.value = !!document.fullscreenElement
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
  document.addEventListener('fullscreenchange', handleFullscreenChange)
  window.addEventListener('resize', handleResize)
  handleResize()
})

onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('keydown', handleKeydown)
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
  window.removeEventListener('resize', handleResize)
  clearTimeout(hideTimer)
})
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.preview-page {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-canvas-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.preview-canvas {
  position: relative;
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.5);
}

.preview-component {
  position: absolute;
}

.preview-controls {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 48px;
  background: rgba(13, 25, 45, 0.85);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid rgba(30, 58, 95, 0.5);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 $spacing-md;
  z-index: 1000;
}

.preview-controls-right {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
}

.fit-mode-select {
  width: 120px;
}

.preview-info {
  position: fixed;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(13, 25, 45, 0.85);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(30, 58, 95, 0.5);
  border-radius: 4px;
  padding: 4px 12px;
  font-size: $font-size-xs;
  color: $text-secondary;
  z-index: 1000;
}

// 过渡动画
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
