<template>
  <div class="editor">
    <!-- 顶部工具栏 -->
    <AppHeader />

    <!-- 主体区域 -->
    <div class="editor-main">
      <!-- 左侧组件面板 -->
      <ComponentPanel />

      <!-- 中间画布区域 -->
      <CanvasArea />

      <!-- 右侧属性面板 -->
      <PropertyPanel />
    </div>
  </div>
</template>

<script setup>
import AppHeader from '@/components/layout/AppHeader.vue'
import ComponentPanel from '@/components/layout/ComponentPanel.vue'
import CanvasArea from '@/components/layout/CanvasArea.vue'
import PropertyPanel from '@/components/layout/PropertyPanel.vue'
</script>
