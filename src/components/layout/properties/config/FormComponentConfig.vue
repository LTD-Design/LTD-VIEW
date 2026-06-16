<template>
  <div class="form-config">
    <!-- 筛选器字段管理 -->
    <template v-if="component.type === 'form-filter'">
      <div class="config-section">
        <div class="section-title">表单设置</div>
        <div class="config-row">
          <label>布局方式</label>
          <n-select
            :value="getProp('layout', 'inline')"
            :options="layoutOptions"
            size="small"
            style="flex: 1"
            @update:value="(v) => setProp('layout', v)"
          />
        </div>
        <div class="config-row">
          <label>标签宽度</label>
          <n-input-number
            :value="getProp('labelWidth', 80)"
            :min="40"
            :max="200"
            :step="10"
            size="small"
            @update:value="(v) => setProp('labelWidth', v)"
          />
        </div>
      </div>

      <div class="config-section">
        <div class="section-title">
          字段管理
          <n-button size="tiny" quaternary @click="addField">+ 添加字段</n-button>
        </div>
        <div v-for="(field, index) in fields" :key="index" class="field-item">
          <div class="field-header">
            <span class="field-index">#{{ index + 1 }}</span>
            <n-button size="tiny" quaternary type="error" @click="removeField(index)"
              >删除</n-button
            >
          </div>
          <div class="config-row">
            <label>字段名</label>
            <n-input
              :value="field.key"
              size="small"
              placeholder="key"
              @update:value="(v) => updateField(index, 'key', v)"
            />
          </div>
          <div class="config-row">
            <label>类型</label>
            <n-select
              :value="field.type"
              :options="fieldTypeOptions"
              size="small"
              style="flex: 1"
              @update:value="(v) => updateField(index, 'type', v)"
            />
          </div>
          <div class="config-row">
            <label>标签</label>
            <n-input
              :value="field.label"
              size="small"
              placeholder="显示名称"
              @update:value="(v) => updateField(index, 'label', v)"
            />
          </div>
          <div class="config-row">
            <label>占位符</label>
            <n-input
              :value="field.placeholder"
              size="small"
              placeholder="placeholder"
              @update:value="(v) => updateField(index, 'placeholder', v)"
            />
          </div>

          <!-- select 类型的选项配置 -->
          <template v-if="field.type === 'select'">
            <div class="config-row">
              <label>选项</label>
              <n-input
                :value="field.options ? JSON.stringify(field.options) : '[]'"
                size="small"
                type="textarea"
                :rows="2"
                placeholder='[{"label":"选项1","value":"v1"}]'
                @update:value="(v) => updateFieldOptions(index, v)"
              />
            </div>
          </template>
        </div>
      </div>
    </template>

    <!-- 单个表单组件 -->
    <template v-else>
      <div class="config-section">
        <div class="section-title">表单设置</div>
        <div class="config-row">
          <label>标签</label>
          <n-input
            :value="getProp('label', '')"
            size="small"
            @update:value="(v) => setProp('label', v)"
          />
        </div>
        <div class="config-row">
          <label>占位符</label>
          <n-input
            :value="getProp('placeholder', '')"
            size="small"
            @update:value="(v) => setProp('placeholder', v)"
          />
        </div>
        <div class="config-row">
          <label>禁用</label>
          <n-switch
            :value="getProp('disabled', false)"
            size="small"
            @update:value="(v) => setProp('disabled', v)"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { NSwitch, NInputNumber, NInput, NSelect, NButton } from 'naive-ui'
import { useCanvasStore } from '@/stores/canvas'

const props = defineProps({
  component: { type: Object, required: true }
})

const canvasStore = useCanvasStore()

const getProp = (key, defaultVal) => props.component.props?.[key] ?? defaultVal
const setProp = (key, value) =>
  canvasStore.updateComponentProps(props.component.id, { [key]: value })

const fields = computed(() => props.component.props?.fields || [])

const addField = () => {
  const f = [
    ...fields.value,
    {
      key: `field${fields.value.length + 1}`,
      type: 'input',
      label: `字段${fields.value.length + 1}`,
      placeholder: '请输入'
    }
  ]
  setProp('fields', f)
}

const removeField = (index) => {
  const f = fields.value.filter((_, i) => i !== index)
  setProp('fields', f)
}

const updateField = (index, field, value) => {
  const f = [...fields.value]
  f[index] = { ...f[index], [field]: value }
  setProp('fields', f)
}

const updateFieldOptions = (index, value) => {
  try {
    const options = JSON.parse(value)
    updateField(index, 'options', options)
  } catch {
    /* ignore parse error */
  }
}

const layoutOptions = [
  { label: '行内', value: 'inline' },
  { label: '水平', value: 'horizontal' },
  { label: '垂直', value: 'vertical' }
]

const fieldTypeOptions = [
  { label: '输入框', value: 'input' },
  { label: '下拉选择', value: 'select' },
  { label: '日期', value: 'date' },
  { label: '日期范围', value: 'daterange' },
  { label: '开关', value: 'switch' },
  { label: '滑块', value: 'slider' }
]
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.form-config {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.config-section {
  .section-title {
    font-size: $font-size-xs;
    color: $text-muted;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: $spacing-sm;
    padding-bottom: $spacing-xs;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}

.config-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: $spacing-sm;

  label {
    font-size: $font-size-sm;
    color: $text-secondary;
    flex-shrink: 0;
    margin-right: $spacing-sm;
  }
}

.field-item {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: $border-radius;
  padding: $spacing-sm;
  margin-bottom: $spacing-sm;

  .field-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: $spacing-xs;

    .field-index {
      font-size: $font-size-xs;
      color: $text-muted;
    }
  }
}
</style>
