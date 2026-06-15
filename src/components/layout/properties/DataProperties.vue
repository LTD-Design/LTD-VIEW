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
          @update:value="handleTypeChange"
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
          :rows="8"
          placeholder='JSON 格式数据，例如：[{"name":"A","value":100}]'
          @update:value="handleStaticDataChange"
        />
        <div class="hint-text">
          输入 JSON 格式数据
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
            @update:value="handleApiChange"
          />
        </div>
        <div class="property-row">
          <span class="property-label">方法</span>
          <n-select
            v-model:value="apiMethod"
            size="small"
            :options="methodOptions"
            @update:value="handleApiChange"
          />
        </div>
        <div class="property-row">
          <span class="property-label">刷新</span>
          <n-input-number
            v-model:value="refreshInterval"
            size="small"
            :min="0"
            :step="1000"
            placeholder="毫秒"
          />
        </div>
      </div>
    </template>

    <!-- 数据映射 -->
    <div class="property-section">
      <div class="property-section-title">数据映射</div>
      <div class="property-row">
        <span class="property-label">X 字段</span>
        <n-input
          v-model:value="mapping.xField"
          size="small"
          placeholder="xField"
          @update:value="handleMappingChange"
        />
      </div>
      <div class="property-row">
        <span class="property-label">Y 字段</span>
        <n-input
          v-model:value="mapping.yField"
          size="small"
          placeholder="yField"
          @update:value="handleMappingChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useCanvasStore } from '@/stores/canvas'

const props = defineProps({
  component: {
    type: Object,
    required: true
  }
})

const canvasStore = useCanvasStore()

const dataSourceType = ref(props.component.data?.type || 'static')
const staticData = ref(JSON.stringify(props.component.data?.source || [], null, 2))
const apiUrl = ref(props.component.data?.url || '')
const apiMethod = ref(props.component.data?.method || 'GET')
const refreshInterval = ref(props.component.data?.refreshInterval || 0)
const mapping = reactive({
  xField: props.component.data?.mapping?.xField || '',
  yField: props.component.data?.mapping?.yField || ''
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
  canvasStore.updateComponentProps(props.component.id, {
    data: {
      ...props.component.data,
      ...data
    }
  })
}

const handleTypeChange = (value) => {
  updateData({ type: value })
}

const handleStaticDataChange = (value) => {
  try {
    const parsed = JSON.parse(value)
    updateData({ source: parsed })
  } catch (e) {
    // JSON 格式错误，忽略
  }
}

const handleApiChange = () => {
  updateData({
    url: apiUrl.value,
    method: apiMethod.value,
    refreshInterval: refreshInterval.value
  })
}

const handleMappingChange = () => {
  updateData({
    mapping: { ...mapping }
  })
}

watch(refreshInterval, handleApiChange)
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.hint-text {
  font-size: $font-size-xs;
  color: $text-muted;
  margin-top: $spacing-xs;
}
</style>
