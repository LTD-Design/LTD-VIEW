import { describe, it, expect, beforeEach } from 'vitest'
import { DrillManager } from '@/utils/drillDown'

describe('DrillManager', () => {
  let manager

  beforeEach(() => {
    manager = new DrillManager()
  })

  it('getState 返回初始状态', () => {
    const state = manager.getState('comp-1')
    expect(state.level).toBe(0)
    expect(state.breadcrumb).toEqual([])
    expect(state.originalData).toBeNull()
  })

  it('setCurrentData 设置数据', () => {
    const data = [{ name: 'A', value: 1 }]
    manager.setCurrentData('comp-1', data)

    const state = manager.getState('comp-1')
    expect(state.currentData).toEqual(data)
    expect(state.originalData).toEqual(data)
  })

  it('getLevel 获取层级', () => {
    expect(manager.getLevel('comp-1')).toBe(0)
    manager.setCurrentData('comp-1', [{ name: 'A' }])
    manager.drillDown('comp-1', { levels: [{ name: '区域' }] }, '华东', 'region')
    expect(manager.getLevel('comp-1')).toBe(1)
  })

  it('isTopLevel 判断是否顶层', () => {
    expect(manager.isTopLevel('comp-1')).toBe(true)
    manager.setCurrentData('comp-1', [{ name: 'A' }])
    manager.drillDown('comp-1', { levels: [{ name: '区域' }] }, '华东', 'region')
    expect(manager.isTopLevel('comp-1')).toBe(false)
  })

  it('drillDown 执行下钻', () => {
    manager.setCurrentData('comp-1', [{ name: '华东', value: 100 }])
    const result = manager.drillDown(
      'comp-1',
      { levels: [{ name: '区域' }, { name: '城市' }] },
      '华东',
      'region'
    )

    expect(result).toBeDefined()
    expect(result.newData).toBeDefined()
    expect(result.breadcrumb).toHaveLength(1)
    expect(result.breadcrumb[0].name).toBe('华东')
    expect(manager.getLevel('comp-1')).toBe(1)
  })

  it('drillDown 限制最大层级', () => {
    manager.setCurrentData('comp-1', [{ name: 'A' }])
    manager.drillDown('comp-1', { levels: [{ name: 'L1' }] }, 'A', 'f1')
    const result = manager.drillDown('comp-1', { levels: [{ name: 'L1' }] }, 'B', 'f1')
    expect(result).toBeNull()
  })

  it('drillToLevel 返回指定层级', () => {
    manager.setCurrentData('comp-1', [{ name: '华东', value: 100 }])
    manager.drillDown('comp-1', { levels: [{ name: '区域' }, { name: '城市' }] }, '华东', 'region')
    manager.drillDown('comp-1', { levels: [{ name: '区域' }, { name: '城市' }] }, '杭州', 'city')

    const result = manager.drillToLevel('comp-1', 1)
    expect(result.breadcrumb).toHaveLength(1)
    expect(manager.getLevel('comp-1')).toBe(1)
  })

  it('drillToLevel 返回顶层', () => {
    manager.setCurrentData('comp-1', [{ name: '华东', value: 100 }])
    manager.drillDown('comp-1', { levels: [{ name: '区域' }] }, '华东', 'region')

    const result = manager.drillToLevel('comp-1', 0)
    expect(result.breadcrumb).toEqual([])
    expect(manager.getLevel('comp-1')).toBe(0)
  })

  it('reset 重置状态', () => {
    const originalData = [{ name: 'A', value: 1 }]
    manager.setCurrentData('comp-1', originalData)
    manager.drillDown('comp-1', { levels: [{ name: 'L1' }] }, 'A', 'f1')

    const result = manager.reset('comp-1')
    expect(result.newData).toEqual(originalData)
    expect(manager.getLevel('comp-1')).toBe(0)
    expect(manager.getBreadcrumb('comp-1')).toEqual([])
  })

  it('getBreadcrumb 获取面包屑', () => {
    manager.setCurrentData('comp-1', [{ name: 'A' }])
    manager.drillDown('comp-1', { levels: [{ name: 'L1' }] }, 'A', 'f1')

    const bc = manager.getBreadcrumb('comp-1')
    expect(bc).toHaveLength(1)
    // 返回副本，不影响原始状态
    bc.push({ fake: true })
    expect(manager.getBreadcrumb('comp-1')).toHaveLength(1)
  })
})
