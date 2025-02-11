<script setup lang="ts">
import { PropType, ref } from 'vue';
import Input from './Input.vue';

export interface ForestParams {
  width: number;
  height: number;
}

const emits = defineEmits(['start', 'stop']);

defineProps({
  interval: {
    type: Number as PropType<number | NodeJS.Timeout | null>,
    default: null
  },
  step: {
    type: Number,
    required: true
  }
});

const params = ref<ForestParams>({
  width: 20,
  height: 20
});
</script>

<template>
  <div class="inline">
    <div class="form">
      <Input v-model="params.width" label="Largeur" type="number" name="width" :min="5" />
      <Input v-model="params.height" label="Longueur" type="number" name="height" :min="5" />
    </div>

    <button @click="interval ? emits('stop') : emits('start', params)">
      {{ interval ? 'Stop' : step > 0 ? 'Restart' : 'Start' }} Simulation
    </button>
  </div>
</template>

<style scoped>
.inline {
  height: 100vh;
  width: 240px;
  padding: 12px;
  background-color: #0a0a0a;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 24px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

button {
  width: 100%;
  background-color: #f4f4f4;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  padding: 6px 12px;
}

.add-road {
  display: flex;
  flex-direction: column;
  gap: 4px;
  background-color: #262626;
  padding: 8px;
  border-radius: 4px;
}
</style>
