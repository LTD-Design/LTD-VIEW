import { useMessage } from 'naive-ui'
import { exportToHtml, downloadHtml } from '@/utils/exportHtml'
import { themes, chartColors } from '@/config/themes'

export function useExportDashboard(canvasStore) {
  const message = useMessage()

  const exportJson = () => {
    const config = canvasStore.exportConfig()
    const json = JSON.stringify(config, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${config.name || 'dashboard'}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    message.success('JSON 配置已导出')
  }

  const exportHtmlFile = () => {
    const config = canvasStore.exportConfig()
    const html = exportToHtml(config, canvasStore.components, { themes, chartColors })
    downloadHtml(html, `${config.name || 'dashboard'}.html`)
    message.success('HTML 文件已导出')
  }

  const importJson = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = async (e) => {
      const file = e.target.files[0]
      if (!file) return

      try {
        const text = await file.text()
        const config = JSON.parse(text)
        canvasStore.importConfig(config)
        message.success('配置已导入')
      } catch {
        message.error('配置文件格式错误')
      }
    }
    input.click()
  }

  return { exportJson, exportHtmlFile, importJson }
}
