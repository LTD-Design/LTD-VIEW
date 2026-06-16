import * as echarts from 'echarts/core'
import {
  BarChart,
  LineChart,
  PieChart,
  GaugeChart,
  RadarChart,
  ScatterChart,
  HeatmapChart,
  TreemapChart,
  FunnelChart
} from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  RadarComponent,
  VisualMapComponent,
  CalendarComponent,
  ToolboxComponent
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([
  BarChart,
  LineChart,
  PieChart,
  GaugeChart,
  RadarChart,
  ScatterChart,
  HeatmapChart,
  TreemapChart,
  FunnelChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  RadarComponent,
  VisualMapComponent,
  CalendarComponent,
  ToolboxComponent,
  CanvasRenderer
])

export default echarts
