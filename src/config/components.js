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
  {
    type: 'scatter-chart',
    name: '散点图',
    category: COMPONENT_CATEGORIES.CHART,
    icon: 'chart-scatter',
    defaultProps: {
      title: '散点图',
      theme: 'dark',
      showLegend: true,
      showTooltip: true,
      symbolSize: 12
    },
    defaultSize: { width: 600, height: 400 }
  },
  {
    type: 'funnel-chart',
    name: '漏斗图',
    category: COMPONENT_CATEGORIES.CHART,
    icon: 'chart-funnel',
    defaultProps: {
      title: '漏斗图',
      theme: 'dark',
      showLegend: true,
      showTooltip: true,
      sort: 'descending',
      gap: 2
    },
    defaultSize: { width: 500, height: 400 }
  },
  {
    type: 'heatmap-chart',
    name: '热力图',
    category: COMPONENT_CATEGORIES.CHART,
    icon: 'chart-heatmap',
    defaultProps: {
      title: '热力图',
      theme: 'dark',
      showLegend: true,
      showTooltip: true
    },
    defaultSize: { width: 600, height: 400 }
  },
  {
    type: 'treemap-chart',
    name: '矩形树图',
    category: COMPONENT_CATEGORIES.CHART,
    icon: 'chart-treemap',
    defaultProps: {
      title: '矩形树图',
      theme: 'dark',
      showTooltip: true,
      roam: false
    },
    defaultSize: { width: 600, height: 400 }
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
      columns: [
        { key: 'region', title: '区域', sortable: true, filterable: true },
        { key: 'product', title: '产品', sortable: true, filterable: true },
        { key: 'sales', title: '销售额', sortable: true, align: 'right', formatter: 'currency' },
        { key: 'count', title: '销量', sortable: true, align: 'right' }
      ]
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
      fields: [
        {
          key: 'dateRange',
          type: 'daterange',
          label: '日期范围',
          placeholder: '选择日期范围'
        },
        {
          key: 'category',
          type: 'select',
          label: '产品类别',
          placeholder: '请选择',
          options: [
            { label: '全部', value: '' },
            { label: '电子产品', value: 'electronics' },
            { label: '食品', value: 'food' },
            { label: '服装', value: 'clothing' }
          ]
        }
      ]
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
  {
    type: 'kpi-card',
    name: 'KPI 卡片',
    category: COMPONENT_CATEGORIES.TEXT,
    icon: 'kpi-card',
    defaultProps: {
      value: 0,
      label: '指标',
      prefix: '',
      suffix: '',
      icon: 'arrow-up',
      trend: 'up',
      trendValue: '+12.5%',
      color: '#18a058'
    },
    defaultSize: { width: 240, height: 120 }
  },
  {
    type: 'progress-bar',
    name: '进度条',
    category: COMPONENT_CATEGORIES.TEXT,
    icon: 'progress',
    defaultProps: {
      value: 65,
      max: 100,
      color: '#2080f0',
      trackColor: '#1e3a5f',
      height: 8,
      showLabel: true,
      labelPosition: 'right',
      format: '{value}%'
    },
    defaultSize: { width: 400, height: 40 }
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
  {
    type: 'video',
    name: '视频',
    category: COMPONENT_CATEGORIES.MEDIA,
    icon: 'video',
    defaultProps: {
      src: '',
      autoplay: false,
      loop: false,
      muted: false,
      controls: true,
      poster: ''
    },
    defaultSize: { width: 600, height: 400 }
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
  },
  {
    type: 'tab-container',
    name: 'Tab 容器',
    category: COMPONENT_CATEGORIES.CONTAINER,
    icon: 'tab-container',
    defaultProps: {
      tabs: [{ label: '标签 1' }, { label: '标签 2' }],
      background: 'transparent',
      borderRadius: 0
    },
    defaultSize: { width: 500, height: 400 }
  },
  {
    type: 'marquee',
    name: '跑马灯',
    category: COMPONENT_CATEGORIES.CONTAINER,
    icon: 'marquee',
    defaultProps: {
      text: '欢迎使用 LtdView 可视化平台',
      speed: 3,
      direction: 'left',
      color: '#ffffff',
      fontSize: 16,
      fontWeight: '400',
      background: 'transparent'
    },
    defaultSize: { width: 600, height: 40 }
  },

  // DataV 边框组件
  {
    type: 'datav-border',
    name: 'DataV 边框',
    category: COMPONENT_CATEGORIES.DECORATOR,
    icon: 'datav-border',
    defaultProps: {
      borderType: 'border-1',
      color: '#2080f0',
      backgroundColor: 'transparent'
    },
    defaultSize: { width: 400, height: 300 }
  },

  // DataV 装饰器组件
  {
    type: 'datav-decoration',
    name: 'DataV 装饰',
    category: COMPONENT_CATEGORIES.DECORATOR,
    icon: 'datav-decoration',
    defaultProps: {
      decorationType: 'decoration-1',
      color: ['#2080f0', '#40a9ff'],
      reverse: false
    },
    defaultSize: { width: 400, height: 40 }
  },

  // DataV 特殊组件
  {
    type: 'datav-scroll-board',
    name: '轮播表格',
    category: COMPONENT_CATEGORIES.TABLE,
    icon: 'datav-scroll-board',
    defaultProps: {
      header: ['名称', '数值'],
      data: [
        ['示例数据 1', '128'],
        ['示例数据 2', '256'],
        ['示例数据 3', '512']
      ],
      rowNum: 5,
      waitTime: 2000,
      autoPlay: true,
      headerBGC: '#1e3a5f',
      headerColor: '#4fc3f7'
    },
    defaultSize: { width: 500, height: 300 }
  },
  {
    type: 'datav-digital-flop',
    name: '数字翻牌器',
    category: COMPONENT_CATEGORIES.TEXT,
    icon: 'datav-digital-flop',
    defaultProps: {
      value: 128,
      decimals: 0,
      fontSize: 32,
      colors: ['#2080f0', '#40a9ff'],
      textAlign: 'center'
    },
    defaultSize: { width: 300, height: 80 }
  },
  {
    type: 'datav-water-ball',
    name: '水球图',
    category: COMPONENT_CATEGORIES.CHART,
    icon: 'datav-water-ball',
    defaultProps: {
      percent: 50,
      colors: [
        { color: '#2080f0', rgb: '32, 128, 240' },
        { color: '#40a9ff', rgb: '64, 169, 255' }
      ]
    },
    defaultSize: { width: 200, height: 200 }
  },
  {
    type: 'datav-loading',
    name: '加载动画',
    category: COMPONENT_CATEGORIES.DECORATOR,
    icon: 'datav-loading',
    defaultProps: {
      size: 60
    },
    defaultSize: { width: 120, height: 120 }
  }
]

// 根据类型获取组件配置
export function getComponentByType(type) {
  return componentRegistry.find((item) => item.type === type)
}

// 根据分类获取组件列表
export function getComponentsByCategory(category) {
  return componentRegistry.filter((item) => item.category === category)
}

// 获取所有分类
export function getAllCategories() {
  const categories = new Set(componentRegistry.map((item) => item.category))
  return Array.from(categories)
}
