<template>
  <div class="style-properties">
    <!-- 位置 -->
    <div class="property-section">
      <div class="property-section-title">位置</div>
      <div class="property-row">
        <span class="property-label">X</span>
        <n-input-number
          :value="component.x"
          @update:value="(val) => updatePosition('x', val)"
          size="small"
          :min="0"
          :step="10"
        />
      </div>
      <div class="property-row">
        <span class="property-label">Y</span>
        <n-input-number
          :value="component.y"
          @update:value="(val) => updatePosition('y', val)"
          size="small"
          :min="0"
          :step="10"
        />
      </div>
    </div>

    <!-- 尺寸 -->
    <div class="property-section">
      <div class="property-section-title">尺寸</div>
      <div class="property-row">
        <span class="property-label">宽度</span>
        <n-input-number
          :value="component.width"
          @update:value="(val) => updateSize('width', val)"
          size="small"
          :min="50"
          :step="10"
        />
      </div>
      <div class="property-row">
        <span class="property-label">高度</span>
        <n-input-number
          :value="component.height"
          @update:value="(val) => updateSize('height', val)"
          size="small"
          :min="50"
          :step="10"
        />
      </div>
    </div>

    <!-- 外观 -->
    <div class="property-section">
      <div class="property-section-title">外观</div>
      <div class="property-row">
        <span class="property-label">背景色</span>
        <n-color-picker
          :value="component.style?.background || 'transparent'"
          @update:value="(val) => updateStyle('background', val)"
          size="small"
          :show-alpha="true"
        />
      </div>
      <div class="property-row">
        <span class="property-label">边框</span>
        <n-select
          :value="component.style?.borderStyle || 'none'"
          @update:value="(val) => updateStyle('borderStyle', val)"
          size="small"
          :options="borderOptions"
        />
      </div>
      <div class="property-row">
        <span class="property-label">圆角</span>
        <n-input-number
          :value="component.style?.borderRadius || 0"
          @update:value="(val) => updateStyle('borderRadius', val)"
          size="small"
          :min="0"
        />
      </div>
      <div class="property-row">
        <span class="property-label">透明度</span>
        <n-slider
          :value="(component.style?.opacity || 1) * 100"
          @update:value="(val) => updateStyle('opacity', val / 100)"
          :min="0"
          :max="100"
        />
      </div>
    </div>

    <!-- 层级 -->
    <div class="property-section">
      <div class="property-section-title">层级</div>
      <n-space>
        <n-button size="tiny" @click="canvasStore.bringToFront(component.id)">
          置顶
        </n-button>
        <n-button size="tiny" @click="canvasStore.bringForward(component.id)">
          上移
        </n-button>
        <n-button size="tiny" @click="canvasStore.sendBackward(component.id)">
          下移
        </n-button>
        <n-button size="tiny" @click="canvasStore.sendToBack(component.id)">
          置底
        </n-button>
      </n-space>
    </div>

    <!-- 操作 -->
    <div class="property-section">
      <div class="property-section-title">操作</div>
      <n-button
        type="error"
        size="small"
        block
        @click="handleDelete"
      >
        删除组件
      </n-button>
    </div>
  </div>
</template>

<script setup>
import { useMessage } from 'naive-ui'
import { useCanvasStore } from '@/stores/canvas'

const props = defineProps({
  component: {
    type: Object,
    required: true
  }
})

const message = useMessage()
const canvasStore = useCanvasStore()

const borderOptions = [
  { label: '无', value: 'none' },
  { label: '实线', value: 'solid' },
  { label: '虚线', value: 'dashed' },
  { label: '点线', value: 'dotted' }
]

const updatePosition = (key, value) => {
  canvasStore.updateComponent(props.component.id, { [key]: value || 0 })
}

const updateSize = (key, value) => {
  canvasStore.updateComponent(props.component.id, { [key]: Math.max(50, value || 50) })
}

const updateStyle = (key, value) => {
  canvasStore.updateComponentProps(props.component.id, {
    style: {
      ...props.component.style,
      [key]: value
    }
  })
}

const handleDelete = () => {
  canvasStore.removeComponent(props.component.id)
  message.success('组件已删除')
}
</script>
