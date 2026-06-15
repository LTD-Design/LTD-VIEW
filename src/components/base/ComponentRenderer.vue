<template>
  <div
    class="component-renderer"
    :style="rendererStyle"
    :class="rendererClasses"
  >
    <!-- 图表组件 -->
    <template v-if="isChart">
      <ChartComponent :type="component.type" :config="component" />
    </template>

    <!-- 表格组件 -->
    <template v-else-if="isTable">
      <TableComponent :type="component.type" :config="component" />
    </template>

    <!-- 表单组件 -->
    <template v-else-if="isForm">
      <FormComponent :type="component.type" :config="component" />
    </template>

    <!-- 文本组件 -->
    <template v-else-if="component.type === 'title'">
      <div class="text-title" :style="titleStyle">
        {{ component.props?.text || '标题' }}
      </div>
    </template>

    <template v-else-if="component.type === 'subtitle'">
      <div class="text-subtitle" :style="subtitleStyle">
        {{ component.props?.text || '副标题' }}
      </div>
    </template>

    <template v-else-if="component.type === 'number'">
      <NumberFlip :config="component.props" />
    </template>

    <!-- 媒体组件 -->
    <template v-else-if="component.type === 'image'">
      <div class="media-image">
        <img
          v-if="component.props?.src"
          :src="component.props.src"
          :alt="component.props.alt"
          :style="{ objectFit: component.props?.fit || 'contain' }"
        />
        <div v-else class="image-placeholder">
          <span>🖼️</span>
          <span>图片</span>
        </div>
      </div>
    </template>

    <!-- 装饰组件 -->
    <template v-else-if="component.type === 'border'">
      <div class="decorator-border" :style="borderStyle"></div>
    </template>

    <template v-else-if="component.type === 'divider'">
      <div class="decorator-divider" :style="dividerStyle"></div>
    </template>

    <!-- 容器组件 -->
    <template v-else-if="component.type === 'card'">
      <div class="container-card">
        <div v-if="component.props?.title" class="card-title">
          {{ component.props.title }}
        </div>
        <div class="card-body">
          <slot></slot>
        </div>
      </div>
    </template>

    <!-- 默认 -->
    <template v-else>
      <div class="component-placeholder">
        <span>{{ component.type }}</span>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { COMPONENT_CATEGORIES } from '@/config/components'
import { componentRegistry } from '@/config/components'
import ChartComponent from '@/components/charts/ChartComponent.vue'
import TableComponent from '@/components/tables/TableComponent.vue'
import FormComponent from '@/components/forms/FormComponent.vue'
import NumberFlip from '@/components/base/NumberFlip.vue'

const props = defineProps({
  component: {
    type: Object,
    required: true
  }
})

// 获取组件分类
const getComponentCategory = () => {
  const meta = componentRegistry.find(c => c.type === props.component.type)
  return meta?.category || ''
}

const isChart = computed(() => getComponentCategory() === COMPONENT_CATEGORIES.CHART)
const isTable = computed(() => getComponentCategory() === COMPONENT_CATEGORIES.TABLE)
const isForm = computed(() => getComponentCategory() === COMPONENT_CATEGORIES.FORM)

// 渲染器样式
const rendererStyle = computed(() => ({
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  background: props.component.style?.background || 'transparent',
  borderStyle: props.component.style?.borderStyle || 'none',
  borderWidth: props.component.style?.borderStyle !== 'none' ? '1px' : '0',
  borderColor: props.component.style?.borderColor || '#1e3a5f',
  borderRadius: `${props.component.style?.borderRadius || 0}px`,
  opacity: props.component.style?.opacity ?? 1
}))

// 动画和悬停效果类名
const rendererClasses = computed(() => {
  const classes = []

  // 入场动画
  const entrance = props.component.animation?.entrance
  if (entrance) {
    classes.push(`anim-${entrance}`)
  }

  // 悬停效果
  const hover = props.component.interaction?.hover
  if (hover?.enabled) {
    classes.push('hover-scale')
    if (hover.shadow && hover.shadow !== 'none') {
      classes.push(`hover-shadow-${hover.shadow}`)
    }
  }

  return classes
})

// 标题样式
const titleStyle = computed(() => ({
  color: props.component.props?.color || '#ffffff',
  textAlign: props.component.props?.align || 'left',
  fontSize: props.component.props?.level === 1 ? '24px' :
            props.component.props?.level === 2 ? '20px' : '16px',
  fontWeight: '600'
}))

// 副标题样式
const subtitleStyle = computed(() => ({
  color: props.component.props?.color || '#a0aec0',
  textAlign: props.component.props?.align || 'left',
  fontSize: '14px'
}))

// 边框样式
const borderStyle = computed(() => ({
  width: '100%',
  height: '100%',
  borderStyle: props.component.props?.style || 'solid',
  borderWidth: `${props.component.props?.width || 1}px`,
  borderColor: props.component.props?.color || '#1e3a5f',
  borderRadius: `${props.component.props?.radius || 0}px`
}))

// 分割线样式
const dividerStyle = computed(() => ({
  width: props.component.props?.direction === 'vertical' ? '1px' : '100%',
  height: props.component.props?.direction === 'vertical' ? '100%' : `${props.component.props?.width || 1}px`,
  background: props.component.props?.color || '#1e3a5f'
}))
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.component-renderer {
  width: 100%;
  height: 100%;
  position: relative;
}

.text-title,
.text-subtitle {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 $spacing-md;
}

.media-image {
  width: 100%;
  height: 100%;

  img {
    width: 100%;
    height: 100%;
  }
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: $bg-card;
  color: $text-muted;
  font-size: $font-size-md;
  gap: $spacing-sm;

  span:first-child {
    font-size: 32px;
  }
}

.decorator-border {
  width: 100%;
  height: 100%;
}

.decorator-divider {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.container-card {
  width: 100%;
  height: 100%;
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $border-radius;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.card-title {
  padding: $spacing-md;
  font-size: $font-size-md;
  font-weight: 500;
  color: $text-primary;
  border-bottom: 1px solid $border-color;
}

.card-body {
  flex: 1;
  padding: $spacing-md;
  overflow: auto;
}

.component-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $bg-card;
  color: $text-muted;
  font-size: $font-size-xs;
}
</style>
