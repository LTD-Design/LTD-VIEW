/**
 * 导出独立 HTML 文件
 * 生成一个自包含的 HTML 文件，可离线展示仪表盘
 */

/**
 * 生成图表的 ECharts option 配置（字符串形式）
 */
function generateChartOption(component, themes) {
  const data = component.data?.source || [
    { name: 'A', value: 100 },
    { name: 'B', value: 80 },
    { name: 'C', value: 60 }
  ]

  const themeName = component.props?.theme || 'dark'
  const colors = themes.chartColors?.[themeName] || themes.chartColors?.dark || ['#2080f0', '#18a058', '#f0a020']
  const themeConfig = themes.themes?.[themeName] || themes.themes?.dark || { border: '#1e3a5f', textSecondary: '#a0aec0' }

  const names = data.map(d => d.name || '').map(n => `'${n}'`).join(',')
  const values = data.map(d => d.value || 0).join(',')

  const axisStyle = `axisLine:{lineStyle:{color:'${themeConfig.border}'}},axisLabel:{color:'${themeConfig.textSecondary}'}`

  switch (component.type) {
    case 'bar-chart':
      return `{
        color:${JSON.stringify(colors)},
        tooltip:{trigger:'axis'},
        xAxis:{type:'category',data:[${names}],${axisStyle}},
        yAxis:{type:'value',${axisStyle},splitLine:{lineStyle:{color:'${themeConfig.border}'}}},
        series:[{type:'bar',data:[${values}],barWidth:'60%',itemStyle:{borderRadius:[4,4,0,0]}}],
        grid:{left:50,right:20,top:30,bottom:30}
      }`
    case 'line-chart':
      return `{
        color:${JSON.stringify(colors)},
        tooltip:{trigger:'axis'},
        xAxis:{type:'category',data:[${names}],${axisStyle}},
        yAxis:{type:'value',${axisStyle},splitLine:{lineStyle:{color:'${themeConfig.border}'}}},
        series:[{type:'line',data:[${values}],smooth:true,areaStyle:{opacity:0.3}}],
        grid:{left:50,right:20,top:30,bottom:30}
      }`
    case 'pie-chart':
      return `{
        color:${JSON.stringify(colors)},
        tooltip:{trigger:'item'},
        series:[{type:'pie',radius:['40%','70%'],data:[${data.map(d => `{name:'${d.name}',value:${d.value}}`).join(',')}],label:{color:'${themeConfig.textSecondary}'}}]
      }`
    case 'gauge-chart':
      return `{
        series:[{type:'gauge',min:${component.props?.min || 0},max:${component.props?.max || 100},data:[{value:${data[0]?.value || 50}}],axisLine:{lineStyle:{width:10,color:[[0.3,'#18a058'],[0.7,'#f0a020'],[1,'#d03050']]}},pointer:{width:4}}]
      }`
    case 'radar-chart':
      return `{
        color:${JSON.stringify(colors)},
        radar:{indicator:[${data.map(d => `{name:'${d.name}',max:100}`).join(',')}],axisLine:{lineStyle:{color:'${themeConfig.border}'}},splitLine:{lineStyle:{color:'${themeConfig.border}'}},axisName:{color:'${themeConfig.textSecondary}'}},
        series:[{type:'radar',data:[{value:[${values}],name:'数据'}]}]
      }`
    default:
      return '{}'
  }
}

/**
 * 生成表格 HTML
 */
function generateTableHtml(component) {
  const data = component.data?.source || [
    { region: '华东区', product: '电子产品', sales: 125000, count: 520 },
    { region: '华北区', product: '食品', sales: 89000, count: 380 },
    { region: '华南区', product: '电子产品', sales: 156000, count: 650 }
  ]

  const columns = component.props?.columns || [
    { key: 'region', title: '区域' },
    { key: 'product', title: '产品' },
    { key: 'sales', title: '销售额' },
    { key: 'count', title: '销量' }
  ]

  const headerHtml = columns.map(c => `<th style="padding:8px 12px;background:#0d192d;color:#4fc3f7;border:1px solid #1e3a5f;text-align:${c.align || 'left'}">${c.title}</th>`).join('')

  const rowsHtml = data.map((row, i) => {
    const bg = i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.03)'
    const cells = columns.map(c => {
      let val = row[c.key]
      if (c.formatter === 'currency') val = '¥' + Number(val).toLocaleString()
      return `<td style="padding:6px 12px;border:1px solid #1e3a5f;color:#e0e0e0;background:${bg};text-align:${c.align || 'left'}">${val ?? ''}</td>`
    }).join('')
    return `<tr>${cells}</tr>`
  }).join('')

  return `<table style="width:100%;border-collapse:collapse;font-size:13px">${columns.length > 0 ? `<thead><tr>${headerHtml}</tr></thead>` : ''}<tbody>${rowsHtml}</tbody></table>`
}

/**
 * 生成组件 HTML
 */
function generateComponentHtml(component, themes) {
  const titleHtml = component.props?.title
    ? `<div style="font-size:14px;font-weight:500;color:#fff;padding:4px 8px">${component.props.title}</div>`
    : ''

  const bgStyle = component.style?.background ? `background:${component.style.background};` : ''
  const borderStyle = component.style?.borderStyle && component.style.borderStyle !== 'none'
    ? `border:1px ${component.style.borderStyle} ${component.style.borderColor || '#1e3a5f'};`
    : ''
  const borderRadius = component.style?.borderRadius ? `border-radius:${component.style.borderRadius}px;` : ''
  const opacity = component.style?.opacity != null ? `opacity:${component.style.opacity};` : ''

  let content = ''

  switch (component.type) {
    case 'bar-chart':
    case 'line-chart':
    case 'pie-chart':
    case 'gauge-chart':
    case 'radar-chart':
      content = `${titleHtml}<div id="chart-${component.id}" style="flex:1;min-height:0"></div>`
      break
    case 'data-table':
      content = `${titleHtml}<div style="flex:1;min-height:0;overflow:auto;padding:4px">${generateTableHtml(component)}</div>`
      break
    case 'form-filter':
    case 'form-input':
    case 'form-select':
    case 'form-date':
      content = generateFormHtml(component)
      break
    case 'title':
      content = `<div style="width:100%;height:100%;display:flex;align-items:center;padding:0 16px;color:${component.props?.color || '#fff'};font-size:${component.props?.level === 1 ? '24px' : '16px'};font-weight:600;text-align:${component.props?.align || 'left'}">${component.props?.text || '标题'}</div>`
      break
    case 'subtitle':
      content = `<div style="width:100%;height:100%;display:flex;align-items:center;padding:0 16px;color:${component.props?.color || '#a0aec0'};font-size:14px;text-align:${component.props?.align || 'left'}">${component.props?.text || '副标题'}</div>`
      break
    case 'number':
      content = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#2080f0;font-size:32px;font-weight:700">${component.props?.prefix || ''}${component.props?.value || 0}${component.props?.suffix || ''}</div>`
      break
    case 'image':
      content = component.props?.src
        ? `<img src="${component.props.src}" style="width:100%;height:100%;object-fit:${component.props?.fit || 'contain'}" />`
        : '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#0d192d;color:#5a6a7a">图片</div>'
      break
    case 'divider':
      content = component.props?.direction === 'vertical'
        ? `<div style="width:1px;height:100%;background:${component.props?.color || '#1e3a5f'};margin:0 auto"></div>`
        : `<div style="width:100%;height:${component.props?.width || 1}px;background:${component.props?.color || '#1e3a5f'};margin:auto 0"></div>`
      break
    case 'card':
      content = `<div style="width:100%;height:100%;background:#0d192d;border:1px solid #1e3a5f;border-radius:4px;display:flex;flex-direction:column;overflow:hidden">${component.props?.title ? `<div style="padding:16px;font-size:14px;font-weight:500;color:#fff;border-bottom:1px solid #1e3a5f">${component.props.title}</div>` : ''}<div style="flex:1;padding:16px"></div></div>`
      break
    default:
      content = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#0d192d;color:#5a6a7a;font-size:12px">${component.type}</div>`
  }

  return `<div class="dashboard-component" style="position:absolute;left:${component.x}px;top:${component.y}px;width:${component.width}px;height:${component.height}px;z-index:${component.zIndex};display:flex;flex-direction:column;${bgStyle}${borderStyle}${borderRadius}${opacity}">${content}</div>`
}

/**
 * 生成表单 HTML
 */
function generateFormHtml(component) {
  const fields = component.props?.fields || [
    { key: 'date', type: 'daterange', label: '日期范围' },
    { key: 'category', type: 'select', label: '产品类别' }
  ]

  const fieldsHtml = fields.map(f => {
    let input = ''
    if (f.type === 'select') {
      const opts = (f.options || []).map(o => `<option value="${o.value}">${o.label}</option>`).join('')
      input = `<select style="padding:4px 8px;background:#0d192d;color:#e0e0e0;border:1px solid #1e3a5f;border-radius:4px;font-size:12px;min-width:140px"><option value="">${f.placeholder || '请选择'}</option>${opts}</select>`
    } else if (f.type === 'date' || f.type === 'daterange') {
      input = `<input type="date" style="padding:4px 8px;background:#0d192d;color:#e0e0e0;border:1px solid #1e3a5f;border-radius:4px;font-size:12px" />`
    } else {
      input = `<input type="text" placeholder="${f.placeholder || '请输入'}" style="padding:4px 8px;background:#0d192d;color:#e0e0e0;border:1px solid #1e3a5f;border-radius:4px;font-size:12px;min-width:140px" />`
    }
    return `<label style="display:flex;align-items:center;gap:8px;font-size:12px;color:#a0aec0">${f.label}${input}</label>`
  }).join('')

  return `<div style="width:100%;height:100%;display:flex;align-items:center;padding:4px 16px;gap:16px;flex-wrap:wrap">${fieldsHtml}<button style="padding:4px 12px;background:#2080f0;color:#fff;border:none;border-radius:4px;font-size:12px;cursor:pointer">查询</button></div>`
}

/**
 * 主导出函数
 */
export function exportToHtml(canvasConfig, components, themes) {
  const chartComponents = components.filter(c =>
    ['bar-chart', 'line-chart', 'pie-chart', 'gauge-chart', 'radar-chart'].includes(c.type)
  )

  const componentsHtml = components.map(c => generateComponentHtml(c, themes)).join('\n    ')

  // 生成 ECharts 初始化脚本
  const chartScripts = chartComponents.length > 0
    ? `<script src="https://cdn.jsdelivr.net/npm/echarts@5/dist/echarts.min.js"><\/script>
    <script>
      document.addEventListener('DOMContentLoaded', function() {
        ${chartComponents.map(c => `
        (function() {
          var el = document.getElementById('chart-${c.id}');
          if (!el) return;
          var chart = echarts.init(el);
          chart.setOption(${generateChartOption(c, themes)});
          window.addEventListener('resize', function() { chart.resize(); });
        })();`).join('\n        ')}
      });
    <\/script>`
    : ''

  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${canvasConfig.name || 'Dashboard'}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; overflow: hidden; background: ${canvasConfig.background || '#0a1929'}; }
    .dashboard-wrapper {
      width: 100%; height: 100%;
      display: flex; align-items: center; justify-content: center;
    }
    .dashboard-canvas {
      position: relative;
      width: ${canvasConfig.width}px;
      height: ${canvasConfig.height}px;
      transform-origin: center center;
    }
    @media (max-width: 1px) { .dashboard-canvas { transform: scale(0.1); } }
  </style>
  <script>
    // 自适应缩放
    function fitDashboard() {
      var canvas = document.querySelector('.dashboard-canvas');
      if (!canvas) return;
      var cw = ${canvasConfig.width};
      var ch = ${canvasConfig.height};
      var scale = Math.min(window.innerWidth / cw, window.innerHeight / ch, 1);
      canvas.style.transform = 'scale(' + scale + ')';
    }
    window.addEventListener('resize', fitDashboard);
    document.addEventListener('DOMContentLoaded', fitDashboard);
  <\/script>
</head>
<body>
  <div class="dashboard-wrapper">
    <div class="dashboard-canvas">
    ${componentsHtml}
    </div>
  </div>
  ${chartScripts}
</body>
</html>`

  return html
}

/**
 * 下载 HTML 文件
 */
export function downloadHtml(html, filename = 'dashboard.html') {
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
