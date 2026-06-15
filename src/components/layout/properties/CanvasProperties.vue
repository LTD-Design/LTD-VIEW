<template>
  <div class="canvas-properties">
    <!-- 基本信息 -->
    <div class="property-section">
      <div class="property-section-title">基本信息</div>
      <div class="property-row">
        <span class="property-label">名称</span>
        <n-input
          v-model:value="canvasStore.canvasConfig.name"
          size="small"
          placeholder="仪表盘名称"
        />
      </div>
    </div>

    <!-- 画布尺寸 -->
    <div class="property-section">
      <div class="property-section-title">画布尺寸</div>
      <div class="property-row">
        <span class="property-label">宽度</span>
        <n-input-number
          v-model:value="canvasStore.canvasConfig.width"
          size="small"
          :min="800"
          :step="10"
        />
      </div>
      <div class="property-row">
        <span class="property-label">高度</span>
        <n-input-number
          v-model:value="canvasStore.canvasConfig.height"
          size="small"
          :min="600"
          :step="10"
        />
      </div>
      <div class="property-row">
        <n-button size="tiny" @click="setPresetSize('1080p')">
          1920x1080
        </n-button>
        <n-button size="tiny" @click="setPresetSize('2k')">
          2560x1440
        </n-button>
        <n-button size="tiny" @click="setPresetSize('4k')">
          3840x2160
        </n-button>
      </div>
    </div>

    <!-- 外观 -->
    <div class="property-section">
      <div class="property-section-title">外观</div>
      <div class="property-row">
        <span class="property-label">背景色</span>
        <n-color-picker
          v-model:value="canvasStore.canvasConfig.background"
          size="small"
          :show-alpha="false"
        />
      </div>
      <div class="property-row">
        <span class="property-label">主题</span>
        <n-select
          v-model:value="canvasStore.canvasConfig.theme"
          size="small"
          :options="themeOptions"
        />
      </div>
    </div>

    <!-- 统计信息 -->
    <div class="property-section">
      <div class="property-section-title">统计</div>
      <div class="stat-row">
        <span class="stat-label">组件数量</span>
        <span class="stat-value">{{ canvasStore.componentCount }}</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">历史记录</span>
        <span class="stat-value">{{ canvasStore.historyIndex + 1 }} / {{ canvasStore.history.length }}</span>
      </div>
    </div>

    <!-- 操作 -->
    <div class="property-section">
      <div class="property-section-title">操作</div>
      <n-space vertical>
        <n-button size="small" block @click="handleImport">
          导入配置
        </n-button>
        <n-button size="small" block @click="handleExport">
          导出配置
        </n-button>
      </n-space>
    </div>
  </div>
</template>

<script setup>
import { useMessage, useDialog } from 'naive-ui'
import { useCanvasStore } from '@/stores/canvas'

const message = useMessage()
const dialog = useDialog()
const canvasStore = useCanvasStore()

const themeOptions = [
  { label: '深色', value: 'dark' },
  { label: '科技蓝', value: 'blue' },
  { label: '自然绿', value: 'green' },
  { label: '梦幻紫', value: 'purple' }
]

const setPresetSize = (preset) => {
  const sizes = {
    '1080p': { width: 1920, height: 1080 },
    '2k': { width: 2560, height: 1440 },
    '4k': { width: 3840, height: 2160 }
  }
  const size = sizes[preset]
  canvasStore.canvasConfig.width = size.width
  canvasStore.canvasConfig.height = size.height
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
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.stat-row {
  display: flex;
  justify-content: space-between;
  padding: $spacing-xs 0;
  font-size: $font-size-sm;
}

.stat-label {
  color: $text-muted;
}

.stat-value {
  color: $text-secondary;
}
</style>
