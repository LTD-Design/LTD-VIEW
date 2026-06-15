<template>
  <div class="interaction-properties">
    <!-- 点击事件 -->
    <div class="property-section">
      <div class="property-section-title">点击事件</div>
      <div class="property-row">
        <span class="property-label">类型</span>
        <n-select
          v-model:value="clickAction.type"
          size="small"
          :options="actionOptions"
        />
      </div>

      <!-- 跳转链接 -->
      <template v-if="clickAction.type === 'link'">
        <div class="property-row">
          <span class="property-label">链接</span>
          <n-input
            v-model:value="clickAction.url"
            size="small"
            placeholder="https://example.com"
          />
        </div>
        <div class="property-row">
          <span class="property-label">打开方式</span>
          <n-select
            v-model:value="clickAction.target"
            size="small"
            :options="targetOptions"
          />
        </div>
      </template>

      <!-- 下钻配置 -->
      <template v-if="clickAction.type === 'drillDown'">
        <div class="property-row">
          <span class="property-label">下级接口</span>
          <n-input
            v-model:value="clickAction.apiEndpoint"
            size="small"
            placeholder="/api/drilldown"
          />
        </div>
        <div class="property-row">
          <span class="property-label">参数名</span>
          <n-input
            v-model:value="clickAction.paramName"
            size="small"
            placeholder="parentId"
          />
        </div>
        <div class="property-row">
          <n-checkbox v-model:checked="clickAction.showBreadcrumb">
            显示面包屑
          </n-checkbox>
        </div>
      </template>

      <!-- 联动组件 -->
      <template v-if="clickAction.type === 'linkage'">
        <div class="property-row">
          <span class="property-label">联动组件</span>
          <n-select
            v-model:value="clickAction.targets"
            size="small"
            multiple
            :options="componentOptions"
            placeholder="选择要联动的组件"
          />
        </div>
      </template>
    </div>

    <!-- 悬停效果 -->
    <div class="property-section">
      <div class="property-section-title">悬停效果</div>
      <div class="property-row">
        <n-checkbox v-model:checked="hoverEffect.enabled">
          启用悬停效果
        </n-checkbox>
      </div>
      <template v-if="hoverEffect.enabled">
        <div class="property-row">
          <span class="property-label">缩放</span>
          <n-slider
            v-model:value="hoverEffect.scale"
            :min="80"
            :max="120"
            :step="1"
          />
        </div>
        <div class="property-row">
          <span class="property-label">阴影</span>
          <n-select
            v-model:value="hoverEffect.shadow"
            size="small"
            :options="shadowOptions"
          />
        </div>
      </template>
    </div>

    <!-- 动画 -->
    <div class="property-section">
      <div class="property-section-title">动画</div>
      <div class="property-row">
        <span class="property-label">入场</span>
        <n-select
          v-model:value="animation.entrance"
          size="small"
          :options="animationOptions"
          clearable
        />
      </div>
      <div class="property-row" v-if="animation.entrance">
        <span class="property-label">时长</span>
        <n-input-number
          v-model:value="animation.duration"
          size="small"
          :min="100"
          :step="100"
          placeholder="毫秒"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useCanvasStore } from '@/stores/canvas'

const props = defineProps({
  component: {
    type: Object,
    required: true
  }
})

const canvasStore = useCanvasStore()

const clickAction = reactive({
  type: props.component.interaction?.click?.type || 'none',
  url: props.component.interaction?.click?.url || '',
  target: props.component.interaction?.click?.target || '_blank',
  apiEndpoint: props.component.interaction?.click?.apiEndpoint || '',
  paramName: props.component.interaction?.click?.paramName || '',
  showBreadcrumb: props.component.interaction?.click?.showBreadcrumb ?? true,
  targets: props.component.interaction?.click?.targets || []
})

const hoverEffect = reactive({
  enabled: props.component.interaction?.hover?.enabled ?? false,
  scale: props.component.interaction?.hover?.scale || 105,
  shadow: props.component.interaction?.hover?.shadow || 'md'
})

const animation = reactive({
  entrance: props.component.animation?.entrance || '',
  duration: props.component.animation?.duration || 500
})

const actionOptions = [
  { label: '无', value: 'none' },
  { label: '跳转链接', value: 'link' },
  { label: '数据下钻', value: 'drillDown' },
  { label: '联动组件', value: 'linkage' }
]

const targetOptions = [
  { label: '新窗口', value: '_blank' },
  { label: '当前窗口', value: '_self' }
]

const componentOptions = canvasStore.components
  .filter(c => c.id !== props.component.id)
  .map(c => ({
    label: `${c.type} (${c.id.slice(0, 8)})`,
    value: c.id
  }))

const shadowOptions = [
  { label: '无', value: 'none' },
  { label: '小', value: 'sm' },
  { label: '中', value: 'md' },
  { label: '大', value: 'lg' }
]

const animationOptions = [
  { label: '淡入', value: 'fadeIn' },
  { label: '从上滑入', value: 'slideInDown' },
  { label: '从下滑入', value: 'slideInUp' },
  { label: '从左滑入', value: 'slideInLeft' },
  { label: '从右滑入', value: 'slideInRight' },
  { label: '缩放', value: 'zoomIn' },
  { label: '弹跳', value: 'bounceIn' }
]
</script>
