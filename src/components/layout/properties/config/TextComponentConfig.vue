<template>
  <div class="text-config">
    <!-- 标题/副标题配置 -->
    <template v-if="component.type === 'title' || component.type === 'subtitle'">
      <div class="config-section">
        <div class="section-title">文字设置</div>
        <div class="config-row">
          <label>内容</label>
          <n-input
            :value="getProp('text', '')"
            size="small"
            @update:value="(v) => setProp('text', v)"
          />
        </div>
        <div class="config-row">
          <label>对齐</label>
          <n-select
            :value="getProp('align', 'left')"
            :options="alignOptions"
            size="small"
            style="flex: 1"
            @update:value="(v) => setProp('align', v)"
          />
        </div>
        <div v-if="component.type === 'title'" class="config-row">
          <label>级别</label>
          <n-select
            :value="getProp('level', 1)"
            :options="levelOptions"
            size="small"
            style="flex: 1"
            @update:value="(v) => setProp('level', v)"
          />
        </div>
        <div class="config-row">
          <label>颜色</label>
          <n-color-picker
            :value="getProp('color', defaultColor)"
            :show-alpha="false"
            size="small"
            @update:value="(v) => setProp('color', v)"
          />
        </div>
        <div class="config-row">
          <label>字号</label>
          <n-input-number
            :value="getProp('fontSize', component.type === 'title' ? 24 : 14)"
            :min="10"
            :max="72"
            size="small"
            @update:value="(v) => setProp('fontSize', v)"
          />
        </div>
        <div class="config-row">
          <label>字重</label>
          <n-select
            :value="getProp('fontWeight', component.type === 'title' ? '600' : '400')"
            :options="fontWeightOptions"
            size="small"
            style="flex: 1"
            @update:value="(v) => setProp('fontWeight', v)"
          />
        </div>
      </div>
    </template>

    <!-- 数字翻牌器配置 -->
    <template v-else-if="component.type === 'number'">
      <div class="config-section">
        <div class="section-title">数字设置</div>
        <div class="config-row">
          <label>数值</label>
          <n-input-number
            :value="getProp('value', 0)"
            size="small"
            @update:value="(v) => setProp('value', v)"
          />
        </div>
        <div class="config-row">
          <label>前缀</label>
          <n-input
            :value="getProp('prefix', '')"
            size="small"
            placeholder="如 ¥"
            @update:value="(v) => setProp('prefix', v)"
          />
        </div>
        <div class="config-row">
          <label>后缀</label>
          <n-input
            :value="getProp('suffix', '')"
            size="small"
            placeholder="如 %"
            @update:value="(v) => setProp('suffix', v)"
          />
        </div>
        <div class="config-row">
          <label>动画时长</label>
          <n-input-number
            :value="getProp('duration', 2000)"
            :min="500"
            :max="5000"
            :step="100"
            size="small"
            @update:value="(v) => setProp('duration', v)"
          />
        </div>
        <div class="config-row">
          <label>千分位</label>
          <n-switch
            :value="getProp('separator', ',') === ','"
            size="small"
            @update:value="(v) => setProp('separator', v ? ',' : '')"
          />
        </div>
        <div class="config-row">
          <label>颜色</label>
          <n-color-picker
            :value="getProp('color', '#2080f0')"
            :show-alpha="false"
            size="small"
            @update:value="(v) => setProp('color', v)"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { NInputNumber, NInput, NSelect, NSwitch, NColorPicker } from 'naive-ui'
import { useCanvasStore } from '@/stores/canvas'
import { TEXT_PRIMARY, TEXT_SECONDARY } from '@/config/colors'

const props = defineProps({
  component: { type: Object, required: true }
})

const canvasStore = useCanvasStore()

const getProp = (key, defaultVal) => props.component.props?.[key] ?? defaultVal
const setProp = (key, value) =>
  canvasStore.updateComponentProps(props.component.id, { [key]: value })

const defaultColor = computed(() =>
  props.component.type === 'title' ? TEXT_PRIMARY : TEXT_SECONDARY
)

const alignOptions = [
  { label: '左对齐', value: 'left' },
  { label: '居中', value: 'center' },
  { label: '右对齐', value: 'right' }
]

const levelOptions = [
  { label: '一级 (24px)', value: 1 },
  { label: '二级 (20px)', value: 2 },
  { label: '三级 (16px)', value: 3 }
]

const fontWeightOptions = [
  { label: '细体 (300)', value: '300' },
  { label: '常规 (400)', value: '400' },
  { label: '中等 (500)', value: '500' },
  { label: '半粗 (600)', value: '600' },
  { label: '粗体 (700)', value: '700' }
]
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.text-config {
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
</style>
