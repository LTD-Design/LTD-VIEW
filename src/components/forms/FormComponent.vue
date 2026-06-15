<template>
  <div class="form-component">
    <template v-if="type === 'form-filter'">
      <div class="filter-form">
        <div class="filter-title" v-if="config.props?.title">
          {{ config.props.title }}
        </div>
        <n-form
          :layout="config.props?.layout || 'inline'"
          :label-width="config.props?.labelWidth || 80"
          size="small"
        >
          <n-form-item label="日期范围">
            <n-date-picker
              type="daterange"
              size="small"
              placeholder="选择日期范围"
            />
          </n-form-item>
          <n-form-item label="产品类别">
            <n-select
              size="small"
              placeholder="请选择"
              :options="categoryOptions"
              style="width: 160px"
            />
          </n-form-item>
          <n-form-item>
            <n-button type="primary" size="small">查询</n-button>
          </n-form-item>
        </n-form>
      </div>
    </template>

    <template v-else-if="type === 'form-input'">
      <div class="form-item-wrapper">
        <div class="form-label" v-if="config.props?.label">
          {{ config.props.label }}
        </div>
        <n-input
          :value="config.props?.value"
          :placeholder="config.props?.placeholder || '请输入'"
          size="small"
        />
      </div>
    </template>

    <template v-else-if="type === 'form-select'">
      <div class="form-item-wrapper">
        <div class="form-label" v-if="config.props?.label">
          {{ config.props.label }}
        </div>
        <n-select
          :value="config.props?.value"
          :placeholder="config.props?.placeholder || '请选择'"
          :options="config.props?.options || []"
          size="small"
        />
      </div>
    </template>

    <template v-else-if="type === 'form-date'">
      <div class="form-item-wrapper">
        <div class="form-label" v-if="config.props?.label">
          {{ config.props.label }}
        </div>
        <n-date-picker
          :value="config.props?.value"
          :placeholder="config.props?.placeholder || '请选择日期'"
          :type="config.props?.type || 'date'"
          size="small"
        />
      </div>
    </template>

    <template v-else>
      <div class="form-placeholder">
        未知表单类型: {{ type }}
      </div>
    </template>
  </div>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    required: true
  },
  config: {
    type: Object,
    required: true
  }
})

const categoryOptions = [
  { label: '全部', value: '' },
  { label: '电子产品', value: 'electronics' },
  { label: '食品', value: 'food' },
  { label: '服装', value: 'clothing' }
]
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
