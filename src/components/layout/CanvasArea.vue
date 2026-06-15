<template>
  <div class="canvas-area">
    <!-- 画布工具栏 -->
    <div class="canvas-toolbar">
      <n-space align="center" :size="8">
        <n-button quaternary size="tiny" @click="handleZoomOut" :disabled="zoom <= 25">
          <template #icon><n-icon><ZoomOutOutlined /></n-icon></template>
        </n-button>
        <span class="zoom-text">{{ zoom }}%</span>
        <n-button quaternary size="tiny" @click="handleZoomIn" :disabled="zoom >= 200">
          <template #icon><n-icon><ZoomInOutlined /></n-icon></template>
        </n-button>
        <n-button quaternary size="tiny" @click="handleZoomReset">
          重置
        </n-button>
      </n-space>

      <div class="canvas-info">
        {{ canvasStore.canvasConfig.width }} x {{ canvasStore.canvasConfig.height }}
      </div>
    </div>

    <!-- 画布区域 -->
    <div
      class="canvas-wrapper"
      ref="canvasWrapperRef"
      @click.self="handleCanvasClick"
      @drop="handleDrop"
      @dragover.prevent
    >
      <div
        class="canvas"
        :style="canvasStyle"
        ref="canvasRef"
        @click.self="handleCanvasClick"
      >
        <!-- 空状态提示 -->
        <div v-if="canvasStore.componentCount === 0" class="canvas-empty">
          <div class="canvas-empty-icon">📦</div>
          <div class="canvas-empty-text">从左侧拖拽组件到画布</div>
          <div class="canvas-empty-hint">或点击组件添加到画布</div>
        </div>

        <!-- 画布组件 -->
        <div
          v-for="component in canvasStore.components"
          :key="component.id"
          class="canvas-component"
          :class="{ selected: isSelected(component.id) }"
          :style="getComponentStyle(component)"
          @click.stop="handleComponentClick(component)"
        >
          <!-- 组件内容 -->
          <ComponentRenderer :component="component" />

          <!-- 调整大小手柄 -->
          <template v-if="isSelected(component.id)">
            <div
              v-for="handle in resizeHandles"
              :key="handle"
              class="resize-handle"
              :class="handle"
              @mousedown.stop="startResize($event, component, handle)"
            ></div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ZoomOutOutlined, ZoomInOutlined } from '@vicons/antd'
import { useCanvasStore } from '@/stores/canvas'
import { getComponentByType } from '@/config/components'
import ComponentRenderer from '@/components/base/ComponentRenderer.vue'

const canvasStore = useCanvasStore()
const canvasRef = ref(null)
const canvasWrapperRef = ref(null)

const zoom = ref(100)
const resizeHandles = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw']

// 画布样式
const canvasStyle = computed(() => ({
  transform: `scale(${zoom.value / 100})`,
  transformOrigin: 'center center'
}))

// 判断组件是否选中
const isSelected = (id) => {
  return canvasStore.selectedId === id || canvasStore.selectedIds.includes(id)
}

// 获取组件样式
const getComponentStyle = (component) => ({
  left: `${component.x}px`,
  top: `${component.y}px`,
  width: `${component.width}px`,
  height: `${component.height}px`,
  zIndex: component.zIndex
})

// 缩放操作
const handleZoomIn = () => {
  zoom.value = Math.min(200, zoom.value + 10)
}

const handleZoomOut = () => {
  zoom.value = Math.max(25, zoom.value - 10)
}

const handleZoomReset = () => {
  zoom.value = 100
}

// 画布点击
const handleCanvasClick = () => {
  canvasStore.clearSelection()
}

// 组件点击
const handleComponentClick = (component) => {
  if (event?.ctrlKey || event?.metaKey) {
    canvasStore.toggleSelect(component.id)
  } else {
    canvasStore.selectComponent(component.id)
  }
}

// 拖拽放置
const handleDrop = (event) => {
  event.preventDefault()
  const componentData = event.dataTransfer.getData('component')
  if (!componentData) return

  const component = JSON.parse(componentData)
  const componentConfig = getComponentByType(component.type)
  if (!componentConfig) return

  // 计算放置位置
  const canvasRect = canvasRef.value.getBoundingClientRect()
  const scale = zoom.value / 100
  const x = (event.clientX - canvasRect.left) / scale - componentConfig.defaultSize.width / 2
  const y = (event.clientY - canvasRect.top) / scale - componentConfig.defaultSize.height / 2

  canvasStore.addComponent({
    type: component.type,
    x: Math.max(0, Math.round(x / 10) * 10),
    y: Math.max(0, Math.round(y / 10) * 10),
    width: componentConfig.defaultSize.width,
    height: componentConfig.defaultSize.height,
    props: { ...componentConfig.defaultProps },
    data: {
      type: 'static',
      source: []
    }
  })
}

// 调整大小
let resizing = null

const startResize = (event, component, handle) => {
  event.preventDefault()
  resizing = {
    component,
    handle,
    startX: event.clientX,
    startY: event.clientY,
    startWidth: component.width,
    startHeight: component.height,
    startPosX: component.x,
    startPosY: component.y
  }

  document.addEventListener('mousemove', handleResize)
  document.addEventListener('mouseup', stopResize)
}

const handleResize = (event) => {
  if (!resizing) return

  const scale = zoom.value / 100
  const dx = (event.clientX - resizing.startX) / scale
  const dy = (event.clientY - resizing.startY) / scale

  let { startWidth, startHeight, startPosX, startPosY, handle } = resizing
  let newWidth = startWidth
  let newHeight = startHeight
  let newX = startPosX
  let newY = startPosY

  if (handle.includes('e')) newWidth = startWidth + dx
  if (handle.includes('w')) {
    newWidth = startWidth - dx
    newX = startPosX + dx
  }
  if (handle.includes('s')) newHeight = startHeight + dy
  if (handle.includes('n')) {
    newHeight = startHeight - dy
    newY = startPosY + dy
  }

  // 限制最小尺寸
  newWidth = Math.max(50, newWidth)
  newHeight = Math.max(50, newHeight)

  // 限制位置
  newX = Math.max(0, newX)
  newY = Math.max(0, newY)

  canvasStore.updateComponent(resizing.component.id, {
    x: Math.round(newX / 10) * 10,
    y: Math.round(newY / 10) * 10,
    width: Math.round(newWidth / 10) * 10,
    height: Math.round(newHeight / 10) * 10
  })
}

const stopResize = () => {
  resizing = null
  document.removeEventListener('mousemove', handleResize)
  document.removeEventListener('mouseup', stopResize)
}

// 键盘事件
const handleKeydown = (event) => {
  // Delete 删除选中组件
  if (event.key === 'Delete' || event.key === 'Backspace') {
    if (document.activeElement === document.body) {
      canvasStore.removeSelected()
    }
  }

  // Ctrl+Z 撤销
  if ((event.ctrlKey || event.metaKey) && event.key === 'z') {
    event.preventDefault()
    if (event.shiftKey) {
      canvasStore.redo()
    } else {
      canvasStore.undo()
    }
  }

  // Ctrl+Y 重做
  if ((event.ctrlKey || event.metaKey) && event.key === 'y') {
    event.preventDefault()
    canvasStore.redo()
  }

  // Escape 取消选择
  if (event.key === 'Escape') {
    canvasStore.clearSelection()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.canvas-info {
  margin-left: auto;
  font-size: $font-size-xs;
  color: $text-secondary;
}

.zoom-text {
  font-size: $font-size-xs;
  color: $text-secondary;
  min-width: 40px;
  text-align: center;
}
</style>
