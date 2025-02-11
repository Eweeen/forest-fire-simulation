<script setup lang="ts">
import { PropType, ref } from 'vue';
import Input from './Input.vue';
import Select from './Select.vue';

export interface ForestParams {
  width: number;
  height: number;
  terrainType: 'continue' | 'closely-spaced' | 'spaced' | 'sparse';
  humidity: 'wet' | 'normal' | 'dry' | 'very_dry';
  windStrength: 0 | 1 | 2 | 3;
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
  height: 20,
  terrainType: 'continue',
  humidity: 'normal',
  windStrength: 1
});

const terrainType = [
  { id: 'continue', name: 'Continue (100%)' },
  { id: 'closely-spaced', name: 'Peu espacée (95%)' },
  { id: 'spaced', name: 'Espacée (80%)' },
  { id: 'sparse', name: 'Clairsemée (50%)' }
];

const humidity = [
  { id: 'wet', name: 'Humide' },
  { id: 'normal', name: 'Normal' },
  { id: 'dry', name: 'Sec' },
  { id: 'very_dry', name: 'Très sec' }
];

const windStrength = [
  { id: 0, name: '0' },
  { id: 1, name: '1' },
  { id: 2, name: '2' },
  { id: 3, name: '3' }
];
</script>

<template>
  <div class="inline">
    <div class="form">
      <Input v-model="params.width" label="Largeur" type="number" name="width" :min="5" />
      <Input v-model="params.height" label="Longueur" type="number" name="height" :min="5" />
      <Select
        v-model="params.terrainType"
        label="Type de terrain"
        name="terrainType"
        :data="terrainType"
      />
      <Select v-model="params.humidity" label="Humidité" name="humidity" :data="humidity" />
      <Select
        v-model="params.windStrength"
        label="Force du vent"
        name="windStrength"
        :data="windStrength"
      />
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
