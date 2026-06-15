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
          :min="400"
          :step="10"
        />
      </div>
      <div class="property-row">
        <span class="property-label">高度</span>
        <n-input-number
          v-model:value="canvasStore.canvasConfig.height"
          size="small"
          :min="300"
          :step="10"
        />
      </div>

      <!-- 预设分辨率 -->
      <div class="property-row">
        <span class="property-label">预设</span>
      </div>
      <div class="preset-grid">
        <n-button
          v-for="preset in resolutionPresets"
          :key="preset.label"
          size="tiny"
          :type="isActivePreset(preset) ? 'primary' : 'default'"
          @click="setPresetSize(preset)"
        >
          {{ preset.label }}
        </n-button>
      </div>

      <!-- 适配当前屏幕 -->
      <n-button size="tiny" block @click="fitToScreen" style="margin-top: 8px;">
        适配当前屏幕 ({{ screenWidth }}x{{ screenHeight }})
      </n-button>
    </div>

    <!-- 外观 -->
    <div class="property-section">
      <div class="property-section-title">外观</div>
      <div class="property-row">
        <span class="property-label">背景色</span>
        <n-color-picker
          v-model:value="canvasStore.canvasConfig.background"
          size="small"
          :show-alpha="true"
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

    <!-- 导入导出 -->
    <div class="property-section">
      <div class="property-section-title">导入导出</div>
      <n-space vertical>
        <n-button size="small" block @click="handleImport">
          导入 JSON 配置
        </n-button>
        <n-button size="small" block @click="handleExportJson">
          导出 JSON 配置
        </n-button>
        <n-button size="small" block @click="handleExportHtml">
          导出独立 HTML
        </n-button>
      </n-space>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useMessage } from 'naive-ui'
import { useCanvasStore } from '@/stores/canvas'
import { exportToHtml, downloadHtml } from '@/utils/exportHtml'
import { themes, chartColors } from '@/config/themes'

const message = useMessage()
const canvasStore = useCanvasStore()

const screenWidth = ref(window.innerWidth)
const screenHeight = ref(window.innerHeight)

const resolutionPresets = [
  { label: '720p', width: 1280, height: 720 },
  { label: '1080p', width: 1920, height: 1080 },
  { label: '2K', width: 2560, height: 1440 },
  { label: '4K', width: 3840, height: 2160 },
  { label: '平板', width: 1024, height: 768 },
  { label: '手机', width: 375, height: 812 }
]

const themeOptions = [
  { label: '深色', value: 'dark' },
  { label: '科技蓝', value: 'blue' },
  { label: '自然绿', value: 'green' },
  { label: '梦幻紫', value: 'purple' }
]

const isActivePreset = (preset) => {
  return canvasStore.canvasConfig.width === preset.width &&
         canvasStore.canvasConfig.height === preset.height
}

const setPresetSize = (preset) => {
  canvasStore.canvasConfig.width = preset.width
  canvasStore.canvasConfig.height = preset.height
}

const fitToScreen = () => {
  canvasStore.canvasConfig.width = screenWidth.value
  canvasStore.canvasConfig.height = screenHeight.value
  message.info(`画布已设为 ${screenWidth.value}x${screenHeight.value}`)
}

const handleResize = () => {
  screenWidth.value = window.innerWidth
  screenHeight.value = window.innerHeight
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

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

const handleExportJson = () => {
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

const handleExportHtml = () => {
  const config = canvasStore.exportConfig()
  const html = exportToHtml(config, canvasStore.components, { themes, chartColors })
  downloadHtml(html, `${config.name || 'dashboard'}.html`)
  message.success('HTML 文件已导出')
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

.preset-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: $spacing-xs;
}
</style>
