import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useDataStore } from '@/stores/data'

vi.mock('@/utils/dataAdapter', () => ({
  fetchComponentData: vi.fn(),
  mapData: vi.fn((data, mapping) => {
    if (!mapping || Object.keys(mapping).length === 0) return data
    return data.map((item) => {
      const result = {}
      Object.entries(mapping).forEach(([target, source]) => {
        result[target] = item[source]
      })
      return result
    })
  }),
  filterDataByParams: vi.fn((data, params) => {
    if (!params || Object.keys(params).length === 0) return data
    return data.filter((item) => {
      return Object.entries(params).every(([key, value]) => {
        if (value === '' || value === null || value === undefined) return true
        return item[key] === value
      })
    })
  }),
  generateDrillData: vi.fn(() => [])
}))

vi.mock('@/utils/drillDown', () => ({
  drillManager: {
    setCurrentData: vi.fn(),
    drillDown: vi.fn(),
    drillToLevel: vi.fn(),
    reset: vi.fn(),
    getLevel: vi.fn(() => 0),
    getBreadcrumb: vi.fn(() => []),
    getState: vi.fn(() => ({ level: 0, breadcrumb: [], originalData: null, currentData: [] }))
  }
}))

import { drillManager } from '@/utils/drillDown'
import { mapData, filterDataByParams } from '@/utils/dataAdapter'

describe('dataStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('初始化状态正确', () => {
    const store = useDataStore()
    expect(store.componentData).toEqual({})
    expect(store.drillBreadcrumbs).toEqual({})
    expect(store.drillLevels).toEqual({})
  })

  it('getComponentData 返回空数组（无数据）', () => {
    const store = useDataStore()
    expect(store.getComponentData('nonexistent')).toEqual([])
  })

  it('getComponentData 返回映射后数据', () => {
    const store = useDataStore()
    const mapped = [{ name: 'A', value: 10 }]
    store.componentData['comp-1'] = { raw: [], mapped, loading: false, error: null }
    expect(store.getComponentData('comp-1')).toEqual(mapped)
  })

  it('isLoading 返回 false（无数据）', () => {
    const store = useDataStore()
    expect(store.isLoading('nonexistent')).toBe(false)
  })

  it('isLoading 返回 true（加载中）', () => {
    const store = useDataStore()
    store.componentData['comp-1'] = { raw: [], mapped: [], loading: true, error: null }
    expect(store.isLoading('comp-1')).toBe(true)
  })

  it('getBreadcrumb 返回空数组（无数据）', () => {
    const store = useDataStore()
    expect(store.getBreadcrumb('nonexistent')).toEqual([])
  })

  it('getBreadcrumb 返回面包屑数据', () => {
    const store = useDataStore()
    store.drillBreadcrumbs['comp-1'] = [{ level: 0, name: '华东', field: 'region' }]
    expect(store.getBreadcrumb('comp-1')).toHaveLength(1)
  })

  it('getDrillLevel 返回 0（无数据）', () => {
    const store = useDataStore()
    expect(store.getDrillLevel('nonexistent')).toBe(0)
  })

  it('getDrillLevel 返回当前层级', () => {
    const store = useDataStore()
    store.drillLevels['comp-1'] = 2
    expect(store.getDrillLevel('comp-1')).toBe(2)
  })

  it('updateComponentData 更新组件数据', () => {
    const store = useDataStore()
    const rawData = [
      { name: 'A', value: 10 },
      { name: 'B', value: 20 }
    ]

    store.updateComponentData('comp-1', rawData)

    expect(store.componentData['comp-1']).toBeDefined()
    expect(store.componentData['comp-1'].raw).toEqual(rawData)
    expect(store.componentData['comp-1'].mapped).toEqual(rawData)
    expect(drillManager.setCurrentData).toHaveBeenCalledWith('comp-1', rawData)
  })

  it('updateComponentData 应用字段映射', () => {
    const store = useDataStore()
    const rawData = [{ region: '华东', sales: 100 }]
    const mapping = { name: 'region', value: 'sales' }

    store.updateComponentData('comp-1', rawData, mapping)

    expect(store.componentData['comp-1'].mapped).toEqual([{ name: '华东', value: 100 }])
    expect(mapData).toHaveBeenCalledWith(rawData, mapping)
  })

  it('executeDrillDown 执行下钻', () => {
    const store = useDataStore()
    const drillResult = {
      newData: [{ name: '杭州', value: 50 }],
      breadcrumb: [{ level: 0, name: '华东', field: 'region' }]
    }
    drillManager.drillDown.mockReturnValue(drillResult)
    drillManager.getLevel.mockReturnValue(1)

    store.componentData['comp-1'] = {
      raw: [{ name: '华东', value: 100 }],
      mapped: [{ name: '华东', value: 100 }],
      loading: false,
      error: null
    }

    const result = store.executeDrillDown(
      'comp-1',
      { levels: [{ name: '区域' }, { name: '城市' }] },
      '华东',
      'region'
    )

    expect(result).toEqual(drillResult)
    expect(store.drillBreadcrumbs['comp-1']).toEqual(drillResult.breadcrumb)
    expect(store.drillLevels['comp-1']).toBe(1)
    expect(store.componentData['comp-1'].raw).toEqual(drillResult.newData)
  })

  it('executeDrillDown 返回 null（无下钻结果）', () => {
    const store = useDataStore()
    drillManager.drillDown.mockReturnValue(null)

    const result = store.executeDrillDown('comp-1', {}, 'value', 'field')
    expect(result).toBeNull()
  })

  it('drillToLevel 返回指定层级', () => {
    const store = useDataStore()
    const drillResult = {
      newData: [{ name: '华东', value: 100 }],
      breadcrumb: [{ level: 0, name: '华东', field: 'region' }]
    }
    drillManager.drillToLevel.mockReturnValue(drillResult)
    drillManager.getLevel.mockReturnValue(1)

    store.componentData['comp-1'] = {
      raw: [{ name: '杭州', value: 50 }],
      mapped: [{ name: '杭州', value: 50 }],
      loading: false,
      error: null
    }

    const result = store.drillToLevel('comp-1', 1)

    expect(result).toEqual(drillResult)
    expect(store.drillBreadcrumbs['comp-1']).toEqual(drillResult.breadcrumb)
    expect(store.drillLevels['comp-1']).toBe(1)
  })

  it('resetDrillDown 重置下钻状态', () => {
    const store = useDataStore()
    const originalData = [{ name: 'A', value: 1 }]
    const resetResult = { newData: originalData }

    drillManager.reset.mockReturnValue(resetResult)

    store.componentData['comp-1'] = {
      raw: [{ name: 'B', value: 2 }],
      mapped: [{ name: 'B', value: 2 }],
      loading: false,
      error: null
    }
    store.drillBreadcrumbs['comp-1'] = [{ name: 'B' }]
    store.drillLevels['comp-1'] = 1

    store.resetDrillDown('comp-1')

    expect(store.drillBreadcrumbs['comp-1']).toEqual([])
    expect(store.drillLevels['comp-1']).toBe(0)
    expect(store.componentData['comp-1'].raw).toEqual(originalData)
    expect(drillManager.reset).toHaveBeenCalledWith('comp-1')
  })

  it('applyFilterToComponent 过滤数据', () => {
    const store = useDataStore()
    const originalData = [
      { region: '华东', value: 100 },
      { region: '华北', value: 200 },
      { region: '华东', value: 150 }
    ]

    store.componentData['comp-1'] = {
      raw: originalData,
      mapped: originalData,
      loading: false,
      error: null
    }

    const result = store.applyFilterToComponent('comp-1', originalData, { region: '华东' })

    expect(filterDataByParams).toHaveBeenCalledWith(originalData, { region: '华东' })
    expect(result).toHaveLength(2)
    expect(store.componentData['comp-1'].raw).toHaveLength(2)
  })

  it('applyFilterToComponent 应用映射', () => {
    const store = useDataStore()
    const originalData = [{ region: '华东', sales: 100 }]
    const mapping = { name: 'region', value: 'sales' }

    store.componentData['comp-1'] = {
      raw: originalData,
      mapped: originalData,
      loading: false,
      error: null
    }

    store.applyFilterToComponent('comp-1', originalData, {}, mapping)

    expect(mapData).toHaveBeenCalled()
    expect(store.componentData['comp-1'].mapped).toEqual([{ name: '华东', value: 100 }])
  })

  it('clearComponentData 清除所有数据', () => {
    const store = useDataStore()
    store.componentData['comp-1'] = {
      raw: [{ name: 'A' }],
      mapped: [{ name: 'A' }],
      loading: false,
      error: null
    }
    store.drillBreadcrumbs['comp-1'] = [{ name: 'A' }]
    store.drillLevels['comp-1'] = 1

    store.clearComponentData('comp-1')

    expect(store.componentData['comp-1']).toBeUndefined()
    expect(store.drillBreadcrumbs['comp-1']).toBeUndefined()
    expect(store.drillLevels['comp-1']).toBeUndefined()
    expect(drillManager.reset).toHaveBeenCalledWith('comp-1')
  })

  it('stopPolling 停止轮询', () => {
    const store = useDataStore()
    const timerId = 123
    store._pollTimers['comp-1'] = timerId

    const clearTimeoutSpy = vi.spyOn(global, 'clearInterval')

    store.stopPolling('comp-1')

    expect(clearTimeoutSpy).toHaveBeenCalledWith(timerId)
    expect(store._pollTimers['comp-1']).toBeUndefined()

    clearTimeoutSpy.mockRestore()
  })

  it('stopPolling 无定时器时不报错', () => {
    const store = useDataStore()
    expect(() => store.stopPolling('nonexistent')).not.toThrow()
  })
})
