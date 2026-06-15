// 组件分类
export const COMPONENT_CATEGORIES = {
  CHART: 'chart',
  TABLE: 'table',
  FORM: 'form',
  TEXT: 'text',
  MEDIA: 'media',
  DECORATOR: 'decorator',
  CONTAINER: 'container'
}

// 组件分类名称映射
export const CATEGORY_NAMES = {
  [COMPONENT_CATEGORIES.CHART]: '图表',
  [COMPONENT_CATEGORIES.TABLE]: '表格',
  [COMPONENT_CATEGORIES.FORM]: '表单',
  [COMPONENT_CATEGORIES.TEXT]: '文本',
  [COMPONENT_CATEGORIES.MEDIA]: '媒体',
  [COMPONENT_CATEGORIES.DECORATOR]: '装饰',
  [COMPONENT_CATEGORIES.CONTAINER]: '容器'
}

// 组件注册表
export const componentRegistry = [
  // 图表类
  {
    type: 'bar-chart',
    name: '柱状图',
    category: COMPONENT_CATEGORIES.CHART,
    icon: 'chart-bar',
    defaultProps: {
      title: '柱状图',
      theme: 'dark',
      showLegend: true,
      showTooltip: true
    },
    defaultSize: { width: 600, height: 400 }
  },
  {
    type: 'line-chart',
    name: '折线图',
    category: COMPONENT_CATEGORIES.CHART,
    icon: 'chart-line',
    defaultProps: {
      title: '折线图',
      theme: 'dark',
      showLegend: true,
      showTooltip: true,
      smooth: true
    },
    defaultSize: { width: 600, height: 400 }
  },
  {
    type: 'pie-chart',
    name: '饼图',
    category: COMPONENT_CATEGORIES.CHART,
    icon: 'chart-pie',
    defaultProps: {
      title: '饼图',
      theme: 'dark',
      showLegend: true,
      showTooltip: true
    },
    defaultSize: { width: 400, height: 400 }
  },
  {
    type: 'gauge-chart',
    name: '仪表盘',
    category: COMPONENT_CATEGORIES.CHART,
    icon: 'chart-gauge',
    defaultProps: {
      title: '仪表盘',
      theme: 'dark',
      min: 0,
      max: 100
    },
    defaultSize: { width: 300, height: 300 }
  },
  {
    type: 'radar-chart',
    name: '雷达图',
    category: COMPONENT_CATEGORIES.CHART,
    icon: 'chart-radar',
    defaultProps: {
      title: '雷达图',
      theme: 'dark',
      showLegend: true
    },
    defaultSize: { width: 400, height: 400 }
  },

  // 表格类
  {
    type: 'data-table',
    name: '数据表格',
    category: COMPONENT_CATEGORIES.TABLE,
    icon: 'table',
    defaultProps: {
      title: '数据表格',
      pagination: true,
      pageSize: 10,
      sorting: true,
      filtering: true,
      stripe: true,
      border: true,
      columns: []
    },
    defaultSize: { width: 800, height: 400 }
  },
  {
    type: 'rank-list',
    name: '排名列表',
    category: COMPONENT_CATEGORIES.TABLE,
    icon: 'rank',
    defaultProps: {
      title: '排名列表',
      showNumber: true,
      animation: true
    },
    defaultSize: { width: 400, height: 400 }
  },

  // 表单类
  {
    type: 'form-filter',
    name: '筛选器',
    category: COMPONENT_CATEGORIES.FORM,
    icon: 'filter',
    defaultProps: {
      layout: 'inline',
      labelWidth: 80,
      fields: []
    },
    defaultSize: { width: 600, height: 100 }
  },
  {
    type: 'form-input',
    name: '输入框',
    category: COMPONENT_CATEGORIES.FORM,
    icon: 'edit',
    defaultProps: {
      label: '输入框',
      placeholder: '请输入',
      value: ''
    },
    defaultSize: { width: 200, height: 60 }
  },
  {
    type: 'form-select',
    name: '下拉选择',
    category: COMPONENT_CATEGORIES.FORM,
    icon: 'dropdown',
    defaultProps: {
      label: '下拉选择',
      placeholder: '请选择',
      options: [],
      value: null
    },
    defaultSize: { width: 200, height: 60 }
  },
  {
    type: 'form-date',
    name: '日期选择',
    category: COMPONENT_CATEGORIES.FORM,
    icon: 'calendar',
    defaultProps: {
      label: '日期选择',
      placeholder: '请选择日期',
      type: 'date',
      value: null
    },
    defaultSize: { width: 200, height: 60 }
  },

  // 文本类
  {
    type: 'title',
    name: '标题',
    category: COMPONENT_CATEGORIES.TEXT,
    icon: 'title',
    defaultProps: {
      text: '标题',
      level: 1,
      align: 'left',
      color: '#ffffff'
    },
    defaultSize: { width: 400, height: 60 }
  },
  {
    type: 'subtitle',
    name: '副标题',
    category: COMPONENT_CATEGORIES.TEXT,
    icon: 'subtitle',
    defaultProps: {
      text: '副标题',
      align: 'left',
      color: '#a0aec0'
    },
    defaultSize: { width: 300, height: 40 }
  },
  {
    type: 'number',
    name: '数字翻牌器',
    category: COMPONENT_CATEGORIES.TEXT,
    icon: 'number',
    defaultProps: {
      value: 0,
      prefix: '',
      suffix: '',
      duration: 2000,
      separator: ','
    },
    defaultSize: { width: 200, height: 80 }
  },

  // 媒体类
  {
    type: 'image',
    name: '图片',
    category: COMPONENT_CATEGORIES.MEDIA,
    icon: 'image',
    defaultProps: {
      src: '',
      fit: 'contain',
      alt: ''
    },
    defaultSize: { width: 400, height: 300 }
  },

  // 装饰类
  {
    type: 'border',
    name: '边框',
    category: COMPONENT_CATEGORIES.DECORATOR,
    icon: 'border',
    defaultProps: {
      style: 'solid',
      color: '#1e3a5f',
      width: 1,
      radius: 0
    },
    defaultSize: { width: 400, height: 300 }
  },
  {
    type: 'divider',
    name: '分割线',
    category: COMPONENT_CATEGORIES.DECORATOR,
    icon: 'divider',
    defaultProps: {
      direction: 'horizontal',
      color: '#1e3a5f',
      width: 1
    },
    defaultSize: { width: 400, height: 2 }
  },

  // 容器类
  {
    type: 'card',
    name: '卡片',
    category: COMPONENT_CATEGORIES.CONTAINER,
    icon: 'card',
    defaultProps: {
      title: '',
      bordered: true,
      hoverable: false
    },
    defaultSize: { width: 400, height: 300 }
  }
]

// 根据类型获取组件配置
export function getComponentByType(type) {
  return componentRegistry.find(item => item.type === type)
}

// 根据分类获取组件列表
export function getComponentsByCategory(category) {
  return componentRegistry.filter(item => item.category === category)
}

// 获取所有分类
export function getAllCategories() {
  const categories = new Set(componentRegistry.map(item => item.category))
  return Array.from(categories)
}
