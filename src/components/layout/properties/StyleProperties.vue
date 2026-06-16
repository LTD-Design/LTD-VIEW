<template>
  <div class="style-properties">
    <!-- 位置 -->
    <PropertySection title="位置">
      <div class="property-row">
        <span class="property-label">X</span>
        <n-input-number
          :value="component.x"
          size="small"
          :min="0"
          :step="10"
          @update:value="(val) => updatePosition('x', val)"
        />
      </div>
      <div class="property-row">
        <span class="property-label">Y</span>
        <n-input-number
          :value="component.y"
          size="small"
          :min="0"
          :step="10"
          @update:value="(val) => updatePosition('y', val)"
        />
      </div>
    </PropertySection>

    <!-- 尺寸 -->
    <PropertySection title="尺寸">
      <div class="property-row">
        <span class="property-label">宽度</span>
        <n-input-number
          :value="component.width"
          size="small"
          :min="50"
          :step="10"
          @update:value="(val) => updateSize('width', val)"
        />
      </div>
      <div class="property-row">
        <span class="property-label">高度</span>
        <n-input-number
          :value="component.height"
          size="small"
          :min="50"
          :step="10"
          @update:value="(val) => updateSize('height', val)"
        />
      </div>
    </PropertySection>

    <!-- 外观 -->
    <PropertySection title="外观">
      <div class="property-row">
        <span class="property-label">背景色</span>
        <n-color-picker
          :value="component.style?.background || 'transparent'"
          size="small"
          :show-alpha="true"
          @update:value="(val) => updateStyle('background', val)"
        />
      </div>
      <div class="property-row">
        <span class="property-label">边框</span>
        <n-select
          :value="component.style?.borderStyle || 'none'"
          size="small"
          :options="borderOptions"
          @update:value="(val) => updateStyle('borderStyle', val)"
        />
      </div>
      <div class="property-row">
        <span class="property-label">圆角</span>
        <n-input-number
          :value="component.style?.borderRadius || 0"
          size="small"
          :min="0"
          @update:value="(val) => updateStyle('borderRadius', val)"
        />
      </div>
      <div class="property-row">
        <span class="property-label">透明度</span>
        <n-slider
          :value="(component.style?.opacity || 1) * 100"
          :min="0"
          :max="100"
          @update:value="(val) => updateStyle('opacity', val / 100)"
        />
      </div>
    </PropertySection>

    <!-- 层级 -->
    <PropertySection title="层级">
      <n-space>
        <n-button size="tiny" @click="canvasStore.bringToFront(component.id)"> 置顶 </n-button>
        <n-button size="tiny" @click="canvasStore.bringForward(component.id)"> 上移 </n-button>
        <n-button size="tiny" @click="canvasStore.sendBackward(component.id)"> 下移 </n-button>
        <n-button size="tiny" @click="canvasStore.sendToBack(component.id)"> 置底 </n-button>
      </n-space>
    </PropertySection>

    <!-- 操作 -->
    <PropertySection title="操作">
      <n-button type="error" size="small" block @click="handleDelete"> 删除组件 </n-button>
    </PropertySection>
  </div>
</template>

<script setup>
import { useMessage } from 'naive-ui'
import { useCanvasStore } from '@/stores/canvas'
import PropertySection from './PropertySection.vue'

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
