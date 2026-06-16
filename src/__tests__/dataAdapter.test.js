import { describe, it, expect } from 'vitest'
import { getStaticData, mapData, filterDataByParams } from '@/utils/dataAdapter'

describe('dataAdapter', () => {
  describe('getStaticData', () => {
    it('返回空数组当无数据', () => {
      expect(getStaticData({})).toEqual([])
      expect(getStaticData({ source: null })).toEqual([])
    })

    it('直接返回数组', () => {
      const data = [{ name: 'A', value: 1 }]
      expect(getStaticData({ source: data })).toEqual(data)
    })

    it('解析 JSON 字符串', () => {
      const data = [{ name: 'A', value: 1 }]
      expect(getStaticData({ source: JSON.stringify(data) })).toEqual(data)
    })

    it('无效 JSON 返回空数组', () => {
      expect(getStaticData({ source: 'not json' })).toEqual([])
    })
  })

  describe('mapData', () => {
    it('无数据返回空数组', () => {
      expect(mapData([])).toEqual([])
      expect(mapData(null)).toEqual([])
    })

    it('无映射配置返回原始数据', () => {
      const data = [{ name: 'A', value: 1 }]
      expect(mapData(data, {})).toEqual(data)
    })

    it('应用字段映射', () => {
      const data = [{ region: '华东', sales: 100 }]
      const result = mapData(data, { xField: 'region', yField: 'sales' })
      expect(result[0]).toEqual({ name: '华东', value: 100, category: undefined, _raw: data[0] })
    })

    it('映射系列字段', () => {
      const data = [{ region: '华东', sales: 100, type: '电子' }]
      const result = mapData(data, { xField: 'region', yField: 'sales', seriesField: 'type' })
      expect(result[0].category).toBe('电子')
    })
  })

  describe('filterDataByParams', () => {
    const data = [
      { name: 'A', region: '华东', value: 100 },
      { name: 'B', region: '华北', value: 200 },
      { name: 'C', region: '华东', value: 150 }
    ]

    it('无筛选条件返回全部', () => {
      expect(filterDataByParams(data, {})).toEqual(data)
      expect(filterDataByParams(data, null)).toEqual(data)
    })

    it('按单个字段筛选', () => {
      const result = filterDataByParams(data, { region: '华东' })
      expect(result).toHaveLength(2)
    })

    it('按多个字段筛选', () => {
      const result = filterDataByParams(data, { region: '华东', name: 'A' })
      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('A')
    })

    it('空值不过滤', () => {
      const result = filterDataByParams(data, { region: '' })
      expect(result).toEqual(data)
    })

    it('数组包含匹配', () => {
      const result = filterDataByParams(data, { region: ['华东', '华北'] })
      expect(result).toHaveLength(3)
    })

    it('字符串模糊匹配', () => {
      const result = filterDataByParams(data, { name: 'a' })
      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('A')
    })
  })
})
