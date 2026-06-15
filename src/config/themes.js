// 预设主题
export const themes = {
  dark: {
    name: '深色主题',
    background: '#0a1929',
    cardBg: '#0d192d',
    primary: '#2080f0',
    text: '#ffffff',
    textSecondary: '#a0aec0',
    border: '#1e3a5f'
  },
  blue: {
    name: '科技蓝',
    background: '#001529',
    cardBg: '#002140',
    primary: '#1890ff',
    text: '#ffffff',
    textSecondary: '#8c8c8c',
    border: '#003a8c'
  },
  green: {
    name: '自然绿',
    background: '#0a1f1a',
    cardBg: '#0d2e26',
    primary: '#52c41a',
    text: '#ffffff',
    textSecondary: '#a0aec0',
    border: '#1e3a2f'
  },
  purple: {
    name: '梦幻紫',
    background: '#1a0a2e',
    cardBg: '#2d1b4e',
    primary: '#722ed1',
    text: '#ffffff',
    textSecondary: '#a0aec0',
    border: '#3d1d6e'
  }
}

// 图表配色方案
export const chartColors = {
  dark: ['#2080f0', '#18a058', '#f0a020', '#d03050', '#722ed1', '#13c2c2', '#eb2f96', '#faad14'],
  blue: ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1', '#13c2c2', '#eb2f96', '#fa8c16'],
  green: ['#52c41a', '#1890ff', '#faad14', '#f5222d', '#722ed1', '#13c2c2', '#eb2f96', '#fa8c16'],
  purple: ['#722ed1', '#1890ff', '#52c41a', '#f5222d', '#13c2c2', '#eb2f96', '#faad14', '#fa8c16']
}

// 获取当前主题配置
export function getThemeConfig(themeName = 'dark') {
  return themes[themeName] || themes.dark
}

// 获取图表颜色
export function getChartColors(themeName = 'dark') {
  return chartColors[themeName] || chartColors.dark
}
