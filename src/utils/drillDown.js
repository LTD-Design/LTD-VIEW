import { generateDrillData } from './dataAdapter'

/**
 * 下钻行为类型
 */
export const DRILL_BEHAVIOR = {
  REPLACE: 'replace',    // 替换当前组件数据
  NAVIGATE: 'navigate',  // 跳转页面
  MODAL: 'modal',        // 弹窗展示
  LINKAGE: 'linkage'     // 联动其他组件
}

/**
 * 下钻触发方式
 */
export const DRILL_TRIGGER = {
  CLICK: 'click',
  DBLCLICK: 'dblclick',
  CELL_CLICK: 'cell-click',
  ROW_CLICK: 'row-click'
}

/**
 * 下钻管理器 - 管理单个组件的下钻状态
 */
export class DrillManager {
  constructor() {
    // 每个组件的下钻状态 { componentId: { level, breadcrumb, originalData } }
    this.states = new Map()
  }

  /**
   * 获取组件的下钻状态
   */
  getState(componentId) {
    if (!this.states.has(componentId)) {
      this.states.set(componentId, {
        level: 0,
        breadcrumb: [],
        originalData: null,
        currentData: null
      })
    }
    return this.states.get(componentId)
  }

  /**
   * 执行下钻
   * @param {string} componentId - 组件 ID
   * @param {Object} config - 下钻配置
   * @param {string} value - 点击的值（如区域名）
   * @param {string} field - 下钻字段名
   * @returns {Object} { newData, breadcrumb }
   */
  drillDown(componentId, config, value, field) {
    const state = this.getState(componentId)

    // 保存原始数据（第一次下钻时）
    if (state.level === 0 && !state.originalData) {
      state.originalData = state.currentData
    }

    // 计算新的层级
    const newLevel = state.level + 1
    const maxLevel = config.levels?.length || 3

    if (newLevel > maxLevel) return null

    // 添加面包屑
    state.breadcrumb.push({
      level: newLevel,
      name: value,
      field,
      levelName: config.levels?.[newLevel - 1]?.name || `第${newLevel}级`
    })

    state.level = newLevel

    // 生成下钻数据（演示用，实际应从 API 获取）
    const newData = generateDrillData(field, value, newLevel)

    state.currentData = newData

    return {
      newData,
      breadcrumb: [...state.breadcrumb]
    }
  }

  /**
   * 返回指定层级
   * @param {string} componentId - 组件 ID
   * @param {number} targetLevel - 目标层级（0 = 顶层）
   * @returns {Object} { newData, breadcrumb }
   */
  drillToLevel(componentId, targetLevel) {
    const state = this.getState(componentId)

    if (targetLevel === 0) {
      // 返回顶层
      state.breadcrumb = []
      state.level = 0
      state.currentData = state.originalData
      return {
        newData: state.originalData,
        breadcrumb: []
      }
    }

    // 返回到指定层级
    state.breadcrumb = state.breadcrumb.slice(0, targetLevel)
    state.level = targetLevel

    // 重新生成该层级的数据
    if (state.breadcrumb.length > 0) {
      const lastEntry = state.breadcrumb[state.breadcrumb.length - 1]
      const newData = generateDrillData(lastEntry.field, lastEntry.name, targetLevel)
      state.currentData = newData
      return {
        newData,
        breadcrumb: [...state.breadcrumb]
      }
    }

    return {
      newData: state.originalData,
      breadcrumb: []
    }
  }

  /**
   * 重置组件的下钻状态
   */
  reset(componentId) {
    const state = this.getState(componentId)
    const originalData = state.originalData
    state.level = 0
    state.breadcrumb = []
    state.currentData = originalData
    return {
      newData: originalData,
      breadcrumb: []
    }
  }

  /**
   * 设置当前数据
   */
  setCurrentData(componentId, data) {
    const state = this.getState(componentId)
    state.currentData = data
    if (state.level === 0) {
      state.originalData = data
    }
  }

  /**
   * 获取当前层级
   */
  getLevel(componentId) {
    return this.getState(componentId).level
  }

  /**
   * 获取面包屑
   */
  getBreadcrumb(componentId) {
    return [...this.getState(componentId).breadcrumb]
  }

  /**
   * 是否在顶层
   */
  isTopLevel(componentId) {
    return this.getState(componentId).level === 0
  }
}

// 全局单例
export const drillManager = new DrillManager()
