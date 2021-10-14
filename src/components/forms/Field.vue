<template>
  <div class="field">
    <input
      class="input"
      :class="{ 'input-error': error }"
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    >
    <div class="error-text" v-if="error">{{error}}</div>
  </div>
</template>
<script>
export default {
  emit: ['update:modelValue'],
  props: {
    modelValue: String,
    type: String,
    placeholder: String,
    autocomplete: String,
    error: String
  }
}
</script>

