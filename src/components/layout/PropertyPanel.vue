<template>
  <div class="property-panel">
    <div class="property-panel-header">
      <div class="property-panel-title">
        {{ canvasStore.selectedComponent ? '组件属性' : '画布属性' }}
      </div>
    </div>

    <div class="property-panel-tabs">
      <n-tabs type="segment" animated size="small">
        <n-tab-pane name="style" tab="样式">
          <div class="property-panel-body">
            <template v-if="canvasStore.selectedComponent">
              <StyleProperties :component="canvasStore.selectedComponent" />
            </template>
            <template v-else>
              <CanvasProperties />
            </template>
          </div>
        </n-tab-pane>

        <n-tab-pane name="data" tab="数据">
          <div class="property-panel-body">
            <template v-if="canvasStore.selectedComponent">
              <DataProperties :component="canvasStore.selectedComponent" />
            </template>
            <div v-else class="empty-hint">
              请先选择一个组件
            </div>
          </div>
        </n-tab-pane>

        <n-tab-pane name="interaction" tab="交互">
          <div class="property-panel-body">
            <template v-if="canvasStore.selectedComponent">
              <InteractionProperties :component="canvasStore.selectedComponent" />
            </template>
            <div v-else class="empty-hint">
              请先选择一个组件
            </div>
          </div>
        </n-tab-pane>
      </n-tabs>
    </div>
  </div>
</template>

<script setup>
import { useCanvasStore } from '@/stores/canvas'
import StyleProperties from './properties/StyleProperties.vue'
import DataProperties from './properties/DataProperties.vue'
import InteractionProperties from './properties/InteractionProperties.vue'
import CanvasProperties from './properties/CanvasProperties.vue'

const canvasStore = useCanvasStore()
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.empty-hint {
  color: $text-muted;
  text-align: center;
  padding: 40px 20px;
  font-size: $font-size-sm;
}
</style>
