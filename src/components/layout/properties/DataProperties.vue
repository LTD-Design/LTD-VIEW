<template>
  <div class="data-properties">
    <!-- 数据源类型 -->
    <div class="property-section">
      <div class="property-section-title">数据源</div>
      <div class="property-row">
        <span class="property-label">类型</span>
        <n-select
          v-model:value="dataSourceType"
          size="small"
          :options="dataSourceOptions"
        />
      </div>
    </div>

    <!-- 静态数据 -->
    <template v-if="dataSourceType === 'static'">
      <div class="property-section">
        <div class="property-section-title">静态数据</div>
        <n-input
          v-model:value="staticData"
          type="textarea"
          :rows="10"
          placeholder='JSON 格式，例如：[{"name":"A","value":100}]'
        />
        <div class="data-actions">
          <n-button size="tiny" @click="handleFormatJson">
            格式化
          </n-button>
          <n-button size="tiny" @click="handleLoadSample">
            加载示例
          </n-button>
          <span v-if="parseError" class="parse-error">{{ parseError }}</span>
          <span v-else class="data-count">{{ dataCount }} 条数据</span>
        </div>
      </div>
    </template>

    <!-- API 数据 -->
    <template v-if="dataSourceType === 'api'">
      <div class="property-section">
        <div class="property-section-title">API 配置</div>
        <div class="property-row">
          <span class="property-label">URL</span>
          <n-input
            v-model:value="apiUrl"
            size="small"
            placeholder="https://api.example.com/data"
          />
        </div>
        <div class="property-row">
          <span class="property-label">方法</span>
          <n-select
            v-model:value="apiMethod"
            size="small"
            :options="methodOptions"
          />
        </div>
        <div class="property-row">
          <span class="property-label">响应路径</span>
          <n-input
            v-model:value="responsePath"
            size="small"
            placeholder="如 data.list（嵌套用.分隔）"
          />
        </div>
        <div class="property-row">
          <span class="property-label">请求头</span>
          <n-input
            v-model:value="headersStr"
            size="small"
            placeholder='{"Authorization": "Bearer xxx"}'
          />
        </div>
        <div class="property-row">
          <span class="property-label">刷新间隔</span>
          <n-input-number
            v-model:value="refreshInterval"
            size="small"
            :min="0"
            :step="1000"
            placeholder="毫秒（0=不刷新）"
          />
        </div>
        <n-button size="small" block @click="handleTestApi" :loading="testing">
          测试接口
        </n-button>
        <div v-if="testResult" :class="['test-result', testResult.success ? 'success' : 'error']">
          {{ testResult.message }}
        </div>
      </div>
    </template>

    <!-- 数据映射 -->
    <div class="property-section">
      <div class="property-section-title">数据映射</div>
      <div class="property-row">
        <span class="property-label">名称字段</span>
        <n-input
          v-model:value="mapping.xField"
          size="small"
          placeholder="如 name、region"
        />
      </div>
      <div class="property-row">
        <span class="property-label">数值字段</span>
        <n-input
          v-model:value="mapping.yField"
          size="small"
          placeholder="如 value、sales"
        />
      </div>
      <div class="property-row">
        <span class="property-label">系列字段</span>
        <n-input
          v-model:value="mapping.seriesField"
          size="small"
          placeholder="如 category（可选）"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue'
import { useMessage } from 'naive-ui'
import { useCanvasStore } from '@/stores/canvas'
import { useDataStore } from '@/stores/data'
import { getStaticData, mapData } from '@/utils/dataAdapter'

const props = defineProps({
  component: {
    type: Object,
    required: true
  }
})

const message = useMessage()
const canvasStore = useCanvasStore()
const dataStore = useDataStore()

const dataSourceType = ref(props.component.data?.type || 'static')
const staticData = ref(
  typeof props.component.data?.source === 'string'
    ? props.component.data.source
    : JSON.stringify(props.component.data?.source || [], null, 2)
)
const apiUrl = ref(props.component.data?.url || '')
const apiMethod = ref(props.component.data?.method || 'GET')
const responsePath = ref(props.component.data?.responsePath || '')
const headersStr = ref(
  props.component.data?.headers ? JSON.stringify(props.component.data.headers) : ''
)
const refreshInterval = ref(props.component.data?.refreshInterval || 0)
const testing = ref(false)
const testResult = ref(null)

const mapping = reactive({
  xField: props.component.data?.mapping?.xField || '',
  yField: props.component.data?.mapping?.yField || '',
  seriesField: props.component.data?.mapping?.seriesField || ''
})

// 解析错误提示
const parseError = ref('')
const dataCount = computed(() => {
  try {
    const arr = JSON.parse(staticData.value)
    return Array.isArray(arr) ? arr.length : 0
  } catch {
    return 0
  }
})

const dataSourceOptions = [
  { label: '静态数据', value: 'static' },
  { label: 'API 接口', value: 'api' }
]

const methodOptions = [
  { label: 'GET', value: 'GET' },
  { label: 'POST', value: 'POST' },
  { label: 'PUT', value: 'PUT' },
  { label: 'DELETE', value: 'DELETE' }
]

const updateData = (data) => {
  canvasStore.updateComponent(props.component.id, {
    data: {
      ...props.component.data,
      ...data
    }
  })
}

// 静态数据变更
const handleStaticDataChange = () => {
  try {
    const parsed = JSON.parse(staticData.value)
    parseError.value = ''
    updateData({ source: parsed })

    // 更新 dataStore
    const mapped = mapData(parsed, mapping)
    dataStore.updateComponentData(props.component.id, parsed, mapping)
  } catch (e) {
    parseError.value = 'JSON 格式错误'
  }
}

const handleFormatJson = () => {
  try {
    const parsed = JSON.parse(staticData.value)
    staticData.value = JSON.stringify(parsed, null, 2)
    parseError.value = ''
  } catch {
    parseError.value = 'JSON 格式错误'
  }
}

const handleLoadSample = () => {
  const sampleData = [
    { name: '华东区', value: 125000 },
    { name: '华北区', value: 89000 },
    { name: '华南区', value: 156000 },
    { name: '华中区', value: 67000 },
    { name: '西南区', value: 45000 }
  ]
  staticData.value = JSON.stringify(sampleData, null, 2)
  parseError.value = ''
  updateData({ source: sampleData })
  dataStore.updateComponentData(props.component.id, sampleData, mapping)
  message.success('已加载示例数据')
}

// API 配置变更
const handleApiChange = () => {
  let headers = {}
  if (headersStr.value) {
    try {
      headers = JSON.parse(headersStr.value)
    } catch { /* ignore */ }
  }

  updateData({
    url: apiUrl.value,
    method: apiMethod.value,
    responsePath: responsePath.value,
    headers,
    refreshInterval: refreshInterval.value
  })
}

// 测试 API
const handleTestApi = async () => {
  if (!apiUrl.value) {
    message.warning('请输入 API URL')
    return
  }
  testing.value = true
  testResult.value = null

  try {
    const { fetchComponentData } = await import('@/utils/dataAdapter')
    const data = await fetchComponentData({
      data: {
        type: 'api',
        url: apiUrl.value,
        method: apiMethod.value,
        responsePath: responsePath.value,
        headers: headersStr.value ? JSON.parse(headersStr.value) : {}
      }
    })
    testResult.value = {
      success: true,
      message: `成功获取 ${data.length} 条数据`
    }
  } catch (e) {
    testResult.value = {
      success: false,
      message: `请求失败: ${e.message}`
    }
  } finally {
    testing.value = false
  }
}

// 映射变更
const handleMappingChange = () => {
  updateData({
    mapping: { ...mapping }
  })

  // 重新映射数据
  const rawData = getStaticData(props.component.data)
  dataStore.updateComponentData(props.component.id, rawData, mapping)
}

// 监听变化
watch(staticData, handleStaticDataChange)
watch([apiUrl, apiMethod, responsePath, headersStr], handleApiChange)
watch(refreshInterval, handleApiChange)
watch(mapping, handleMappingChange, { deep: true })
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.data-actions {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  margin-top: $spacing-xs;
}

.parse-error {
  font-size: $font-size-xs;
  color: $color-error;
}

.data-count {
  font-size: $font-size-xs;
  color: $text-muted;
  margin-left: auto;
}

.test-result {
  font-size: $font-size-xs;
  padding: $spacing-xs;
  border-radius: $border-radius;
  margin-top: $spacing-xs;

  &.success {
    color: $color-success;
    background: rgba(24, 160, 88, 0.1);
  }

  &.error {
    color: $color-error;
    background: rgba(208, 48, 80, 0.1);
  }
}
</style>
