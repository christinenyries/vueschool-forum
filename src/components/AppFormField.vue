<template>
  <div class="form-group">
    <label :for="name">{{ label }}</label>
    <VeeField
      :name="name"
      :label="label"
      :modelValue="modelValue"
      @input="$emit('modelUpdate', $event)"
      id="name"
      class="form-input"
      v-bind="$attrs"
    />
    <VeeErrorMessage :name="name" class="form-error" />
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    modelValue: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      default: "",
    },
  },
};
</script>
