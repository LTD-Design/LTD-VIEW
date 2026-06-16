<template>
  <div class="component-properties">
    <component :is="configComponent" v-if="configComponent" :component="component" />
    <div v-else class="no-config-hint">该组件暂无专属配置</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { COMPONENT_CATEGORIES, componentRegistry } from '@/config/components'
import ChartComponentConfig from './config/ChartComponentConfig.vue'
import TableComponentConfig from './config/TableComponentConfig.vue'
import FormComponentConfig from './config/FormComponentConfig.vue'
import TextComponentConfig from './config/TextComponentConfig.vue'
import MediaComponentConfig from './config/MediaComponentConfig.vue'
import ContainerComponentConfig from './config/ContainerComponentConfig.vue'
import DecoratorComponentConfig from './config/DecoratorComponentConfig.vue'

const props = defineProps({
  component: {
    type: Object,
    required: true
  }
})

const category = computed(() => {
  const meta = componentRegistry.find((c) => c.type === props.component.type)
  return meta?.category || ''
})

const configComponent = computed(() => {
  switch (category.value) {
    case COMPONENT_CATEGORIES.CHART:
      return ChartComponentConfig
    case COMPONENT_CATEGORIES.TABLE:
      return TableComponentConfig
    case COMPONENT_CATEGORIES.FORM:
      return FormComponentConfig
    case COMPONENT_CATEGORIES.TEXT:
      return TextComponentConfig
    case COMPONENT_CATEGORIES.MEDIA:
      return MediaComponentConfig
    case COMPONENT_CATEGORIES.CONTAINER:
      return ContainerComponentConfig
    case COMPONENT_CATEGORIES.DECORATOR:
      return DecoratorComponentConfig
    default:
      return null
  }
})
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.no-config-hint {
  color: $text-muted;
  text-align: center;
  padding: 40px 20px;
  font-size: $font-size-sm;
}
</style>
