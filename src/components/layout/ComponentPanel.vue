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
      <div v-for="category in filteredCategories" :key="category" class="component-group">
        <div class="component-group-title">{{ categoryNames[category] }}</div>
        <div class="component-list">
          <div
            v-for="component in getComponentsByCategory(category)"
            :key="component.type"
            class="component-item"
            draggable="true"
            @dragstart="handleDragStart($event, component)"
            @click="handleClickAdd(component)"
          >
            <div class="component-item-icon" v-html="getChartIcon(component.type)"></div>
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
import {
  componentRegistry,
  CATEGORY_NAMES,
  getAllCategories,
  getComponentsByCategory
} from '@/config/components'
import { useCanvasStore } from '@/stores/canvas'
import { useDataStore } from '@/stores/data'

const emit = defineEmits(['component-added'])
const canvasStore = useCanvasStore()
const dataStore = useDataStore()

const searchText = ref('')
const categoryNames = CATEGORY_NAMES

const filteredCategories = computed(() => {
  const categories = getAllCategories()
  if (!searchText.value) return categories

  return categories.filter((category) => {
    const components = getComponentsByCategory(category)
    return components.some((c) => c.name.toLowerCase().includes(searchText.value.toLowerCase()))
  })
})

const handleDragStart = (event, component) => {
  event.dataTransfer.setData('component', JSON.stringify(component))
  event.dataTransfer.effectAllowed = 'copy'
}

const handleClickAdd = (component) => {
  const meta = componentRegistry.find((c) => c.type === component.type)
  const newComp = canvasStore.addComponent({
    type: component.type,
    x: Math.round(canvasStore.canvasConfig.width / 2 - (meta?.defaultSize?.width || 400) / 2),
    y: Math.round(canvasStore.canvasConfig.height / 2 - (meta?.defaultSize?.height || 300) / 2),
    width: meta?.defaultSize?.width || 400,
    height: meta?.defaultSize?.height || 300,
    props: meta?.defaultProps || {}
  })

  if (newComp?.data?.type === 'api') {
    dataStore.initComponentData(newComp)
  }
  emit('component-added', newComp)
}

// SVG 迷你图表图标
const getChartIcon = (type) => {
  const icons = {
    'bar-chart': `<svg viewBox="0 0 48 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="22" width="6" height="12" rx="1.5" fill="#2080f0"/>
      <rect x="12" y="14" width="6" height="20" rx="1.5" fill="#40a9ff"/>
      <rect x="20" y="8" width="6" height="26" rx="1.5" fill="#2080f0"/>
      <rect x="28" y="18" width="6" height="16" rx="1.5" fill="#40a9ff"/>
      <rect x="36" y="4" width="6" height="30" rx="1.5" fill="#2080f0"/>
      <line x1="2" y1="34" x2="46" y2="34" stroke="#1e3a5f" stroke-width="1"/>
    </svg>`,

    'line-chart': `<svg viewBox="0 0 48 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="lg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#2080f0" stop-opacity="0.3"/><stop offset="100%" stop-color="#2080f0" stop-opacity="0"/></linearGradient></defs>
      <path d="M4 24 L12 16 L20 20 L28 10 L36 14 L44 6 L44 34 L4 34Z" fill="url(#lg)"/>
      <polyline points="4,24 12,16 20,20 28,10 36,14 44,6" stroke="#2080f0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <circle cx="4" cy="24" r="2" fill="#2080f0"/>
      <circle cx="12" cy="16" r="2" fill="#2080f0"/>
      <circle cx="20" cy="20" r="2" fill="#2080f0"/>
      <circle cx="28" cy="10" r="2" fill="#2080f0"/>
      <circle cx="36" cy="14" r="2" fill="#2080f0"/>
      <circle cx="44" cy="6" r="2" fill="#2080f0"/>
      <line x1="2" y1="34" x2="46" y2="34" stroke="#1e3a5f" stroke-width="1"/>
    </svg>`,

    'pie-chart': `<svg viewBox="0 0 48 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="22" cy="18" r="14" stroke="#1e3a5f" stroke-width="1"/>
      <path d="M22 4 A14 14 0 0 1 35.86 24.12 L22 18Z" fill="#2080f0"/>
      <path d="M35.86 24.12 A14 14 0 0 1 12 30.9 L22 18Z" fill="#18a058"/>
      <path d="M12 30.9 A14 14 0 0 1 8.14 11.88 L22 18Z" fill="#f0a020"/>
      <path d="M8.14 11.88 A14 14 0 0 1 22 4 L22 18Z" fill="#d03050"/>
      <circle cx="22" cy="18" r="6" fill="#0d192d"/>
    </svg>`,

    'gauge-chart': `<svg viewBox="0 0 48 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 28 A16 16 0 0 1 40 28" stroke="#1e3a5f" stroke-width="4" stroke-linecap="round" fill="none"/>
      <path d="M8 28 A16 16 0 0 1 20 12" stroke="#18a058" stroke-width="4" stroke-linecap="round" fill="none"/>
      <path d="M20 12 A16 16 0 0 1 32 12" stroke="#f0a020" stroke-width="4" stroke-linecap="round" fill="none"/>
      <path d="M32 12 A16 16 0 0 1 40 28" stroke="#d03050" stroke-width="4" stroke-linecap="round" fill="none"/>
      <line x1="24" y1="28" x2="18" y2="16" stroke="#e0e0e0" stroke-width="2" stroke-linecap="round"/>
      <circle cx="24" cy="28" r="2.5" fill="#e0e0e0"/>
    </svg>`,

    'radar-chart': `<svg viewBox="0 0 48 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="24,4 38,14 34,28 14,28 10,14" stroke="#1e3a5f" stroke-width="1" fill="none"/>
      <polygon points="24,10 33,16 31,24 17,24 15,16" stroke="#1e3a5f" stroke-width="0.5" fill="none"/>
      <polygon points="24,4 38,14 34,28 14,28 10,14" stroke="#2080f0" stroke-width="1.5" fill="#2080f0" fill-opacity="0.2"/>
      <circle cx="24" cy="4" r="2" fill="#2080f0"/>
      <circle cx="38" cy="14" r="2" fill="#2080f0"/>
      <circle cx="34" cy="28" r="2" fill="#2080f0"/>
      <circle cx="14" cy="28" r="2" fill="#2080f0"/>
      <circle cx="10" cy="14" r="2" fill="#2080f0"/>
    </svg>`,

    'scatter-chart': `<svg viewBox="0 0 48 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="24" r="3" fill="#2080f0" opacity="0.8"/>
      <circle cx="16" cy="18" r="2.5" fill="#2080f0"/>
      <circle cx="22" cy="22" r="2" fill="#40a9ff"/>
      <circle cx="28" cy="12" r="3.5" fill="#2080f0" opacity="0.9"/>
      <circle cx="34" cy="8" r="2" fill="#40a9ff"/>
      <circle cx="40" cy="16" r="2.5" fill="#2080f0"/>
      <circle cx="14" cy="14" r="1.5" fill="#40a9ff"/>
      <circle cx="38" cy="26" r="2" fill="#2080f0" opacity="0.7"/>
      <line x1="4" y1="32" x2="46" y2="32" stroke="#1e3a5f" stroke-width="1"/>
      <line x1="4" y1="4" x2="4" y2="32" stroke="#1e3a5f" stroke-width="1"/>
    </svg>`,

    'funnel-chart': `<svg viewBox="0 0 48 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 4 L40 4 L35 12 L13 12Z" fill="#2080f0" opacity="0.9"/>
      <path d="M13 14 L35 14 L31 20 L17 20Z" fill="#40a9ff" opacity="0.8"/>
      <path d="M17 22 L31 22 L28 28 L20 28Z" fill="#2080f0" opacity="0.7"/>
      <path d="M20 30 L28 30 L26 34 L22 34Z" fill="#40a9ff" opacity="0.6"/>
    </svg>`,

    'heatmap-chart': `<svg viewBox="0 0 48 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="4" width="8" height="6" rx="1" fill="#2080f0" opacity="0.9"/>
      <rect x="16" y="4" width="8" height="6" rx="1" fill="#18a058" opacity="0.7"/>
      <rect x="26" y="4" width="8" height="6" rx="1" fill="#f0a020" opacity="0.5"/>
      <rect x="36" y="4" width="6" height="6" rx="1" fill="#d03050" opacity="0.8"/>
      <rect x="6" y="12" width="8" height="6" rx="1" fill="#18a058" opacity="0.8"/>
      <rect x="16" y="12" width="8" height="6" rx="1" fill="#f0a020" opacity="0.9"/>
      <rect x="26" y="12" width="8" height="6" rx="1" fill="#2080f0" opacity="0.6"/>
      <rect x="36" y="12" width="6" height="6" rx="1" fill="#18a058" opacity="0.7"/>
      <rect x="6" y="20" width="8" height="6" rx="1" fill="#f0a020" opacity="0.6"/>
      <rect x="16" y="20" width="8" height="6" rx="1" fill="#d03050" opacity="0.9"/>
      <rect x="26" y="20" width="8" height="6" rx="1" fill="#18a058" opacity="0.8"/>
      <rect x="36" y="20" width="6" height="6" rx="1" fill="#2080f0" opacity="0.5"/>
      <rect x="6" y="28" width="8" height="4" rx="1" fill="#d03050" opacity="0.7"/>
      <rect x="16" y="28" width="8" height="4" rx="1" fill="#2080f0" opacity="0.6"/>
      <rect x="26" y="28" width="8" height="4" rx="1" fill="#f0a020" opacity="0.8"/>
      <rect x="36" y="28" width="6" height="4" rx="1" fill="#18a058" opacity="0.9"/>
    </svg>`,

    'treemap-chart': `<svg viewBox="0 0 48 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="22" height="14" rx="2" fill="#2080f0" opacity="0.8"/>
      <rect x="28" y="4" width="16" height="14" rx="2" fill="#18a058" opacity="0.7"/>
      <rect x="4" y="20" width="14" height="12" rx="2" fill="#f0a020" opacity="0.6"/>
      <rect x="20" y="20" width="12" height="12" rx="2" fill="#d03050" opacity="0.7"/>
      <rect x="34" y="20" width="10" height="12" rx="2" fill="#40a9ff" opacity="0.8"/>
      <text x="15" y="13" text-anchor="middle" fill="#fff" font-size="6">A</text>
      <text x="36" y="13" text-anchor="middle" fill="#fff" font-size="6">B</text>
      <text x="11" y="28" text-anchor="middle" fill="#fff" font-size="6">C</text>
      <text x="26" y="28" text-anchor="middle" fill="#fff" font-size="6">D</text>
      <text x="39" y="28" text-anchor="middle" fill="#fff" font-size="6">E</text>
    </svg>`,

    'kpi-card': `<svg viewBox="0 0 48 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="40" height="28" rx="3" fill="#0d192d" stroke="#1e3a5f" stroke-width="1"/>
      <text x="24" y="20" text-anchor="middle" fill="#2080f0" font-size="12" font-weight="bold">128</text>
      <text x="24" y="10" text-anchor="middle" fill="#a0aec0" font-size="5">Total</text>
      <path d="M36 26 L40 22 L44 26" stroke="#18a058" stroke-width="1.5" fill="none" stroke-linecap="round"/>
      <text x="36" y="32" fill="#18a058" font-size="4">+12%</text>
    </svg>`,

    progress: `<svg viewBox="0 0 48 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="14" width="40" height="8" rx="4" fill="#1e3a5f"/>
      <rect x="4" y="14" width="28" height="8" rx="4" fill="#2080f0"/>
      <text x="24" y="10" text-anchor="middle" fill="#a0aec0" font-size="5">Progress</text>
      <text x="34" y="32" text-anchor="middle" fill="#2080f0" font-size="5">70%</text>
    </svg>`,

    video: `<svg viewBox="0 0 48 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="4" width="36" height="28" rx="3" stroke="#1e3a5f" stroke-width="1" fill="#0d192d"/>
      <polygon points="20,12 20,24 32,18" fill="#2080f0"/>
      <rect x="6" y="26" width="36" height="6" rx="0 0 3 3" fill="#1e3a5f" opacity="0.5"/>
      <circle cx="12" cy="29" r="2" fill="#a0aec0"/>
      <rect x="18" y="28" width="16" height="2" rx="1" fill="#2080f0" opacity="0.5"/>
    </svg>`,

    'data-table': `<svg viewBox="0 0 48 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="40" height="28" rx="3" stroke="#1e3a5f" stroke-width="1" fill="#0d192d"/>
      <rect x="4" y="4" width="40" height="7" rx="3" fill="#1e3a5f"/>
      <line x1="4" y1="15" x2="44" y2="15" stroke="#1e3a5f" stroke-width="0.5"/>
      <line x1="4" y1="21" x2="44" y2="21" stroke="#1e3a5f" stroke-width="0.5"/>
      <line x1="4" y1="27" x2="44" y2="27" stroke="#1e3a5f" stroke-width="0.5"/>
      <line x1="18" y1="4" x2="18" y2="32" stroke="#1e3a5f" stroke-width="0.5"/>
      <line x1="30" y1="4" x2="30" y2="32" stroke="#1e3a5f" stroke-width="0.5"/>
      <rect x="7" y="6" width="8" height="3" rx="1" fill="#4fc3f7"/>
      <rect x="21" y="6" width="6" height="3" rx="1" fill="#4fc3f7"/>
      <rect x="33" y="6" width="6" height="3" rx="1" fill="#4fc3f7"/>
      <rect x="7" y="16.5" width="6" height="2.5" rx="1" fill="#a0aec0"/>
      <rect x="21" y="16.5" width="8" height="2.5" rx="1" fill="#a0aec0"/>
      <rect x="33" y="16.5" width="6" height="2.5" rx="1" fill="#a0aec0"/>
      <rect x="7" y="22.5" width="6" height="2.5" rx="1" fill="#a0aec0"/>
      <rect x="21" y="22.5" width="8" height="2.5" rx="1" fill="#a0aec0"/>
      <rect x="33" y="22.5" width="6" height="2.5" rx="1" fill="#a0aec0"/>
    </svg>`,

    'rank-list': `<svg viewBox="0 0 48 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="3" width="10" height="6" rx="1.5" fill="#f0a020"/>
      <text x="9" y="8" text-anchor="middle" fill="#fff" font-size="5" font-weight="bold">1</text>
      <rect x="16" y="3" width="28" height="6" rx="1.5" fill="#1e3a5f"/>
      <rect x="16" y="3" width="24" height="6" rx="1.5" fill="#f0a020" opacity="0.4"/>
      <rect x="4" y="12" width="10" height="6" rx="1.5" fill="#a0aec0"/>
      <text x="9" y="17" text-anchor="middle" fill="#fff" font-size="5" font-weight="bold">2</text>
      <rect x="16" y="12" width="28" height="6" rx="1.5" fill="#1e3a5f"/>
      <rect x="16" y="12" width="20" height="6" rx="1.5" fill="#a0aec0" opacity="0.4"/>
      <rect x="4" y="21" width="10" height="6" rx="1.5" fill="#8c6e4a"/>
      <text x="9" y="26" text-anchor="middle" fill="#fff" font-size="5" font-weight="bold">3</text>
      <rect x="16" y="21" width="28" height="6" rx="1.5" fill="#1e3a5f"/>
      <rect x="16" y="21" width="14" height="6" rx="1.5" fill="#8c6e4a" opacity="0.4"/>
      <rect x="4" y="30" width="10" height="6" rx="1.5" fill="#1e3a5f"/>
      <rect x="16" y="30" width="28" height="6" rx="1.5" fill="#1e3a5f"/>
      <rect x="16" y="30" width="10" height="6" rx="1.5" fill="#1e3a5f" opacity="0.6"/>
    </svg>`,

    'form-filter': `<svg viewBox="0 0 48 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="8" width="14" height="20" rx="3" stroke="#2080f0" stroke-width="1" fill="#0d192d"/>
      <rect x="7" y="12" width="8" height="2.5" rx="1" fill="#4fc3f7"/>
      <rect x="7" y="18" width="8" height="8" rx="1.5" stroke="#1e3a5f" fill="#1a2a3a"/>
      <path d="M10 22 L12 25 L14 22" stroke="#a0aec0" stroke-width="1" fill="none"/>
      <rect x="20" y="8" width="14" height="20" rx="3" stroke="#2080f0" stroke-width="1" fill="#0d192d"/>
      <rect x="23" y="12" width="8" height="2.5" rx="1" fill="#4fc3f7"/>
      <rect x="23" y="18" width="8" height="8" rx="1.5" stroke="#1e3a5f" fill="#1a2a3a"/>
      <path d="M26 22 L28 25 L30 22" stroke="#a0aec0" stroke-width="1" fill="none"/>
      <rect x="36" y="12" width="9" height="12" rx="3" fill="#2080f0"/>
      <text x="40.5" y="20" text-anchor="middle" fill="#fff" font-size="5">GO</text>
    </svg>`,

    'form-input': `<svg viewBox="0 0 48 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <text x="4" y="12" fill="#a0aec0" font-size="6">Label</text>
      <rect x="4" y="16" width="40" height="14" rx="3" stroke="#1e3a5f" stroke-width="1" fill="#0d192d"/>
      <line x1="8" y1="23" x2="20" y2="23" stroke="#2080f0" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="20" y1="19" x2="20" y2="27" stroke="#2080f0" stroke-width="1" opacity="0.5"/>
    </svg>`,

    'form-select': `<svg viewBox="0 0 48 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <text x="4" y="12" fill="#a0aec0" font-size="6">Label</text>
      <rect x="4" y="16" width="40" height="14" rx="3" stroke="#1e3a5f" stroke-width="1" fill="#0d192d"/>
      <text x="8" y="25" fill="#e0e0e0" font-size="5.5">Select...</text>
      <path d="M38 21 L41 25 L44 21" stroke="#a0aec0" stroke-width="1.2" fill="none" stroke-linecap="round"/>
    </svg>`,

    'form-date': `<svg viewBox="0 0 48 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <text x="4" y="12" fill="#a0aec0" font-size="6">Label</text>
      <rect x="4" y="16" width="40" height="14" rx="3" stroke="#1e3a5f" stroke-width="1" fill="#0d192d"/>
      <rect x="8" y="19" width="5" height="4" rx="1" stroke="#2080f0" stroke-width="0.8" fill="none"/>
      <rect x="15" y="19" width="5" height="4" rx="1" stroke="#2080f0" stroke-width="0.8" fill="none"/>
      <rect x="22" y="19" width="5" height="4" rx="1" stroke="#2080f0" stroke-width="0.8" fill="none"/>
      <rect x="29" y="19" width="5" height="4" rx="1" stroke="#2080f0" stroke-width="0.8" fill="none"/>
      <rect x="36" y="19" width="5" height="4" rx="1" stroke="#2080f0" stroke-width="0.8" fill="none"/>
      <text x="10.5" y="22.5" text-anchor="middle" fill="#4fc3f7" font-size="3.5">15</text>
      <text x="17.5" y="22.5" text-anchor="middle" fill="#a0aec0" font-size="3.5">16</text>
      <text x="24.5" y="22.5" text-anchor="middle" fill="#a0aec0" font-size="3.5">17</text>
      <line x1="8" y1="18" x2="10" y2="16" stroke="#2080f0" stroke-width="1"/>
      <line x1="40" y1="18" x2="38" y2="16" stroke="#2080f0" stroke-width="1"/>
    </svg>`,

    title: `<svg viewBox="0 0 48 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <text x="24" y="22" text-anchor="middle" fill="#ffffff" font-size="14" font-weight="bold">Aa</text>
      <line x1="8" y1="28" x2="40" y2="28" stroke="#1e3a5f" stroke-width="1"/>
    </svg>`,

    subtitle: `<svg viewBox="0 0 48 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <text x="24" y="20" text-anchor="middle" fill="#a0aec0" font-size="10">Aa</text>
      <line x1="12" y1="26" x2="36" y2="26" stroke="#1e3a5f" stroke-width="0.5"/>
    </svg>`,

    number: `<svg viewBox="0 0 48 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <text x="24" y="24" text-anchor="middle" fill="#2080f0" font-size="16" font-weight="bold" font-family="monospace">128</text>
      <rect x="8" y="28" width="32" height="2" rx="1" fill="#1e3a5f"/>
      <rect x="8" y="28" width="24" height="2" rx="1" fill="#2080f0" opacity="0.5"/>
    </svg>`,

    image: `<svg viewBox="0 0 48 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="4" width="36" height="28" rx="3" stroke="#1e3a5f" stroke-width="1" fill="#0d192d"/>
      <circle cx="16" cy="14" r="4" fill="#f0a020" opacity="0.6"/>
      <path d="M6 28 L18 18 L28 24 L34 20 L42 28 L42 32 L6 32Z" fill="#18a058" opacity="0.4"/>
    </svg>`,

    border: `<svg viewBox="0 0 48 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="4" width="36" height="28" rx="2" stroke="#2080f0" stroke-width="1.5" fill="none" stroke-dasharray="4 2"/>
    </svg>`,

    divider: `<svg viewBox="0 0 48 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="4" y1="18" x2="44" y2="18" stroke="#2080f0" stroke-width="2" stroke-linecap="round"/>
      <circle cx="16" cy="18" r="1.5" fill="#40a9ff"/>
      <circle cx="24" cy="18" r="1.5" fill="#2080f0"/>
      <circle cx="32" cy="18" r="1.5" fill="#40a9ff"/>
    </svg>`,

    card: `<svg viewBox="0 0 48 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="2" width="40" height="32" rx="3" stroke="#1e3a5f" stroke-width="1" fill="#0d192d"/>
      <rect x="4" y="2" width="40" height="8" rx="3" fill="#1e3a5f"/>
      <rect x="8" y="4.5" width="16" height="3" rx="1" fill="#4fc3f7"/>
      <rect x="8" y="14" width="32" height="3" rx="1" fill="#1e3a5f" opacity="0.5"/>
      <rect x="8" y="20" width="24" height="3" rx="1" fill="#1e3a5f" opacity="0.5"/>
      <rect x="8" y="26" width="28" height="3" rx="1" fill="#1e3a5f" opacity="0.5"/>
    </svg>`,

    'tab-container': `<svg viewBox="0 0 48 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="2" width="40" height="32" rx="3" stroke="#1e3a5f" stroke-width="1" fill="#0d192d"/>
      <rect x="4" y="2" width="13" height="8" rx="3" fill="#2080f0"/>
      <rect x="17" y="2" width="13" height="8" rx="0 3 0 0" fill="#1e3a5f"/>
      <rect x="30" y="2" width="14" height="8" rx="3 3 0 0" fill="#1e3a5f"/>
      <text x="10.5" y="8" text-anchor="middle" fill="#fff" font-size="4">Tab1</text>
      <text x="23.5" y="8" text-anchor="middle" fill="#a0aec0" font-size="4">Tab2</text>
      <text x="37" y="8" text-anchor="middle" fill="#a0aec0" font-size="4">Tab3</text>
      <rect x="6" y="14" width="36" height="18" rx="1" fill="#0d192d"/>
      <rect x="8" y="16" width="32" height="2" rx="1" fill="#1e3a5f" opacity="0.5"/>
      <rect x="8" y="21" width="28" height="2" rx="1" fill="#1e3a5f" opacity="0.5"/>
      <rect x="8" y="26" width="24" height="2" rx="1" fill="#1e3a5f" opacity="0.5"/>
    </svg>`,

    marquee: `<svg viewBox="0 0 48 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="8" width="40" height="20" rx="3" stroke="#1e3a5f" stroke-width="1" fill="#0d192d"/>
      <rect x="8" y="14" width="32" height="3" rx="1.5" fill="#2080f0"/>
      <rect x="8" y="19" width="20" height="2" rx="1" fill="#1e3a5f" opacity="0.5"/>
      <path d="M38 16 L42 18 L38 20" stroke="#40a9ff" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M10 16 L6 18 L10 20" stroke="#40a9ff" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,

    'datav-border': `<svg viewBox="0 0 48 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="4" width="36" height="28" rx="2" stroke="#2080f0" stroke-width="1.5" fill="none"/>
      <rect x="8" y="6" width="32" height="24" rx="1" stroke="#2080f0" stroke-width="0.5" fill="none" opacity="0.5"/>
      <circle cx="6" cy="4" r="2" fill="#2080f0"/>
      <circle cx="42" cy="4" r="2" fill="#2080f0"/>
      <circle cx="6" cy="32" r="2" fill="#2080f0"/>
      <circle cx="42" cy="32" r="2" fill="#2080f0"/>
    </svg>`,

    'datav-decoration': `<svg viewBox="0 0 48 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="4" y1="18" x2="18" y2="18" stroke="#2080f0" stroke-width="2"/>
      <line x1="30" y1="18" x2="44" y2="18" stroke="#2080f0" stroke-width="2"/>
      <circle cx="24" cy="18" r="4" stroke="#2080f0" stroke-width="1.5" fill="none"/>
      <circle cx="24" cy="18" r="1.5" fill="#2080f0"/>
      <circle cx="14" cy="18" r="1" fill="#40a9ff"/>
      <circle cx="34" cy="18" r="1" fill="#40a9ff"/>
    </svg>`,

    'datav-scroll-board': `<svg viewBox="0 0 48 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="40" height="28" rx="3" stroke="#1e3a5f" stroke-width="1" fill="#0d192d"/>
      <rect x="4" y="4" width="40" height="7" rx="3" fill="#1e3a5f"/>
      <rect x="7" y="6" width="10" height="3" rx="1" fill="#4fc3f7"/>
      <rect x="21" y="6" width="8" height="3" rx="1" fill="#4fc3f7"/>
      <line x1="4" y1="15" x2="44" y2="15" stroke="#1e3a5f" stroke-width="0.5"/>
      <line x1="4" y1="21" x2="44" y2="21" stroke="#1e3a5f" stroke-width="0.5"/>
      <path d="M20 16 L24 19 L20 22" stroke="#2080f0" stroke-width="1.5" fill="none"/>
      <path d="M28 16 L24 19 L28 22" stroke="#2080f0" stroke-width="1.5" fill="none"/>
    </svg>`,

    'datav-digital-flop': `<svg viewBox="0 0 48 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <text x="24" y="24" text-anchor="middle" fill="#2080f0" font-size="16" font-weight="bold" font-family="monospace">128</text>
      <rect x="8" y="28" width="32" height="2" rx="1" fill="#1e3a5f"/>
      <rect x="8" y="28" width="24" height="2" rx="1" fill="#2080f0" opacity="0.5"/>
    </svg>`,

    'datav-water-ball': `<svg viewBox="0 0 48 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="18" r="14" stroke="#2080f0" stroke-width="1" fill="none"/>
      <path d="M10 20 Q17 16 24 20 Q31 24 38 20 L38 32 Q31 36 24 32 Q17 28 10 32Z" fill="#2080f0" opacity="0.5"/>
      <path d="M10 22 Q17 18 24 22 Q31 26 38 22 L38 32 Q31 36 24 32 Q17 28 10 32Z" fill="#2080f0" opacity="0.3"/>
      <text x="24" y="20" text-anchor="middle" fill="#fff" font-size="7" font-weight="bold">50%</text>
    </svg>`,

    'datav-loading': `<svg viewBox="0 0 48 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="18" r="10" stroke="#1e3a5f" stroke-width="2" fill="none"/>
      <path d="M24 8 A10 10 0 0 1 34 18" stroke="#2080f0" stroke-width="2" stroke-linecap="round" fill="none"/>
      <circle cx="24" cy="18" r="3" fill="#2080f0" opacity="0.5"/>
    </svg>`
  }
  return (
    icons[type] ||
    `<svg viewBox="0 0 48 36" fill="none"><rect x="8" y="4" width="32" height="28" rx="3" stroke="#1e3a5f" stroke-width="1" fill="#0d192d"/><text x="24" y="22" text-anchor="middle" fill="#5a6a7a" font-size="8">?</text></svg>`
  )
}
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.component-panel-header {
  padding: $spacing-md;
  border-bottom: 1px solid $border-color;
  flex-shrink: 0;
}

.component-panel-title {
  font-size: $font-size-md;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: $spacing-sm;
  letter-spacing: 0.5px;
}

.component-search {
  width: 100%;
}

.component-panel-body {
  flex: 1;
  overflow-y: auto;
  padding: $spacing-sm;
  @include scrollbar;
}

.component-group {
  margin-bottom: $spacing-md;
}

.component-group-title {
  font-size: $font-size-xs;
  color: $text-muted;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: $spacing-xs $spacing-sm;
  margin-bottom: $spacing-xs;
  font-weight: 500;
}

.component-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6px;
}

.component-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 6px 8px;
  background: $bg-dark;
  border: 1px solid $border-color;
  border-radius: $border-radius-lg;
  cursor: grab;
  transition: all $transition-fast;
  user-select: none;

  &:hover {
    background: $bg-hover;
    border-color: $color-primary;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(32, 128, 240, 0.15);
  }

  &:active {
    cursor: grabbing;
    transform: scale(0.96);
    box-shadow: none;
  }
}

.component-item-icon {
  width: 48px;
  height: 36px;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  justify-content: center;

  :deep(svg) {
    width: 100%;
    height: 100%;
  }
}

.component-item-name {
  font-size: 11px;
  color: $text-secondary;
  text-align: center;
  line-height: 1.2;
  @include text-ellipsis;
  max-width: 100%;
}
</style>
