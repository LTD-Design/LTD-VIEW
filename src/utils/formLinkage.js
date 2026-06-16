/**
 * 表单联动工具模块
 * 处理表单字段值变化时对其他组件的联动影响
 */

/**
 * 根据表单值变化触发目标组件的数据刷新
 */
export function triggerLinkageTargets(canvasStore, dataStore, linkageConfig, fieldValues) {
  if (!linkageConfig?.targets?.length) return

  linkageConfig.targets.forEach((targetId) => {
    const target = canvasStore.components.find((c) => c.id === targetId)
    if (target) {
      // 传递筛选参数给目标组件
      canvasStore.updateComponentProps(targetId, {
        filterParams: { ...fieldValues }
      })
    }
  })
}

/**
 * 计算表单字段的显隐状态
 * 根据 dependOn 配置决定字段是否可见
 */
export function computeFieldVisibility(field, allValues) {
  if (!field.dependOn || field.dependOn.length === 0) return true

  return field.dependOn.every((depKey) => {
    const depValue = allValues[depKey]
    // 依赖字段有值时才显示
    return depValue !== null && depValue !== undefined && depValue !== ''
  })
}

/**
 * 根据当前字段值更新级联选项
 */
export function updateCascadeOptions(field, allValues, cascadeMap = {}) {
  if (!field.cascadeFrom) return field.options || []

  const parentValue = allValues[field.cascadeFrom]
  if (!parentValue) return []

  return cascadeMap[parentValue] || []
}
