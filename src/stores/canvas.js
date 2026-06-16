import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'

const STORAGE_KEY = 'ltd-view-dashboard-draft'

function loadDraft() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    /* ignore */
  }
  return null
}

function saveDraft(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    /* ignore */
  }
}

function clearDraft() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* ignore */
  }
}

export const useCanvasStore = defineStore('canvas', {
  state: () => {
    const draft = loadDraft()
    return {
      // 画布配置
      canvasConfig: draft?.canvasConfig || {
        id: uuidv4(),
        name: '未命名仪表盘',
        width: 1920,
        height: 1080,
        background: '#0a1929',
        theme: 'dark'
      },

      // 组件列表
      components: draft?.components || [],

      // 当前选中的组件 ID
      selectedId: null,

      // 多选的组件 ID 列表
      selectedIds: [],

      // 历史记录（用于撤销/重做）
      history: [],
      historyIndex: -1,

      // 最大历史记录数
      maxHistory: 50
    }
  },

  getters: {
    // 获取选中的组件
    selectedComponent: (state) => {
      if (!state.selectedId) return null
      return state.components.find((c) => c.id === state.selectedId)
    },

    // 获取组件数量
    componentCount: (state) => state.components.length,

    // 是否可以撤销
    canUndo: (state) => state.historyIndex >= 0,

    // 是否可以重做
    canRedo: (state) => state.historyIndex < state.history.length - 1
  },

  actions: {
    // 添加组件
    addComponent(component) {
      const newComponent = {
        id: uuidv4(),
        x: component.x || 0,
        y: component.y || 0,
        width: component.width || 200,
        height: component.height || 200,
        zIndex: this.components.length + 1,
        ...component,
        props: {
          ...component.defaultProps,
          ...component.props
        }
      }
      this.components.push(newComponent)
      this.selectedId = newComponent.id
      this.saveHistory()
      return newComponent
    },

    // 更新组件
    updateComponent(id, updates) {
      const index = this.components.findIndex((c) => c.id === id)
      if (index !== -1) {
        this.components[index] = {
          ...this.components[index],
          ...updates
        }
        this.saveHistory()
      }
    },

    // 更新组件属性
    updateComponentProps(id, props) {
      const index = this.components.findIndex((c) => c.id === id)
      if (index !== -1) {
        this.components[index].props = {
          ...this.components[index].props,
          ...props
        }
        this.saveHistory()
      }
    },

    // 删除组件
    removeComponent(id) {
      const index = this.components.findIndex((c) => c.id === id)
      if (index !== -1) {
        this.components.splice(index, 1)
        if (this.selectedId === id) {
          this.selectedId = null
        }
        this.selectedIds = this.selectedIds.filter((sid) => sid !== id)
        this.saveHistory()
      }
    },

    // 删除选中的组件
    removeSelected() {
      if (this.selectedId) {
        this.removeComponent(this.selectedId)
      }
      if (this.selectedIds.length > 0) {
        this.selectedIds.forEach((id) => this.removeComponent(id))
      }
    },

    // 选中组件
    selectComponent(id) {
      this.selectedId = id
      this.selectedIds = id ? [id] : []
    },

    // 多选组件
    toggleSelect(id) {
      const index = this.selectedIds.indexOf(id)
      if (index === -1) {
        this.selectedIds.push(id)
      } else {
        this.selectedIds.splice(index, 1)
      }
      this.selectedId = this.selectedIds.length === 1 ? this.selectedIds[0] : null
    },

    // 清除选择
    clearSelection() {
      this.selectedId = null
      this.selectedIds = []
    },

    // 移动组件
    moveComponent(id, x, y) {
      const component = this.components.find((c) => c.id === id)
      if (component) {
        component.x = Math.max(0, Math.min(x, this.canvasConfig.width - component.width))
        component.y = Math.max(0, Math.min(y, this.canvasConfig.height - component.height))
      }
    },

    // 调整组件大小
    resizeComponent(id, width, height) {
      const component = this.components.find((c) => c.id === id)
      if (component) {
        component.width = Math.max(50, width)
        component.height = Math.max(50, height)
      }
    },

    // 调整层级
    bringToFront(id) {
      const maxZ = Math.max(...this.components.map((c) => c.zIndex))
      this.updateComponent(id, { zIndex: maxZ + 1 })
    },

    sendToBack(id) {
      const minZ = Math.min(...this.components.map((c) => c.zIndex))
      this.updateComponent(id, { zIndex: minZ - 1 })
    },

    bringForward(id) {
      const component = this.components.find((c) => c.id === id)
      if (component) {
        const higher = this.components
          .filter((c) => c.zIndex > component.zIndex)
          .sort((a, b) => a.zIndex - b.zIndex)[0]
        if (higher) {
          const tempZ = component.zIndex
          component.zIndex = higher.zIndex
          higher.zIndex = tempZ
        }
      }
    },

    sendBackward(id) {
      const component = this.components.find((c) => c.id === id)
      if (component) {
        const lower = this.components
          .filter((c) => c.zIndex < component.zIndex)
          .sort((a, b) => b.zIndex - a.zIndex)[0]
        if (lower) {
          const tempZ = component.zIndex
          component.zIndex = lower.zIndex
          lower.zIndex = tempZ
        }
      }
    },

    // 保存历史记录
    saveHistory() {
      // 移除当前位置之后的历史记录
      this.history = this.history.slice(0, this.historyIndex + 1)

      // 快照时排除 data.source 大字段，节省内存
      const snapshot = this.components.map((c) => {
        if (c.data?.source) {
          return { ...c, data: { ...c.data, source: undefined } }
        }
        return c
      })
      this.history.push(JSON.stringify(snapshot))

      // 限制历史记录数量
      if (this.history.length > this.maxHistory) {
        this.history.shift()
      } else {
        this.historyIndex++
      }

      // 自动保存到 localStorage
      this._persistDraft()
    },

    // 持久化草稿到 localStorage
    _persistDraft() {
      saveDraft({
        canvasConfig: { ...this.canvasConfig },
        components: this.components
      })
    },

    // 清除草稿
    clearDraft() {
      clearDraft()
    },

    // 撤销
    undo() {
      if (this.canUndo) {
        this.historyIndex--
        if (this.historyIndex >= 0) {
          this.components = JSON.parse(this.history[this.historyIndex])
        } else {
          this.components = []
        }
        this.clearSelection()
      }
    },

    // 重做
    redo() {
      if (this.canRedo) {
        this.historyIndex++
        this.components = JSON.parse(this.history[this.historyIndex])
        this.clearSelection()
      }
    },

    // 清空画布
    clearCanvas() {
      this.components = []
      this.clearSelection()
      this.saveHistory()
      this.clearDraft()
    },

    // 更新画布尺寸
    updateCanvasSize(width, height) {
      this.canvasConfig.width = width
      this.canvasConfig.height = height
    },

    // 导出配置
    exportConfig() {
      return {
        ...this.canvasConfig,
        components: this.components
      }
    },

    // 导入配置
    importConfig(config) {
      this.canvasConfig = {
        ...this.canvasConfig,
        ...config,
        components: undefined
      }
      this.components = config.components || []
      this.clearSelection()
      this.saveHistory()
    }
  }
})
