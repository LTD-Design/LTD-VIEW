<template>
  <div class="form-component">
    <!-- 筛选器（多字段表单） -->
    <template v-if="type === 'form-filter'">
      <div class="filter-form">
        <div v-if="config.props?.title" class="filter-title">
          {{ config.props.title }}
        </div>
        <n-form
          :layout="config.props?.layout || 'inline'"
          :label-width="config.props?.labelWidth || 80"
          size="small"
        >
          <template v-for="field in formFields" :key="field.key">
            <n-form-item :label="field.label">
              <!-- 输入框 -->
              <n-input
                v-if="field.type === 'input'"
                v-model:value="fieldValues[field.key]"
                :placeholder="field.placeholder || '请输入'"
                size="small"
                clearable
                @update:value="handleFieldChange(field.key, $event)"
              />

              <!-- 下拉选择 -->
              <n-select
                v-else-if="field.type === 'select'"
                v-model:value="fieldValues[field.key]"
                :placeholder="field.placeholder || '请选择'"
                :options="field.options || []"
                size="small"
                clearable
                @update:value="handleFieldChange(field.key, $event)"
              />

              <!-- 日期选择 -->
              <n-date-picker
                v-else-if="field.type === 'date'"
                v-model:value="fieldValues[field.key]"
                :type="field.dateType || 'date'"
                :placeholder="field.placeholder || '请选择日期'"
                size="small"
                clearable
                @update:value="handleFieldChange(field.key, $event)"
              />

              <!-- 日期范围 -->
              <n-date-picker
                v-else-if="field.type === 'daterange'"
                v-model:value="fieldValues[field.key]"
                type="daterange"
                :placeholder="field.placeholder || '选择日期范围'"
                size="small"
                clearable
                @update:value="handleFieldChange(field.key, $event)"
              />

              <!-- 开关 -->
              <n-switch
                v-else-if="field.type === 'switch'"
                v-model:value="fieldValues[field.key]"
                @update:value="handleFieldChange(field.key, $event)"
              />

              <!-- 滑块 -->
              <n-slider
                v-else-if="field.type === 'slider'"
                v-model:value="fieldValues[field.key]"
                :min="field.min || 0"
                :max="field.max || 100"
                :step="field.step || 1"
                @update:value="handleFieldChange(field.key, $event)"
              />
            </n-form-item>
          </template>

          <n-form-item>
            <n-button type="primary" size="small" @click="handleSearch"> 查询 </n-button>
            <n-button size="small" style="margin-left: 8px" @click="handleReset"> 重置 </n-button>
          </n-form-item>
        </n-form>
      </div>
    </template>

    <!-- 输入框 -->
    <template v-else-if="type === 'form-input'">
      <div class="form-item-wrapper">
        <div v-if="config.props?.label" class="form-label">
          {{ config.props.label }}
        </div>
        <n-input
          :value="config.props?.value"
          :placeholder="config.props?.placeholder || '请输入'"
          size="small"
          @update:value="handleSimpleChange"
        />
      </div>
    </template>

    <!-- 下拉选择 -->
    <template v-else-if="type === 'form-select'">
      <div class="form-item-wrapper">
        <div v-if="config.props?.label" class="form-label">
          {{ config.props.label }}
        </div>
        <n-select
          :value="config.props?.value"
          :placeholder="config.props?.placeholder || '请选择'"
          :options="config.props?.options || []"
          size="small"
          @update:value="handleSimpleChange"
        />
      </div>
    </template>

    <!-- 日期选择 -->
    <template v-else-if="type === 'form-date'">
      <div class="form-item-wrapper">
        <div v-if="config.props?.label" class="form-label">
          {{ config.props.label }}
        </div>
        <n-date-picker
          :value="config.props?.value"
          :placeholder="config.props?.placeholder || '请选择日期'"
          :type="config.props?.type || 'date'"
          size="small"
          @update:value="handleSimpleChange"
        />
      </div>
    </template>

    <template v-else>
      <div class="form-placeholder">未知表单类型: {{ type }}</div>
    </template>
  </div>
</template>

<script setup>
import { reactive, computed, watch } from 'vue'
import { useCanvasStore } from '@/stores/canvas'
import { triggerLinkageTargets } from '@/utils/formLinkage'

const props = defineProps({
  type: {
    type: String,
    required: true
  },
  config: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['field-change', 'search'])

const canvasStore = useCanvasStore()

// 表单字段定义
const formFields = computed(() => {
  if (props.config.props?.fields?.length > 0) {
    return props.config.props.fields
  }
  // 默认字段
  return [
    {
      key: 'dateRange',
      type: 'daterange',
      label: '日期范围',
      placeholder: '选择日期范围'
    },
    {
      key: 'category',
      type: 'select',
      label: '产品类别',
      placeholder: '请选择',
      options: [
        { label: '全部', value: '' },
        { label: '电子产品', value: 'electronics' },
        { label: '食品', value: 'food' },
        { label: '服装', value: 'clothing' }
      ]
    }
  ]
})

// 表单值
const fieldValues = reactive({})

// 初始化表单值
const initValues = () => {
  formFields.value.forEach((field) => {
    if (fieldValues[field.key] === undefined) {
      fieldValues[field.key] = field.defaultValue ?? (field.type === 'switch' ? false : null)
    }
  })
}

// 监听字段变化（联动其他组件）
const handleFieldChange = (key, value) => {
  fieldValues[key] = value
  emit('field-change', { key, value, allValues: { ...fieldValues } })

  // 触发联动
  triggerLinkageTargets(canvasStore, null, props.config.linkage, fieldValues)
}

const handleSearch = () => {
  emit('search', { ...fieldValues })
}

const handleReset = () => {
  formFields.value.forEach((field) => {
    fieldValues[field.key] = field.defaultValue ?? (field.type === 'switch' ? false : null)
  })
  handleSearch()
}

// 简单表单值变化
const handleSimpleChange = (value) => {
  canvasStore.updateComponentProps(props.config.id, { value })
}

// 初始化
initValues()
watch(formFields, initValues, { deep: true })
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.form-component {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  padding: $spacing-xs $spacing-md;
}

.filter-form {
  width: 100%;
}

.filter-title {
  font-size: $font-size-md;
  font-weight: 500;
  color: $text-primary;
  margin-bottom: $spacing-md;
}

.form-item-wrapper {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
}

.form-label {
  font-size: $font-size-sm;
  color: $text-secondary;
  white-space: nowrap;
}

.form-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $text-muted;
  font-size: $font-size-xs;
}
</style>
