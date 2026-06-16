<template>
  <div class="canvas-area">
    <!-- 画布工具栏 -->
    <div class="canvas-toolbar">
      <n-space align="center" :size="8">
        <n-button quaternary size="tiny" :disabled="zoom <= 25" @click="handleZoomOut">
          <template #icon
            ><n-icon><ZoomOutOutlined /></n-icon
          ></template>
        </n-button>
        <span class="zoom-text">{{ zoom }}%</span>
        <n-button quaternary size="tiny" :disabled="zoom >= 200" @click="handleZoomIn">
          <template #icon
            ><n-icon><ZoomInOutlined /></n-icon
          ></template>
        </n-button>
        <n-button quaternary size="tiny" @click="handleZoomReset"> 重置 </n-button>
        <n-button quaternary size="tiny" @click="handleFitView"> 适配 </n-button>
      </n-space>

      <!-- 对齐工具（多选时显示） -->
      <n-space
        v-if="canvasStore.selectedIds.length > 1"
        align="center"
        :size="4"
        class="align-tools"
      >
        <n-divider vertical />
        <n-tooltip trigger="hover">
          <template #trigger>
            <n-button quaternary size="tiny" @click="alignComponents('left')">⫷</n-button>
          </template>
          左对齐
        </n-tooltip>
        <n-tooltip trigger="hover">
          <template #trigger>
            <n-button quaternary size="tiny" @click="alignComponents('centerH')">⫿</n-button>
          </template>
          水平居中
        </n-tooltip>
        <n-tooltip trigger="hover">
          <template #trigger>
            <n-button quaternary size="tiny" @click="alignComponents('right')">⫸</n-button>
          </template>
          右对齐
        </n-tooltip>
        <n-tooltip trigger="hover">
          <template #trigger>
            <n-button quaternary size="tiny" @click="alignComponents('top')">⫠</n-button>
          </template>
          顶对齐
        </n-tooltip>
        <n-tooltip trigger="hover">
          <template #trigger>
            <n-button quaternary size="tiny" @click="alignComponents('centerV')">⫡</n-button>
          </template>
          垂直居中
        </n-tooltip>
        <n-tooltip trigger="hover">
          <template #trigger>
            <n-button quaternary size="tiny" @click="alignComponents('bottom')">⫢</n-button>
          </template>
          底对齐
        </n-tooltip>
      </n-space>

      <div class="canvas-info">
        {{ canvasStore.canvasConfig.width }} x {{ canvasStore.canvasConfig.height }}
      </div>
    </div>

    <!-- 画布区域 -->
    <div
      ref="canvasWrapperRef"
      class="canvas-wrapper"
      @click.self="handleCanvasClick"
      @drop="handleDrop"
      @dragover.prevent
      @mousedown.self="handleWrapperMousedown"
    >
      <div
        ref="canvasRef"
        class="canvas"
        :style="canvasStyle"
        @click.self="handleCanvasClick"
        @mousedown.self="handleCanvasMousedown"
      >
        <!-- 空状态提示 -->
        <div v-if="canvasStore.componentCount === 0" class="canvas-empty">
          <div class="canvas-empty-icon">
            <svg viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg">
              <!-- 画布背景 -->
              <rect
                x="10"
                y="8"
                width="100"
                height="74"
                rx="4"
                stroke="#1e3a5f"
                stroke-width="1.5"
                fill="none"
                stroke-dasharray="4 2"
              />
              <!-- 顶部工具栏 -->
              <rect x="14" y="12" width="92" height="8" rx="2" fill="#1e3a5f" opacity="0.4" />
              <rect x="18" y="14" width="20" height="4" rx="1" fill="#2080f0" opacity="0.6" />
              <rect x="42" y="14" width="20" height="4" rx="1" fill="#1e3a5f" opacity="0.3" />
              <rect x="66" y="14" width="20" height="4" rx="1" fill="#1e3a5f" opacity="0.3" />
              <!-- 左侧面板 -->
              <rect x="14" y="24" width="24" height="54" rx="2" fill="#1e3a5f" opacity="0.2" />
              <rect x="18" y="28" width="16" height="4" rx="1" fill="#2080f0" opacity="0.4" />
              <rect
                x="18"
                y="36"
                width="16"
                height="12"
                rx="1"
                fill="#2080f0"
                opacity="0.15"
                stroke="#2080f0"
                stroke-width="0.5"
                stroke-opacity="0.3"
              />
              <rect
                x="18"
                y="52"
                width="16"
                height="12"
                rx="1"
                fill="#2080f0"
                opacity="0.15"
                stroke="#2080f0"
                stroke-width="0.5"
                stroke-opacity="0.3"
              />
              <!-- 右侧面板 -->
              <rect x="82" y="24" width="24" height="54" rx="2" fill="#1e3a5f" opacity="0.2" />
              <rect x="86" y="28" width="16" height="4" rx="1" fill="#2080f0" opacity="0.4" />
              <rect x="86" y="36" width="16" height="20" rx="1" fill="#1e3a5f" opacity="0.3" />
              <!-- 中间画布区域 - 组件占位 -->
              <rect
                x="42"
                y="24"
                width="36"
                height="22"
                rx="2"
                fill="#2080f0"
                opacity="0.08"
                stroke="#2080f0"
                stroke-width="0.8"
                stroke-opacity="0.25"
                stroke-dasharray="3 2"
              />
              <rect
                x="42"
                y="50"
                width="17"
                height="28"
                rx="2"
                fill="#2080f0"
                opacity="0.08"
                stroke="#2080f0"
                stroke-width="0.8"
                stroke-opacity="0.25"
                stroke-dasharray="3 2"
              />
              <rect
                x="61"
                y="50"
                width="17"
                height="28"
                rx="2"
                fill="#2080f0"
                opacity="0.08"
                stroke="#2080f0"
                stroke-width="0.8"
                stroke-opacity="0.25"
                stroke-dasharray="3 2"
              />
              <!-- 拖拽箭头 -->
              <path
                d="M30 42 L42 42"
                stroke="#2080f0"
                stroke-width="1.5"
                stroke-linecap="round"
                marker-end="url(#arrowhead)"
              />
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="6"
                  markerHeight="4"
                  refX="5"
                  refY="2"
                  orient="auto"
                >
                  <path d="M0,0 L6,2 L0,4" fill="#2080f0" />
                </marker>
              </defs>
            </svg>
          </div>
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
          @mousedown.stop="startDrag($event, component)"
          @click.stop="handleComponentClick($event, component)"
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

        <!-- 框选矩形 -->
        <div v-if="marquee.active" class="marquee-rect" :style="marqueeStyle"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted, onUnmounted } from 'vue'
import { ZoomOutOutlined, ZoomInOutlined } from '@vicons/antd'
import { NTooltip } from 'naive-ui'
import { useCanvasStore } from '@/stores/canvas'
import { useDataStore } from '@/stores/data'
import { getComponentByType } from '@/config/components'
import { BG_CANVAS_WRAPPER } from '@/config/colors'
import ComponentRenderer from '@/components/base/ComponentRenderer.vue'

const canvasStore = useCanvasStore()
const dataStore = useDataStore()
const canvasRef = ref(null)
const canvasWrapperRef = ref(null)

const zoom = ref(100)
const resizeHandles = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw']

// 拖拽状态
let dragging = null

// 框选状态
const marquee = reactive({
  active: false,
  startX: 0,
  startY: 0,
  endX: 0,
  endY: 0
})

// 框选矩形样式
const marqueeStyle = computed(() => {
  const left = Math.min(marquee.startX, marquee.endX)
  const top = Math.min(marquee.startY, marquee.endY)
  const width = Math.abs(marquee.endX - marquee.startX)
  const height = Math.abs(marquee.endY - marquee.startY)
  return {
    left: `${left}px`,
    top: `${top}px`,
    width: `${width}px`,
    height: `${height}px`
  }
})

// 画布样式
const canvasStyle = computed(() => ({
  '--canvas-scale': zoom.value / 100
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

// 一键适配视图
const handleFitView = () => {
  if (!canvasWrapperRef.value) return
  const wrapperRect = canvasWrapperRef.value.getBoundingClientRect()
  const padding = 40
  const availW = wrapperRect.width - padding * 2
  const availH = wrapperRect.height - padding * 2
  const canvasW = canvasStore.canvasConfig.width
  const canvasH = canvasStore.canvasConfig.height
  const scale = Math.min(availW / canvasW, availH / canvasH, 1)
  zoom.value = Math.round(scale * 100)
}

// 对齐工具
const alignComponents = (type) => {
  const ids = canvasStore.selectedIds
  if (ids.length < 2) return

  const selected = canvasStore.components.filter((c) => ids.includes(c.id))
  if (selected.length < 2) return

  const bounds = {
    left: Math.min(...selected.map((c) => c.x)),
    right: Math.max(...selected.map((c) => c.x + c.width)),
    top: Math.min(...selected.map((c) => c.y)),
    bottom: Math.max(...selected.map((c) => c.y + c.height))
  }
  const centerX = (bounds.left + bounds.right) / 2
  const centerY = (bounds.top + bounds.bottom) / 2

  selected.forEach((comp) => {
    let newX = comp.x
    let newY = comp.y

    switch (type) {
      case 'left':
        newX = bounds.left
        break
      case 'right':
        newX = bounds.right - comp.width
        break
      case 'centerH':
        newX = centerX - comp.width / 2
        break
      case 'top':
        newY = bounds.top
        break
      case 'bottom':
        newY = bounds.bottom - comp.height
        break
      case 'centerV':
        newY = centerY - comp.height / 2
        break
    }

    canvasStore.updateComponent(comp.id, {
      x: Math.round(newX / 10) * 10,
      y: Math.round(newY / 10) * 10
    })
  })
}

// 画布点击（取消选择 + 框选起始）
const handleCanvasClick = () => {
  canvasStore.clearSelection()
}

// 画布 mousedown（框选起始）
const handleCanvasMousedown = (event) => {
  // 仅在点击画布空白处时触发框选
  if (event.target !== canvasRef.value) return
  if (event.button !== 0) return

  const canvasRect = canvasRef.value.getBoundingClientRect()
  const scale = zoom.value / 100

  marquee.active = true
  marquee.startX = (event.clientX - canvasRect.left) / scale
  marquee.startY = (event.clientY - canvasRect.top) / scale
  marquee.endX = marquee.startX
  marquee.endY = marquee.startY

  document.addEventListener('mousemove', handleMarqueeMove)
  document.addEventListener('mouseup', handleMarqueeEnd)
}

const handleMarqueeMove = (event) => {
  if (!marquee.active) return
  const canvasRect = canvasRef.value.getBoundingClientRect()
  const scale = zoom.value / 100
  marquee.endX = (event.clientX - canvasRect.left) / scale
  marquee.endY = (event.clientY - canvasRect.top) / scale
}

const handleMarqueeEnd = () => {
  if (!marquee.active) return

  // 选中框选范围内的组件
  const left = Math.min(marquee.startX, marquee.endX)
  const top = Math.min(marquee.startY, marquee.endY)
  const right = Math.max(marquee.startX, marquee.endX)
  const bottom = Math.max(marquee.startY, marquee.endY)

  // 至少 5px 才算框选，否则只是点击
  if (right - left > 5 || bottom - top > 5) {
    canvasStore.clearSelection()
    canvasStore.components.forEach((comp) => {
      const compRight = comp.x + comp.width
      const compBottom = comp.y + comp.height
      if (comp.x < right && compRight > left && comp.y < bottom && compBottom > top) {
        canvasStore.toggleSelect(comp.id)
      }
    })
  }

  marquee.active = false
  document.removeEventListener('mousemove', handleMarqueeMove)
  document.removeEventListener('mouseup', handleMarqueeEnd)
}

// 画布平移（中键拖拽或按住空格拖拽）
let panning = null

const handleWrapperMousedown = (event) => {
  // 中键按下 或 空格+左键
  if (event.button === 1 || (event.button === 0 && event.target === canvasWrapperRef.value)) {
    event.preventDefault()
    panning = {
      startX: event.clientX,
      startY: event.clientY,
      scrollLeft: canvasWrapperRef.value.scrollLeft,
      scrollTop: canvasWrapperRef.value.scrollTop
    }
    document.addEventListener('mousemove', handlePanMove)
    document.addEventListener('mouseup', handlePanEnd)
  }
}

const handlePanMove = (event) => {
  if (!panning) return
  const dx = event.clientX - panning.startX
  const dy = event.clientY - panning.startY
  canvasWrapperRef.value.scrollLeft = panning.scrollLeft - dx
  canvasWrapperRef.value.scrollTop = panning.scrollTop - dy
}

const handlePanEnd = () => {
  panning = null
  document.removeEventListener('mousemove', handlePanMove)
  document.removeEventListener('mouseup', handlePanEnd)
}

// 组件点击
const handleComponentClick = (event, component) => {
  if (event?.ctrlKey || event?.metaKey) {
    canvasStore.toggleSelect(component.id)
  } else {
    canvasStore.selectComponent(component.id)
  }
}

// 组件拖拽移动
const startDrag = (event, component) => {
  if (event.button !== 0) return

  // 如果组件未选中，先选中它
  if (!isSelected(component.id)) {
    if (event.ctrlKey || event.metaKey) {
      canvasStore.toggleSelect(component.id)
    } else {
      canvasStore.selectComponent(component.id)
    }
  }

  const scale = zoom.value / 100
  dragging = {
    componentId: component.id,
    startMouseX: event.clientX,
    startMouseY: event.clientY,
    startPosX: component.x,
    startPosY: component.y,
    // 记录所有选中组件的初始位置
    selectedPositions:
      canvasStore.selectedIds.length > 0
        ? canvasStore.components
            .filter((c) => canvasStore.selectedIds.includes(c.id))
            .map((c) => ({ id: c.id, x: c.x, y: c.y }))
        : [{ id: component.id, x: component.x, y: component.y }]
  }

  document.addEventListener('mousemove', handleDrag)
  document.addEventListener('mouseup', stopDrag)
}

const handleDrag = (event) => {
  if (!dragging) return

  const scale = zoom.value / 100
  const dx = (event.clientX - dragging.startMouseX) / scale
  const dy = (event.clientY - dragging.startMouseY) / scale

  dragging.selectedPositions.forEach((pos) => {
    const newX = Math.max(0, Math.round((pos.x + dx) / 10) * 10)
    const newY = Math.max(0, Math.round((pos.y + dy) / 10) * 10)
    // 直接修改组件位置，避免每次 mousemove 都保存历史
    const comp = canvasStore.components.find((c) => c.id === pos.id)
    if (comp) {
      comp.x = newX
      comp.y = newY
    }
  })
}

const stopDrag = () => {
  if (dragging) {
    canvasStore.saveHistory()
  }
  dragging = null
  document.removeEventListener('mousemove', handleDrag)
  document.removeEventListener('mouseup', stopDrag)
}

// 拖拽放置
const handleDrop = (event) => {
  event.preventDefault()
  const componentData = event.dataTransfer.getData('component')
  if (!componentData) return

  const component = JSON.parse(componentData)
  const componentConfig = getComponentByType(component.type)
  if (!componentConfig) return

  if (!canvasRef.value) return

  // 计算放置位置
  const canvasRect = canvasRef.value.getBoundingClientRect()
  const scale = zoom.value / 100
  const x = (event.clientX - canvasRect.left) / scale - componentConfig.defaultSize.width / 2
  const y = (event.clientY - canvasRect.top) / scale - componentConfig.defaultSize.height / 2

  const newComp = canvasStore.addComponent({
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

  // 初始化组件数据到 dataStore
  dataStore.updateComponentData(newComp.id, [], {})
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

  // 直接修改组件属性，避免每次 mousemove 都保存历史
  const comp = canvasStore.components.find((c) => c.id === resizing.component.id)
  if (comp) {
    comp.x = Math.round(newX / 10) * 10
    comp.y = Math.round(newY / 10) * 10
    comp.width = Math.round(newWidth / 10) * 10
    comp.height = Math.round(newHeight / 10) * 10
  }
}

const stopResize = () => {
  if (resizing) {
    canvasStore.saveHistory()
  }
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

.align-tools {
  margin-left: $spacing-sm;
}

.marquee-rect {
  position: absolute;
  border: 1px solid $color-primary;
  background: rgba(32, 128, 240, 0.1);
  pointer-events: none;
  z-index: 9999;
}
</style>
