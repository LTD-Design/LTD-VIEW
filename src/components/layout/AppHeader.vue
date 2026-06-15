<template>
  <div class="editor-header">
    <div class="editor-logo">LtdView</div>

    <div class="editor-toolbar">
      <n-button quaternary size="small" @click="handleUndo" :disabled="!canvasStore.canUndo">
        <template #icon><n-icon><UndoOutlined /></n-icon></template>
      </n-button>
      <n-button quaternary size="small" @click="handleRedo" :disabled="!canvasStore.canRedo">
        <template #icon><n-icon><RedoOutlined /></n-icon></template>
      </n-button>

      <n-divider vertical />

      <n-button quaternary size="small" @click="handleClear" :disabled="canvasStore.componentCount === 0">
        清空画布
      </n-button>
    </div>

    <div class="editor-actions">
      <n-button size="small" @click="handleExport">
        导出配置
      </n-button>
      <n-button size="small" type="primary" @click="handlePreview">
        预览
      </n-button>
    </div>
  </div>
</template>

<script setup>
import { h } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage, useDialog } from 'naive-ui'
import { UndoOutlined, RedoOutlined } from '@vicons/antd'
import { useCanvasStore } from '@/stores/canvas'

const router = useRouter()
const message = useMessage()
const dialog = useDialog()
const canvasStore = useCanvasStore()

const handleUndo = () => {
  canvasStore.undo()
  message.info('已撤销')
}

const handleRedo = () => {
  canvasStore.redo()
  message.info('已重做')
}

const handleClear = () => {
  dialog.warning({
    title: '确认清空',
    content: '确定要清空画布吗？此操作不可撤销。',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      canvasStore.clearCanvas()
      message.success('画布已清空')
    }
  })
}

const handleExport = () => {
  const config = canvasStore.exportConfig()
  const json = JSON.stringify(config, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${config.name || 'dashboard'}.json`
  a.click()
  URL.revokeObjectURL(url)
  message.success('配置已导出')
}

const handlePreview = () => {
  router.push('/preview')
}
</script>
