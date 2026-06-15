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
      <n-dropdown :options="exportOptions" @select="handleExportSelect" trigger="click">
        <n-button size="small">
          导出
          <template #icon><n-icon><DownOutlined /></n-icon></template>
        </n-button>
      </n-dropdown>

      <n-button size="small" @click="handleImport">
        导入
      </n-button>

      <n-button size="small" type="primary" @click="handlePreview">
        预览
      </n-button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useMessage, useDialog } from 'naive-ui'
import { UndoOutlined, RedoOutlined, DownOutlined } from '@vicons/antd'
import { useCanvasStore } from '@/stores/canvas'
import { exportToHtml, downloadHtml } from '@/utils/exportHtml'
import { themes, chartColors } from '@/config/themes'

const router = useRouter()
const message = useMessage()
const dialog = useDialog()
const canvasStore = useCanvasStore()

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
      message.success('画布已清空')
    }
  })
}

const handleExportSelect = (key) => {
  if (key === 'json') {
    exportJson()
  } else if (key === 'html') {
    exportHtml()
  }
}

const exportJson = () => {
  const config = canvasStore.exportConfig()
  const json = JSON.stringify(config, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${config.name || 'dashboard'}.json`
  a.click()
  URL.revokeObjectURL(url)
  message.success('JSON 配置已导出')
}

const exportHtml = () => {
  const config = canvasStore.exportConfig()
  const html = exportToHtml(config, canvasStore.components, { themes, chartColors })
  downloadHtml(html, `${config.name || 'dashboard'}.html`)
  message.success('HTML 文件已导出')
}

const handleImport = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json'
  input.onchange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    try {
      const text = await file.text()
      const config = JSON.parse(text)
      canvasStore.importConfig(config)
      message.success('配置已导入')
    } catch (err) {
      message.error('配置文件格式错误')
    }
  }
  input.click()
}

const handlePreview = () => {
  router.push('/preview')
}
</script>
