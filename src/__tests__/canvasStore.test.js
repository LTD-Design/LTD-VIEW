import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCanvasStore } from '@/stores/canvas'

describe('canvasStore', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('初始化状态正确', () => {
    const store = useCanvasStore()
    expect(store.components).toEqual([])
    expect(store.selectedId).toBeNull()
    expect(store.selectedIds).toEqual([])
    expect(store.canUndo).toBe(false)
    expect(store.canRedo).toBe(false)
  })

  it('addComponent 添加组件', () => {
    const store = useCanvasStore()
    const comp = store.addComponent({
      type: 'bar-chart',
      x: 100,
      y: 100,
      width: 400,
      height: 300,
      props: { title: '测试图表' }
    })

    expect(store.components).toHaveLength(1)
    expect(comp.type).toBe('bar-chart')
    expect(comp.x).toBe(100)
    expect(comp.id).toBeDefined()
    expect(store.selectedId).toBe(comp.id)
  })

  it('selectComponent 选中组件', () => {
    const store = useCanvasStore()
    const comp = store.addComponent({ type: 'bar-chart' })

    store.selectComponent(comp.id)
    expect(store.selectedId).toBe(comp.id)
    expect(store.selectedIds).toContain(comp.id)
  })

  it('clearSelection 清除选择', () => {
    const store = useCanvasStore()
    const comp = store.addComponent({ type: 'bar-chart' })
    store.selectComponent(comp.id)

    store.clearSelection()
    expect(store.selectedId).toBeNull()
    expect(store.selectedIds).toEqual([])
  })

  it('removeComponent 删除组件', () => {
    const store = useCanvasStore()
    const comp = store.addComponent({ type: 'bar-chart' })
    expect(store.components).toHaveLength(1)

    store.removeComponent(comp.id)
    expect(store.components).toHaveLength(0)
    expect(store.selectedId).toBeNull()
  })

  it('updateComponent 更新组件', () => {
    const store = useCanvasStore()
    const comp = store.addComponent({ type: 'bar-chart', x: 100, y: 100 })

    store.updateComponent(comp.id, { x: 200, y: 200 })
    expect(store.components[0].x).toBe(200)
    expect(store.components[0].y).toBe(200)
  })

  it('updateComponentProps 更新组件属性', () => {
    const store = useCanvasStore()
    const comp = store.addComponent({ type: 'bar-chart', props: { title: '旧标题' } })

    store.updateComponentProps(comp.id, { title: '新标题' })
    expect(store.components[0].props.title).toBe('新标题')
  })

  it('撤销/重做功能', () => {
    const store = useCanvasStore()
    const comp = store.addComponent({ type: 'bar-chart' })

    expect(store.canUndo).toBe(true)
    expect(store.canRedo).toBe(false)

    store.undo()
    expect(store.components).toHaveLength(0)
    expect(store.canUndo).toBe(false)
    expect(store.canRedo).toBe(true)

    store.redo()
    expect(store.components).toHaveLength(1)
  })

  it('updateCanvasSize 更新画布尺寸', () => {
    const store = useCanvasStore()
    store.updateCanvasSize(2560, 1440)

    expect(store.canvasConfig.width).toBe(2560)
    expect(store.canvasConfig.height).toBe(1440)
  })

  it('clearCanvas 清空画布', () => {
    const store = useCanvasStore()
    store.addComponent({ type: 'bar-chart' })
    store.addComponent({ type: 'line-chart' })
    expect(store.components).toHaveLength(2)

    store.clearCanvas()
    expect(store.components).toHaveLength(0)
    expect(store.selectedId).toBeNull()
  })

  it('toggleSelect 多选', () => {
    const store = useCanvasStore()
    const comp1 = store.addComponent({ type: 'bar-chart' })
    const comp2 = store.addComponent({ type: 'line-chart' })

    store.clearSelection()
    store.toggleSelect(comp1.id)
    expect(store.selectedIds).toContain(comp1.id)

    store.toggleSelect(comp2.id)
    expect(store.selectedIds).toContain(comp2.id)
    expect(store.selectedIds).toHaveLength(2)
  })

  it('componentCount getter', () => {
    const store = useCanvasStore()
    expect(store.componentCount).toBe(0)

    store.addComponent({ type: 'bar-chart' })
    expect(store.componentCount).toBe(1)
  })

  it('exportConfig 导出配置', () => {
    const store = useCanvasStore()
    store.addComponent({ type: 'bar-chart' })

    const config = store.exportConfig()
    expect(config.name).toBeDefined()
    expect(config.width).toBe(1920)
    expect(config.components).toHaveLength(1)
  })
})
