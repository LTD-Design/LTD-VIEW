import { defineStore } from 'pinia'
import { fetchComponentData, mapData, filterDataByParams, generateDrillData } from '@/utils/dataAdapter'
import { drillManager } from '@/utils/drillDown'

export const useDataStore = defineStore('data', {
  state: () => ({
    // 组件数据缓存 { componentId: { raw: [], mapped: [], loading: false, error: null } }
    componentData: {},

    // 下钻面包屑状态 { componentId: [{ level, name, field }] }
    drillBreadcrumbs: {},

    // 当前组件的下钻层级 { componentId: number }
    drillLevels: {}
  }),

  getters: {
    // 获取组件的映射后数据
    getComponentData: (state) => (componentId) => {
      return state.componentData[componentId]?.mapped || []
    },

    // 获取组件的加载状态
    isLoading: (state) => (componentId) => {
      return state.componentData[componentId]?.loading || false
    },

    // 获取下钻面包屑
    getBreadcrumb: (state) => (componentId) => {
      return state.drillBreadcrumbs[componentId] || []
    },

    // 获取下钻层级
    getDrillLevel: (state) => (componentId) => {
      return state.drillLevels[componentId] || 0
    }
  },

  actions: {
    /**
     * 初始化组件数据 - 根据数据源配置获取数据
     */
    async initComponentData(component) {
      const id = component.id

      // 设置加载状态
      if (!this.componentData[id]) {
        this.componentData[id] = { raw: [], mapped: [], loading: false, error: null }
      }
      this.componentData[id].loading = true
      this.componentData[id].error = null

      try {
        // 获取原始数据
        const rawData = await fetchComponentData(component)

        // 应用字段映射
        const mapping = component.data?.mapping || {}
        const mappedData = mapData(rawData, mapping)

        this.componentData[id].raw = rawData
        this.componentData[id].mapped = mappedData
        this.componentData[id].loading = false

        // 设置下钻管理器的初始数据
        drillManager.setCurrentData(id, rawData)

        return mappedData
      } catch (error) {
        this.componentData[id].loading = false
        this.componentData[id].error = error.message
        return []
      }
    },

    /**
     * 更新组件数据（静态数据变更时）
     */
    updateComponentData(componentId, rawData, mapping = {}) {
      if (!this.componentData[componentId]) {
        this.componentData[componentId] = { raw: [], mapped: [], loading: false, error: null }
      }

      const mappedData = mapData(rawData, mapping)
      this.componentData[componentId].raw = rawData
      this.componentData[componentId].mapped = mappedData

      drillManager.setCurrentData(componentId, rawData)
    },

    /**
     * 执行下钻
     */
    executeDrillDown(componentId, config, value, field) {
      const result = drillManager.drillDown(componentId, config, value, field)
      if (!result) return null

      // 更新面包屑状态
      this.drillBreadcrumbs[componentId] = result.breadcrumb
      this.drillLevels[componentId] = drillManager.getLevel(componentId)

      // 更新组件数据
      if (this.componentData[componentId]) {
        this.componentData[componentId].raw = result.newData
        this.componentData[componentId].mapped = result.newData
      }

      return result
    },

    /**
     * 返回指定层级
     */
    drillToLevel(componentId, targetLevel) {
      const result = drillManager.drillToLevel(componentId, targetLevel)
      this.drillBreadcrumbs[componentId] = result.breadcrumb
      this.drillLevels[componentId] = drillManager.getLevel(componentId)

      if (this.componentData[componentId]) {
        this.componentData[componentId].raw = result.newData || []
        this.componentData[componentId].mapped = result.newData || []
      }

      return result
    },

    /**
     * 重置下钻状态
     */
    resetDrillDown(componentId) {
      const result = drillManager.reset(componentId)
      this.drillBreadcrumbs[componentId] = []
      this.drillLevels[componentId] = 0

      if (this.componentData[componentId]) {
        this.componentData[componentId].raw = result.newData || []
        this.componentData[componentId].mapped = result.newData || []
      }

      return result
    },

    /**
     * 根据表单筛选参数过滤组件数据
     */
    applyFilterToComponent(componentId, originalData, filterParams, mapping = {}) {
      const filtered = filterDataByParams(originalData, filterParams)
      const mappedData = mapData(filtered, mapping)

      if (this.componentData[componentId]) {
        this.componentData[componentId].raw = filtered
        this.componentData[componentId].mapped = mappedData
      }

      return mappedData
    },

    /**
     * 清除组件数据
     */
    clearComponentData(componentId) {
      delete this.componentData[componentId]
      delete this.drillBreadcrumbs[componentId]
      delete this.drillLevels[componentId]
      drillManager.reset(componentId)
    }
  }
})
