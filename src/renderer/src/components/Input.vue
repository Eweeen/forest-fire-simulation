<script setup lang="ts">
import { PropType } from 'vue';

const emits = defineEmits(['update:modelValue']);

const props = defineProps({
  modelValue: {
    type: [String, Number],
    required: true
  },
  label: {
    type: String,
    required: true
  },
  type: {
    type: String as PropType<'text' | 'number'>,
    default: 'text'
  },
  name: {
    type: String,
    required: true
  },
  min: {
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    default: 50
  }
});

function handleChange(event: Event): void {
  const value = (event.target as HTMLInputElement).value;

  emits('update:modelValue', props.type === 'number' ? +value : value);
}
</script>

<template>
  <div class="input">
    <label :for="name">{{ label }}</label>
    <input :id="name" :name :type :value="modelValue" :min :max @input="handleChange" />
  </div>
</template>

<style scoped>
.input {
  display: flex;
  flex-direction: column;
}

label {
  font-size: 14px;
}

input {
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 4px 8px;
}
</style>
