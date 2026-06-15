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
        <div class="drill-levels-section">
          <div class="property-section-title">下钻层级</div>
          <div
            v-for="(level, index) in drillLevels"
            :key="index"
            class="drill-level-item"
          >
            <div class="drill-level-header">
              <span class="drill-level-num">L{{ index + 1 }}</span>
              <n-input
                v-model:value="level.name"
                size="tiny"
                placeholder="层级名称"
                class="drill-level-name"
              />
              <n-button
                size="tiny"
                quaternary
                type="error"
                @click="removeDrillLevel(index)"
              >
                x
              </n-button>
            </div>
            <div class="drill-level-fields">
              <n-input
                v-model:value="level.field"
                size="tiny"
                placeholder="字段名"
              />
              <n-input
                v-model:value="level.apiEndpoint"
                size="tiny"
                placeholder="API 接口（可选）"
              />
            </div>
          </div>
          <n-button size="tiny" dashed block @click="addDrillLevel">
            + 添加层级
          </n-button>
        </div>

        <div class="property-row">
          <span class="property-label">行为</span>
          <n-select
            v-model:value="clickAction.behavior"
            size="small"
            :options="behaviorOptions"
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
import { reactive, watch } from 'vue'
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
  behavior: props.component.interaction?.click?.behavior || 'replace',
  showBreadcrumb: props.component.interaction?.click?.showBreadcrumb ?? true,
  targets: props.component.interaction?.click?.targets || []
})

const drillLevels = reactive(
  props.component.interaction?.click?.levels?.length > 0
    ? props.component.interaction.click.levels.map(l => ({ ...l }))
    : [{ name: '第一级', field: '', apiEndpoint: '' }]
)

const hoverEffect = reactive({
  enabled: props.component.interaction?.hover?.enabled ?? false,
  scale: props.component.interaction?.hover?.scale || 105,
  shadow: props.component.interaction?.hover?.shadow || 'md'
})

const animation = reactive({
  entrance: props.component.animation?.entrance || '',
  duration: props.component.animation?.duration || 500
})

// 保存到 store
const saveInteraction = () => {
  canvasStore.updateComponent(props.component.id, {
    interaction: {
      click: {
        ...clickAction,
        levels: clickAction.type === 'drillDown' ? [...drillLevels] : undefined
      },
      hover: { ...hoverEffect }
    }
  })
}

const saveAnimation = () => {
  canvasStore.updateComponent(props.component.id, {
    animation: { ...animation }
  })
}

const addDrillLevel = () => {
  drillLevels.push({ name: `第${drillLevels.length + 1}级`, field: '', apiEndpoint: '' })
}

const removeDrillLevel = (index) => {
  if (drillLevels.length > 1) {
    drillLevels.splice(index, 1)
  }
}

// 监听变化并保存
watch(clickAction, saveInteraction, { deep: true })
watch(drillLevels, saveInteraction, { deep: true })
watch(hoverEffect, saveInteraction, { deep: true })
watch(animation, saveAnimation, { deep: true })

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

const behaviorOptions = [
  { label: '替换数据', value: 'replace' },
  { label: '弹窗展示', value: 'modal' }
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

<style scoped lang="scss">
@use '@/styles/variables' as *;

.drill-levels-section {
  margin-bottom: $spacing-sm;
}

.drill-level-item {
  background: $bg-dark;
  border: 1px solid $border-color;
  border-radius: $border-radius;
  padding: $spacing-sm;
  margin-bottom: $spacing-xs;
}

.drill-level-header {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  margin-bottom: $spacing-xs;
}

.drill-level-num {
  font-size: $font-size-xs;
  color: $color-primary;
  font-weight: 600;
  min-width: 24px;
}

.drill-level-name {
  flex: 1;
}

.drill-level-fields {
  display: flex;
  gap: $spacing-xs;
}
</style>
