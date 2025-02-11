<script setup lang="ts">
import { PropType } from 'vue';

const emits = defineEmits(['update:modelValue']);

const props = defineProps({
  modelValue: {
    type: [String, Number],
    required: true
  },
  data: {
    type: Array as PropType<Record<string, string | number>[]>,
    required: true
  },
  settings: {
    type: Object,
    default: () => ({ value: 'id', display: 'name' })
  },
  label: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  }
});

function getDisplayValue(d: Record<string, string | number>): string | number {
  return typeof d === 'object' ? d[props.settings.display] : d;
}

function getValue(d: Record<string, string | number>): string | number {
  return typeof d === 'object' ? d[props.settings.value] : d;
}

function handleChange(event: Event): void {
  const value = (event.target as HTMLSelectElement).value;
  const isNumber: boolean = typeof getValue(props.data[0]) === 'number';

  emits('update:modelValue', isNumber ? +value : value);
}

function isSelected(d: Record<string, string | number>): boolean {
  return getValue(d) === props.modelValue;
}
</script>

<template>
  <div class="input">
    <label :for="name">{{ label }}</label>
    <select :id="name" :name :value="modelValue" @input="handleChange">
      <option v-for="d of data" :key="getValue(d)" :value="getValue(d)" :selected="isSelected(d)">
        {{ getDisplayValue(d) }}
      </option>
    </select>
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

select {
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 4px 8px;
}
</style>
