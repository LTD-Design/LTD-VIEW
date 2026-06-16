/**
 * 导出独立 HTML 文件
 * 生成一个自包含的 HTML 文件，可离线展示仪表盘
 */
import {
  COLOR_PRIMARY,
  COLOR_SUCCESS,
  COLOR_ERROR,
  BG_CARD,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  TEXT_MUTED,
  BORDER_COLOR,
  BORDER_RADIUS
} from '@/config/colors'

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
  const colors = themes.chartColors?.[themeName] ||
    themes.chartColors?.dark || ['#2080f0', '#18a058', '#f0a020']
  const themeConfig = themes.themes?.[themeName] ||
    themes.themes?.dark || { border: '#1e3a5f', textSecondary: '#a0aec0' }

  const names = data
    .map((d) => d.name || '')
    .map((n) => `'${n}'`)
    .join(',')
  const values = data.map((d) => d.value || 0).join(',')

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
        series:[{type:'pie',radius:['40%','70%'],data:[${data.map((d) => `{name:'${d.name}',value:${d.value}}`).join(',')}],label:{color:'${themeConfig.textSecondary}'}}]
      }`
    case 'gauge-chart':
      return `{
        series:[{type:'gauge',min:${component.props?.min || 0},max:${component.props?.max || 100},data:[{value:${data[0]?.value || 50}}],axisLine:{lineStyle:{width:10,color:[[0.3,'#18a058'],[0.7,'#f0a020'],[1,'#d03050']]}},pointer:{width:4}}]
      }`
    case 'radar-chart':
      return `{
        color:${JSON.stringify(colors)},
        radar:{indicator:[${data.map((d) => `{name:'${d.name}',max:100}`).join(',')}],axisLine:{lineStyle:{color:'${themeConfig.border}'}},splitLine:{lineStyle:{color:'${themeConfig.border}'}},axisName:{color:'${themeConfig.textSecondary}'}},
        series:[{type:'radar',data:[{value:[${values}],name:'数据'}]}]
      }`
    case 'scatter-chart':
      return `{
        color:${JSON.stringify(colors)},
        tooltip:{trigger:'item'},
        xAxis:{type:'value',${axisStyle},splitLine:{lineStyle:{color:'${themeConfig.border}'}}},
        yAxis:{type:'value',${axisStyle},splitLine:{lineStyle:{color:'${themeConfig.border}'}}},
        series:[{type:'scatter',data:[${data.map((d) => `[${d.name},${d.value}]`).join(',')}],symbolSize:${component.props?.symbolSize || 12}}],
        grid:{left:50,right:20,top:30,bottom:30}
      }`
    case 'funnel-chart':
      return `{
        color:${JSON.stringify(colors)},
        tooltip:{trigger:'item'},
        series:[{type:'funnel',left:20,top:30,bottom:20,width:'80%',sort:'${component.props?.sort || 'descending'}',gap:${component.props?.gap ?? 2},data:[${data.map((d) => `{name:'${d.name}',value:${d.value}}`).join(',')}]}]
      }`
    case 'heatmap-chart':
      return `{
        tooltip:{trigger:'item'},
        visualMap:{min:${Math.min(...data.map((d) => d.value))},max:${Math.max(...data.map((d) => d.value))},calculable:true,inRange:{color:['#2080f0','#18a058','#f0a020','#d03050']}},
        xAxis:{type:'category',data:[${[...new Set(data.map((d) => d.x || d.name))].map((n) => `'${n}'`).join(',')}],${axisStyle}},
        yAxis:{type:'category',data:[${[...new Set(data.map((d) => d.y || ''))].map((n) => `'${n}'`).join(',')}],${axisStyle}},
        series:[{type:'heatmap',data:[${data.map((d) => `['${d.x || d.name}','${d.y || ''}',${d.value}]`).join(',')}]}],
        grid:{left:60,right:40,top:30,bottom:30}
      }`
    case 'treemap-chart':
      return `{
        color:${JSON.stringify(colors)},
        series:[{type:'treemap',roam:false,breadcrumb:{show:true},label:{show:true,color:'${themeConfig.text}',fontSize:12},data:[${data.map((d) => `{name:'${d.name}',value:${d.value}}`).join(',')}]}]
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

  const headerHtml = columns
    .map(
      (c) =>
        `<th style="padding:8px 12px;background:${BG_CARD};color:#4fc3f7;border:1px solid ${BORDER_COLOR};text-align:${c.align || 'left'}">${c.title}</th>`
    )
    .join('')

  const rowsHtml = data
    .map((row, i) => {
      const bg = i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.03)'
      const cells = columns
        .map((c) => {
          let val = row[c.key]
          if (c.formatter === 'currency') val = '¥' + Number(val).toLocaleString()
          return `<td style="padding:6px 12px;border:1px solid ${BORDER_COLOR};color:#e0e0e0;background:${bg};text-align:${c.align || 'left'}">${val ?? ''}</td>`
        })
        .join('')
      return `<tr>${cells}</tr>`
    })
    .join('')

  return `<table style="width:100%;border-collapse:collapse;font-size:13px">${columns.length > 0 ? `<thead><tr>${headerHtml}</tr></thead>` : ''}<tbody>${rowsHtml}</tbody></table>`
}

/**
 * 生成组件 HTML
 */
function generateComponentHtml(component, themes) {
  const titleHtml = component.props?.title
    ? `<div style="font-size:14px;font-weight:500;color:${TEXT_PRIMARY};padding:4px 8px">${component.props.title}</div>`
    : ''

  const bgStyle = component.style?.background ? `background:${component.style.background};` : ''
  const borderStyle =
    component.style?.borderStyle && component.style.borderStyle !== 'none'
      ? `border:1px ${component.style.borderStyle} ${component.style.borderColor || BORDER_COLOR};`
      : ''
  const borderRadius = component.style?.borderRadius
    ? `border-radius:${component.style.borderRadius}px;`
    : ''
  const opacity = component.style?.opacity != null ? `opacity:${component.style.opacity};` : ''

  let content = ''

  switch (component.type) {
    case 'bar-chart':
    case 'line-chart':
    case 'pie-chart':
    case 'gauge-chart':
    case 'radar-chart':
    case 'scatter-chart':
    case 'funnel-chart':
    case 'heatmap-chart':
    case 'treemap-chart':
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
      content = `<div style="width:100%;height:100%;display:flex;align-items:center;padding:0 16px;color:${component.props?.color || TEXT_PRIMARY};font-size:${component.props?.level === 1 ? '24px' : '16px'};font-weight:600;text-align:${component.props?.align || 'left'}">${component.props?.text || '标题'}</div>`
      break
    case 'subtitle':
      content = `<div style="width:100%;height:100%;display:flex;align-items:center;padding:0 16px;color:${component.props?.color || TEXT_SECONDARY};font-size:14px;text-align:${component.props?.align || 'left'}">${component.props?.text || '副标题'}</div>`
      break
    case 'number':
      content = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:${COLOR_PRIMARY};font-size:32px;font-weight:700">${component.props?.prefix || ''}${component.props?.value || 0}${component.props?.suffix || ''}</div>`
      break
    case 'kpi-card':
      content = `<div style="width:100%;height:100%;display:flex;flex-direction:column;justify-content:center;padding:16px"><div style="display:flex;align-items:center;gap:8px;margin-bottom:8px"><div style="width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;background:${component.props?.color || '#18a058'}20;color:${component.props?.color || '#18a058'}">&#8593;</div><span style="font-size:13px;color:${TEXT_SECONDARY}">${component.props?.label || '指标'}</span></div><div style="font-size:28px;font-weight:700;color:${TEXT_PRIMARY}">${component.props?.prefix || ''}${component.props?.value || 0}${component.props?.suffix || ''}</div>${component.props?.trendValue ? `<div style="font-size:12px;color:${component.props?.trend === 'up' ? COLOR_SUCCESS : COLOR_ERROR};margin-top:4px">${component.props.trendValue}</div>` : ''}</div>`
      break
    case 'progress-bar':
      content = `<div style="width:100%;height:100%;display:flex;align-items:center;padding:4px 16px;gap:8px"><div style="flex:1;height:${component.props?.height || 8}px;background:${component.props?.trackColor || '#1e3a5f'};border-radius:${(component.props?.height || 8) / 2}px;overflow:hidden"><div style="height:100%;width:${Math.min(100, ((component.props?.value || 0) / (component.props?.max || 100)) * 100)}%;background:${component.props?.color || '#2080f0'};border-radius:inherit"></div></div>${component.props?.showLabel !== false ? `<span style="font-size:12px;color:${TEXT_SECONDARY};white-space:nowrap">${component.props?.value || 0}%</span>` : ''}</div>`
      break
    case 'video':
      content = component.props?.src
        ? `<video src="${component.props.src}"${component.props.autoplay ? ' autoplay' : ''}${component.props.loop ? ' loop' : ''}${component.props.muted ? ' muted' : ''}${component.props.controls !== false ? ' controls' : ''} style="width:100%;height:100%;object-fit:${component.props?.fit || 'contain'}"></video>`
        : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:${BG_CARD};color:${TEXT_MUTED}">视频</div>`
      break
    case 'rank-list':
      content = generateRankListHtml(component)
      break
    case 'image':
      content = component.props?.src
        ? `<img src="${component.props.src}" style="width:100%;height:100%;object-fit:${component.props?.fit || 'contain'}" />`
        : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:${BG_CARD};color:${TEXT_MUTED}">图片</div>`
      break
    case 'divider':
      content =
        component.props?.direction === 'vertical'
          ? `<div style="width:1px;height:100%;background:${component.props?.color || BORDER_COLOR};margin:0 auto"></div>`
          : `<div style="width:100%;height:${component.props?.width || 1}px;background:${component.props?.color || BORDER_COLOR};margin:auto 0"></div>`
      break
    case 'card':
      content = `<div style="width:100%;height:100%;background:${BG_CARD};border:1px solid ${BORDER_COLOR};border-radius:${BORDER_RADIUS}px;display:flex;flex-direction:column;overflow:hidden">${component.props?.title ? `<div style="padding:16px;font-size:14px;font-weight:500;color:${TEXT_PRIMARY};border-bottom:1px solid ${BORDER_COLOR}">${component.props.title}</div>` : ''}<div style="flex:1;padding:16px"></div></div>`
      break
    case 'tab-container': {
      const tabs = component.props?.tabs || [{ label: '标签 1' }, { label: '标签 2' }]
      const tabBtns = tabs
        .map(
          (t, i) =>
            `<div style="padding:8px 16px;font-size:13px;color:${i === 0 ? '#2080f0' : '#a0aec0'};border-bottom:2px solid ${i === 0 ? '#2080f0' : 'transparent'};cursor:pointer">${t.label}</div>`
        )
        .join('')
      content = `<div style="width:100%;height:100%;display:flex;flex-direction:column;overflow:hidden"><div style="display:flex;gap:2px;padding:0 8px;background:rgba(0,0,0,0.2);border-bottom:1px solid ${BORDER_COLOR};flex-shrink:0">${tabBtns}</div><div style="flex:1;padding:16px;overflow:auto"></div></div>`
      break
    }
    case 'marquee':
      content = `<div style="width:100%;height:100%;overflow:hidden;display:flex;align-items:center"><div style="display:inline-flex;white-space:nowrap;animation:marquee-scroll ${10 / (component.props?.speed || 3)}s linear infinite"><span style="color:${component.props?.color || '#ffffff'};font-size:${component.props?.fontSize || 16}px;font-weight:${component.props?.fontWeight || '400'};padding-right:60px">${component.props?.text || '滚动文字'}</span><span style="color:${component.props?.color || '#ffffff'};font-size:${component.props?.fontSize || 16}px;font-weight:${component.props?.fontWeight || '400'};padding-right:60px">${component.props?.text || '滚动文字'}</span></div></div>`
      break
    case 'datav-border':
      content = `<div style="width:100%;height:100%;border:2px solid ${component.props?.color || '#2080f0'};border-radius:4px;position:relative"><div style="position:absolute;top:0;left:0;width:100%;height:100%;border:1px solid ${component.props?.color || '#2080f0'};opacity:0.3;border-radius:2px"></div></div>`
      break
    case 'datav-decoration':
      content = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center"><div style="width:60%;height:2px;background:linear-gradient(90deg,transparent,${component.props?.color?.[0] || '#2080f0'},transparent)"></div></div>`
      break
    case 'datav-scroll-board': {
      const sbHeader = component.props?.header || ['名称', '数值']
      const sbData = component.props?.data || []
      const sbHeaderHtml = sbHeader
        .map(
          (h) =>
            `<th style="padding:6px 12px;background:${component.props?.headerBGC || '#1e3a5f'};color:${component.props?.headerColor || '#4fc3f7'};font-size:12px;border-bottom:1px solid ${BORDER_COLOR}">${h}</th>`
        )
        .join('')
      const sbRowsHtml = sbData
        .map((row, i) => {
          const bg = i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.03)'
          return `<tr>${row.map((cell) => `<td style="padding:6px 12px;color:#e0e0e0;background:${bg};font-size:12px;border-bottom:1px solid ${BORDER_COLOR}">${cell}</td>`).join('')}</tr>`
        })
        .join('')
      content = `<div style="width:100%;height:100%;overflow:hidden"><table style="width:100%;border-collapse:collapse"><thead><tr>${sbHeaderHtml}</tr></thead><tbody>${sbRowsHtml}</tbody></table></div>`
      break
    }
    case 'datav-digital-flop':
      content = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#2080f0;font-size:${component.props?.fontSize || 32}px;font-weight:700;font-family:monospace">${component.props?.value || 0}</div>`
      break
    case 'datav-water-ball':
      content = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center"><div style="width:80%;height:80%;border-radius:50%;border:2px solid #2080f0;position:relative;overflow:hidden"><div style="position:absolute;bottom:0;left:0;width:100%;height:${component.props?.percent || 50}%;background:linear-gradient(180deg,rgba(32,128,240,0.3),rgba(32,128,240,0.6));transition:height 0.5s"></div><div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:#fff;font-size:16px;font-weight:700">${component.props?.percent || 50}%</div></div></div>`
      break
    case 'datav-loading':
      content = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center"><div style="width:${component.props?.size || 60}px;height:${component.props?.size || 60}px;border:3px solid #1e3a5f;border-top-color:#2080f0;border-radius:50%;animation:datav-spin 1s linear infinite"></div></div>`
      break
    default:
      content = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:${BG_CARD};color:${TEXT_MUTED};font-size:12px">${component.type}</div>`
  }

  return `<div class="dashboard-component" style="position:absolute;left:${component.x}px;top:${component.y}px;width:${component.width}px;height:${component.height}px;z-index:${component.zIndex};display:flex;flex-direction:column;${bgStyle}${borderStyle}${borderRadius}${opacity}">${content}</div>`
}

/**
 * 生成排名列表 HTML
 */
function generateRankListHtml(component) {
  const titleHtml = component.props?.title
    ? `<div style="font-size:14px;font-weight:500;color:${TEXT_PRIMARY};padding:4px 8px">${component.props.title}</div>`
    : ''
  const data = component.data?.source || []
  const sorted = [...data].sort((a, b) => (b.value || 0) - (a.value || 0))
  const max = sorted.length > 0 ? Math.max(...sorted.map((d) => d.value || 0)) : 1

  const rankColors = ['#f0a020', '#a0aec0', '#cd7f32', '#2080f0']
  const items = sorted
    .map((d, i) => {
      const pct = Math.max(5, (d.value / max) * 100)
      const color = rankColors[i] || rankColors[3]
      return `<div style="display:flex;align-items:center;gap:8px;padding:4px 0"><span style="width:22px;height:22px;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;background:${color}20;color:${color}">${i + 1}</span><span style="font-size:13px;color:${TEXT_SECONDARY};min-width:60px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${d.name}</span><div style="flex:1;height:6px;background:${BG_CARD};border-radius:3px;overflow:hidden"><div style="height:100%;width:${pct}%;background:${color};border-radius:3px"></div></div><span style="font-size:12px;color:${TEXT_PRIMARY};font-weight:500;min-width:40px;text-align:right">${d.value}</span></div>`
    })
    .join('')

  return `${titleHtml}<div style="flex:1;padding:4px 8px;overflow:hidden">${items}</div>`
}

/**
 * 生成表单 HTML
 */
function generateFormHtml(component) {
  const fields = component.props?.fields || [
    { key: 'date', type: 'daterange', label: '日期范围' },
    { key: 'category', type: 'select', label: '产品类别' }
  ]

  const fieldsHtml = fields
    .map((f) => {
      let input = ''
      if (f.type === 'select') {
        const opts = (f.options || [])
          .map((o) => `<option value="${o.value}">${o.label}</option>`)
          .join('')
        input = `<select style="padding:4px 8px;background:${BG_CARD};color:#e0e0e0;border:1px solid ${BORDER_COLOR};border-radius:${BORDER_RADIUS}px;font-size:12px;min-width:140px"><option value="">${f.placeholder || '请选择'}</option>${opts}</select>`
      } else if (f.type === 'date' || f.type === 'daterange') {
        input = `<input type="date" style="padding:4px 8px;background:${BG_CARD};color:#e0e0e0;border:1px solid ${BORDER_COLOR};border-radius:${BORDER_RADIUS}px;font-size:12px" />`
      } else {
        input = `<input type="text" placeholder="${f.placeholder || '请输入'}" style="padding:4px 8px;background:${BG_CARD};color:#e0e0e0;border:1px solid ${BORDER_COLOR};border-radius:${BORDER_RADIUS}px;font-size:12px;min-width:140px" />`
      }
      return `<label style="display:flex;align-items:center;gap:8px;font-size:12px;color:${TEXT_SECONDARY}">${f.label}${input}</label>`
    })
    .join('')

  return `<div style="width:100%;height:100%;display:flex;align-items:center;padding:4px 16px;gap:16px;flex-wrap:wrap">${fieldsHtml}<button style="padding:4px 12px;background:${COLOR_PRIMARY};color:${TEXT_PRIMARY};border:none;border-radius:${BORDER_RADIUS}px;font-size:12px;cursor:pointer">查询</button></div>`
}

/**
 * 主导出函数
 */
export function exportToHtml(canvasConfig, components, themes) {
  const chartComponents = components.filter((c) =>
    [
      'bar-chart',
      'line-chart',
      'pie-chart',
      'gauge-chart',
      'radar-chart',
      'scatter-chart',
      'funnel-chart',
      'heatmap-chart',
      'treemap-chart'
    ].includes(c.type)
  )

  const componentsHtml = components.map((c) => generateComponentHtml(c, themes)).join('\n    ')

  // 生成 ECharts 初始化脚本
  const chartScripts =
    chartComponents.length > 0
      ? `<script src="https://cdn.jsdelivr.net/npm/echarts@5/dist/echarts.min.js"><` +
        `/script>
    <script>
      document.addEventListener('DOMContentLoaded', function() {
        ${chartComponents
          .map(
            (c) => `
        (function() {
          var el = document.getElementById('chart-${c.id}');
          if (!el) return;
          var chart = echarts.init(el);
          chart.setOption(${generateChartOption(c, themes)});
          window.addEventListener('resize', function() { chart.resize(); });
        })();`
          )
          .join('\n        ')}
      });
    <` +
        `/script>`
      : ''

  const html =
    `<!DOCTYPE html>
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
    @keyframes marquee-scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
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
  <` +
    `/script>
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
