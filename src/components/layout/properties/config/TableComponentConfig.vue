<template>
  <div class="table-config">
    <!-- 表格通用配置 -->
    <template v-if="component.type === 'data-table'">
      <div class="config-section">
        <div class="section-title">表格设置</div>
        <div class="config-row">
          <label>分页</label>
          <n-switch
            :value="getProp('pagination', true)"
            size="small"
            @update:value="(v) => setProp('pagination', v)"
          />
        </div>
        <div class="config-row">
          <label>每页条数</label>
          <n-input-number
            :value="getProp('pageSize', 10)"
            :min="5"
            :max="100"
            :step="5"
            size="small"
            @update:value="(v) => setProp('pageSize', v)"
          />
        </div>
        <div class="config-row">
          <label>排序</label>
          <n-switch
            :value="getProp('sorting', true)"
            size="small"
            @update:value="(v) => setProp('sorting', v)"
          />
        </div>
        <div class="config-row">
          <label>筛选</label>
          <n-switch
            :value="getProp('filtering', true)"
            size="small"
            @update:value="(v) => setProp('filtering', v)"
          />
        </div>
        <div class="config-row">
          <label>斑马纹</label>
          <n-switch
            :value="getProp('stripe', true)"
            size="small"
            @update:value="(v) => setProp('stripe', v)"
          />
        </div>
        <div class="config-row">
          <label>边框</label>
          <n-switch
            :value="getProp('border', true)"
            size="small"
            @update:value="(v) => setProp('border', v)"
          />
        </div>
      </div>

      <!-- 列管理 -->
      <div class="config-section">
        <div class="section-title">
          列配置
          <n-button size="tiny" quaternary @click="addColumn">+ 添加列</n-button>
        </div>
        <div v-for="(col, index) in columns" :key="index" class="column-item">
          <div class="column-header">
            <span class="column-index">#{{ index + 1 }}</span>
            <n-button size="tiny" quaternary type="error" @click="removeColumn(index)"
              >删除</n-button
            >
          </div>
          <div class="config-row">
            <label>字段名</label>
            <n-input
              :value="col.key"
              size="small"
              placeholder="key"
              @update:value="(v) => updateColumn(index, 'key', v)"
            />
          </div>
          <div class="config-row">
            <label>标题</label>
            <n-input
              :value="col.title"
              size="small"
              placeholder="标题"
              @update:value="(v) => updateColumn(index, 'title', v)"
            />
          </div>
          <div class="config-row">
            <label>宽度</label>
            <n-input-number
              :value="col.width"
              size="small"
              :min="50"
              :max="500"
              :step="10"
              @update:value="(v) => updateColumn(index, 'width', v)"
            />
          </div>
          <div class="config-row">
            <label>对齐</label>
            <n-select
              :value="col.align || 'left'"
              :options="alignOptions"
              size="small"
              style="flex: 1"
              @update:value="(v) => updateColumn(index, 'align', v)"
            />
          </div>
          <div class="config-row">
            <label>格式化</label>
            <n-select
              :value="col.formatter || ''"
              :options="formatterOptions"
              size="small"
              style="flex: 1"
              @update:value="(v) => updateColumn(index, 'formatter', v || undefined)"
            />
          </div>
          <div class="config-row">
            <label>可排序</label>
            <n-switch
              :value="col.sortable"
              size="small"
              @update:value="(v) => updateColumn(index, 'sortable', v)"
            />
          </div>
          <div class="config-row">
            <label>可筛选</label>
            <n-switch
              :value="col.filterable"
              size="small"
              @update:value="(v) => updateColumn(index, 'filterable', v)"
            />
          </div>
        </div>
      </div>
    </template>

    <!-- 排名列表配置 -->
    <template v-else-if="component.type === 'rank-list'">
      <div class="config-section">
        <div class="section-title">排名列表设置</div>
        <div class="config-row">
          <label>显示排名</label>
          <n-switch
            :value="getProp('showNumber', true)"
            size="small"
            @update:value="(v) => setProp('showNumber', v)"
          />
        </div>
        <div class="config-row">
          <label>动画效果</label>
          <n-switch
            :value="getProp('animation', true)"
            size="small"
            @update:value="(v) => setProp('animation', v)"
          />
        </div>
        <div class="config-row">
          <label>显示条数</label>
          <n-input-number
            :value="getProp('topN', 10)"
            :min="1"
            :max="50"
            size="small"
            @update:value="(v) => setProp('topN', v)"
          />
        </div>
        <div class="config-row">
          <label>主色调</label>
          <n-color-picker
            :value="getProp('primaryColor', '#2080f0')"
            :show-alpha="false"
            size="small"
            @update:value="(v) => setProp('primaryColor', v)"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { NSwitch, NInputNumber, NInput, NSelect, NButton, NColorPicker } from 'naive-ui'
import { useCanvasStore } from '@/stores/canvas'

const props = defineProps({
  component: { type: Object, required: true }
})

const canvasStore = useCanvasStore()

const getProp = (key, defaultVal) => props.component.props?.[key] ?? defaultVal
const setProp = (key, value) =>
  canvasStore.updateComponentProps(props.component.id, { [key]: value })

const columns = computed(() => props.component.props?.columns || [])

const addColumn = () => {
  const cols = [
    ...columns.value,
    {
      key: `col${columns.value.length + 1}`,
      title: `列${columns.value.length + 1}`,
      width: 120,
      sortable: false,
      filterable: false
    }
  ]
  setProp('columns', cols)
}

const removeColumn = (index) => {
  const cols = columns.value.filter((_, i) => i !== index)
  setProp('columns', cols)
}

const updateColumn = (index, field, value) => {
  const cols = [...columns.value]
  cols[index] = { ...cols[index], [field]: value }
  setProp('columns', cols)
}

const alignOptions = [
  { label: '左对齐', value: 'left' },
  { label: '居中', value: 'center' },
  { label: '右对齐', value: 'right' }
]

const formatterOptions = [
  { label: '无', value: '' },
  { label: '货币 (¥)', value: 'currency' },
  { label: '百分比', value: 'percent' },
  { label: '数字', value: 'number' }
]
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.table-config {
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
  }
}

.column-item {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: $border-radius;
  padding: $spacing-sm;
  margin-bottom: $spacing-sm;

  .column-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: $spacing-xs;

    .column-index {
      font-size: $font-size-xs;
      color: $text-muted;
    }
  }
}
</style>
