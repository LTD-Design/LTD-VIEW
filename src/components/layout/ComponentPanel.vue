<template>
  <div class="component-panel">
    <div class="component-panel-header">
      <div class="component-panel-title">组件库</div>
      <n-input
        v-model:value="searchText"
        placeholder="搜索组件"
        size="small"
        clearable
        class="component-search"
      >
        <template #prefix>
          <n-icon><SearchOutlined /></n-icon>
        </template>
      </n-input>
    </div>

    <div class="component-panel-body">
      <div
        v-for="category in filteredCategories"
        :key="category"
        class="component-group"
      >
        <div class="component-group-title">{{ categoryNames[category] }}</div>
        <div class="component-list">
          <div
            v-for="component in getComponentsByCategory(category)"
            :key="component.type"
            class="component-item"
            draggable="true"
            @dragstart="handleDragStart($event, component)"
          >
            <div class="component-item-icon">{{ getComponentIcon(component.icon) }}</div>
            <div class="component-item-name">{{ component.name }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { SearchOutlined } from '@vicons/antd'
import { componentRegistry, CATEGORY_NAMES, getAllCategories, getComponentsByCategory } from '@/config/components'

const searchText = ref('')
const categoryNames = CATEGORY_NAMES

// 过滤后的分类
const filteredCategories = computed(() => {
  const categories = getAllCategories()
  if (!searchText.value) return categories

  return categories.filter(category => {
    const components = getComponentsByCategory(category)
    return components.some(c =>
      c.name.toLowerCase().includes(searchText.value.toLowerCase())
    )
  })
})

// 获取组件图标
const getComponentIcon = (icon) => {
  const icons = {
    'chart-bar': '📊',
    'chart-line': '📈',
    'chart-pie': '🥧',
    'chart-gauge': '⏱️',
    'chart-radar': '🎯',
    'table': '📋',
    'rank': '🏆',
    'filter': '🔍',
    'edit': '✏️',
    'dropdown': '📝',
    'calendar': '📅',
    'title': '📝',
    'subtitle': '📄',
    'number': '🔢',
    'image': '🖼️',
    'border': '⬜',
    'divider': '➖',
    'card': '🃏'
  }
  return icons[icon] || '📦'
}

// 拖拽开始
const handleDragStart = (event, component) => {
  event.dataTransfer.setData('component', JSON.stringify(component))
  event.dataTransfer.effectAllowed = 'copy'
}
</script>
