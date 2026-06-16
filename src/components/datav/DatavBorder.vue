<template>
  <div class="datav-border-wrapper" style="width: 100%; height: 100%">
    <BorderBox1 v-if="type === 'border-1'" :color="color" :background-color="backgroundColor" />
    <BorderBox2
      v-else-if="type === 'border-2'"
      :color="color"
      :background-color="backgroundColor"
    />
    <BorderBox3
      v-else-if="type === 'border-3'"
      :color="color"
      :background-color="backgroundColor"
    />
    <BorderBox4
      v-else-if="type === 'border-4'"
      :color="color"
      :background-color="backgroundColor"
    />
    <BorderBox5
      v-else-if="type === 'border-5'"
      :color="color"
      :background-color="backgroundColor"
    />
    <BorderBox6
      v-else-if="type === 'border-6'"
      :color="color"
      :background-color="backgroundColor"
    />
    <BorderBox7
      v-else-if="type === 'border-7'"
      :color="color"
      :background-color="backgroundColor"
    />
    <BorderBox8
      v-else-if="type === 'border-8'"
      :color="color"
      :background-color="backgroundColor"
    />
    <BorderBox9
      v-else-if="type === 'border-9'"
      :color="color"
      :background-color="backgroundColor"
    />
    <BorderBox10
      v-else-if="type === 'border-10'"
      :color="color"
      :background-color="backgroundColor"
    />
    <BorderBox11
      v-else-if="type === 'border-11'"
      :color="color"
      :background-color="backgroundColor"
    />
    <BorderBox12
      v-else-if="type === 'border-12'"
      :color="color"
      :background-color="backgroundColor"
    />
    <BorderBox13
      v-else-if="type === 'border-13'"
      :color="color"
      :background-color="backgroundColor"
    />
    <BorderBox1 v-else :color="color" :background-color="backgroundColor" />
  </div>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'border-1'
  },
  color: {
    type: String,
    default: '#2080f0'
  },
  backgroundColor: {
    type: String,
    default: 'transparent'
  }
})
</script>
