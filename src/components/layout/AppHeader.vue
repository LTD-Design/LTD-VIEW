<template>
  <div class="editor-header">
    <div class="editor-logo">LtdView</div>

    <div class="editor-toolbar">
      <n-button quaternary size="small" :disabled="!canvasStore.canUndo" @click="handleUndo">
        <template #icon
          ><n-icon><UndoOutlined /></n-icon
        ></template>
      </n-button>
      <n-button quaternary size="small" :disabled="!canvasStore.canRedo" @click="handleRedo">
        <template #icon
          ><n-icon><RedoOutlined /></n-icon
        ></template>
      </n-button>

      <n-divider vertical />

      <n-button
        quaternary
        size="small"
        :disabled="canvasStore.componentCount === 0"
        @click="handleClear"
      >
        清空画布
      </n-button>
    </div>

    <div class="editor-actions">
      <n-dropdown :options="exportOptions" trigger="click" @select="handleExportSelect">
        <n-button size="small">
          导出
          <template #icon
            ><n-icon><DownOutlined /></n-icon
          ></template>
        </n-button>
      </n-dropdown>

      <n-button size="small" @click="handleImport"> 导入 </n-button>

      <n-button size="small" type="primary" @click="handlePreview"> 预览 </n-button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useDialog } from 'naive-ui'
import { UndoOutlined, RedoOutlined, DownOutlined } from '@vicons/antd'
import { useCanvasStore } from '@/stores/canvas'
import { useExportDashboard } from '@/composables/useExportDashboard'

const router = useRouter()
const dialog = useDialog()
const canvasStore = useCanvasStore()
const { exportJson, exportHtmlFile, importJson } = useExportDashboard(canvasStore)

const exportOptions = [
  { label: '导出 JSON 配置', key: 'json' },
  { label: '导出独立 HTML', key: 'html' }
]

const handleUndo = () => {
  canvasStore.undo()
}

const handleRedo = () => {
  canvasStore.redo()
}

const handleClear = () => {
  dialog.warning({
    title: '确认清空',
    content: '确定要清空画布吗？此操作不可撤销。',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      canvasStore.clearCanvas()
    }
  })
}

const handleExportSelect = (key) => {
  if (key === 'json') {
    exportJson()
  } else if (key === 'html') {
    exportHtmlFile()
  }
}

const handlePreview = () => {
  router.push('/preview')
}
</script>
