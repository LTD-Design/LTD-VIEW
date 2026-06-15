import axios from 'axios'

// 数据源类型
export const DATA_SOURCE_TYPES = {
  STATIC: 'static',
  API: 'api'
}

/**
 * 获取组件数据 - 根据数据源配置获取并转换数据
 */
export async function fetchComponentData(component) {
  const dataSource = component.data
  if (!dataSource) return []

  if (dataSource.type === DATA_SOURCE_TYPES.API && dataSource.url) {
    return await fetchApiData(dataSource)
  }

  return getStaticData(dataSource)
}

/**
 * 获取静态数据
 */
export function getStaticData(dataSource) {
  if (!dataSource.source) return []
  if (Array.isArray(dataSource.source)) return dataSource.source

  // 尝试解析 JSON 字符串
  if (typeof dataSource.source === 'string') {
    try {
      return JSON.parse(dataSource.source)
    } catch {
      return []
    }
  }

  return []
}

/**
 * 获取 API 数据
 */
async function fetchApiData(dataSource) {
  try {
    const config = {
      url: dataSource.url,
      method: dataSource.method || 'GET',
      headers: dataSource.headers || {},
      params: dataSource.params || {}
    }

    const response = await axios(config)
    let data = response.data

    // 支持从嵌套路径提取数据（如 "data.list"）
    if (dataSource.responsePath) {
      const paths = dataSource.responsePath.split('.')
      for (const path of paths) {
        if (data && typeof data === 'object') {
          data = data[path]
        }
      }
    }

    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error(`API 数据获取失败: ${dataSource.url}`, error)
    return []
  }
}

/**
 * 字段映射 - 将原始数据映射为组件可用的格式
 * mapping: { xField: 'name', yField: 'value', seriesField: 'category' }
 */
export function mapData(rawData, mapping = {}) {
  if (!rawData || rawData.length === 0) return []

  // 如果没有映射配置，直接返回原始数据
  if (!mapping.xField && !mapping.yField) return rawData

  return rawData.map(item => ({
    name: mapping.xField ? item[mapping.xField] : item.name,
    value: mapping.yField ? item[mapping.yField] : item.value,
    category: mapping.seriesField ? item[mapping.seriesField] : undefined,
    _raw: item // 保留原始数据引用
  }))
}

/**
 * 根据筛选参数过滤数据
 */
export function filterDataByParams(data, filterParams = {}) {
  if (!filterParams || Object.keys(filterParams).length === 0) return data

  return data.filter(item => {
    return Object.entries(filterParams).every(([key, value]) => {
      // 空值/空数组不过滤
      if (value === null || value === undefined || value === '') return true
      if (Array.isArray(value) && value.length === 0) return true

      // 日期范围特殊处理
      if (Array.isArray(value) && value.length === 2) {
        const itemVal = item[key]
        if (!itemVal) return false
        const itemTime = new Date(itemVal).getTime()
        return itemTime >= value[0] && itemTime <= value[1]
      }

      // 数组包含匹配
      if (Array.isArray(value)) {
        return value.includes(item[key])
      }

      // 字符串模糊匹配
      if (typeof item[key] === 'string') {
        return item[key].toLowerCase().includes(String(value).toLowerCase())
      }

      return item[key] === value
    })
  })
}

/**
 * 模拟下钻数据生成 - 用于演示
 */
export function generateDrillData(parentField, parentValue, level) {
  const cities = {
    '华东区': ['上海', '杭州', '南京', '苏州', '宁波'],
    '华北区': ['北京', '天津', '石家庄', '太原'],
    '华南区': ['广州', '深圳', '东莞', '佛山'],
    '华中区': ['武汉', '长沙', '郑州'],
    '西南区': ['成都', '重庆', '昆明'],
    '西北区': ['西安', '兰州', '乌鲁木齐'],
    '东北区': ['沈阳', '大连', '哈尔滨']
  }

  const districts = {
    '上海': ['浦东新区', '黄浦区', '静安区', '徐汇区'],
    '杭州': ['西湖区', '滨江区', '萧山区', '余杭区'],
    '北京': ['朝阳区', '海淀区', '东城区', '西城区'],
    '广州': ['天河区', '越秀区', '白云区', '番禺区'],
    '深圳': ['南山区', '福田区', '罗湖区', '宝安区'],
    '成都': ['武侯区', '锦江区', '青羊区', '高新区'],
    '武汉': ['武昌区', '洪山区', '江汉区', '汉阳区']
  }

  const products = ['电子产品', '食品', '服装', '家居', '办公']

  if (level === 0) {
    // 第一级：各区域数据
    return [
      { region: '华东区', product: '电子产品', sales: 125000, count: 520 },
      { region: '华北区', product: '食品', sales: 89000, count: 380 },
      { region: '华南区', product: '电子产品', sales: 156000, count: 650 },
      { region: '华中区', product: '服装', sales: 67000, count: 290 },
      { region: '西南区', product: '食品', sales: 45000, count: 180 },
      { region: '西北区', product: '电子产品', sales: 32000, count: 140 },
      { region: '东北区', product: '服装', sales: 51000, count: 220 }
    ]
  }

  if (level === 1) {
    // 第二级：区域下各城市数据
    const cityList = cities[parentValue] || ['城市A', '城市B', '城市C']
    return cityList.map((city, i) => ({
      region: parentValue,
      city,
      product: products[i % products.length],
      sales: Math.round(5000 + Math.random() * 50000),
      count: Math.round(20 + Math.random() * 300)
    }))
  }

  if (level === 2) {
    // 第三级：城市下各区数据
    const districtList = districts[parentValue] || ['区域A', '区域B', '区域C']
    return districtList.map((district, i) => ({
      region: district,
      city: parentValue,
      product: products[i % products.length],
      sales: Math.round(1000 + Math.random() * 20000),
      count: Math.round(5 + Math.random() * 100)
    }))
  }

  return []
}
