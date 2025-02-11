<script setup lang="ts">
import { ref, toRaw } from 'vue';
import GridView, { CaseState } from './components/GridView.vue';
import Form, { ForestParams } from './components/Form.vue';

const grid = ref<CaseState[][]>([]);
const defaultParams = ref<ForestParams>({
  width: 20,
  height: 20,
  terrainType: 'continue',
  humidity: 'normal',
  windStrength: 1
});

const step = ref<number>(0);
const interval = ref<NodeJS.Timeout | null>(null);

const startSimulation = async (params: ForestParams): Promise<void> => {
  step.value = 1;
  Object.assign(defaultParams.value, params);
  const rawParams = toRaw(defaultParams.value);

  grid.value = await window.forest.createGround(rawParams);

  interval.value = setInterval(async () => {
    step.value++;
    const serializable = JSON.parse(JSON.stringify(grid.value));
    const { grid: newGrid, isFinished } = await window.forest.simulateStep(serializable, rawParams);

    grid.value = newGrid;
    if (isFinished) {
      stopSimulation();
    }
  }, 1000);
};

const stopSimulation = (): void => {
  if (interval.value) {
    clearInterval(interval.value);
    interval.value = null;
  }
};
</script>

<template>
  <div class="container">
    <Form :interval :step @start="startSimulation($event)" @stop="stopSimulation()" />
    <p v-if="step > 0" class="step">Step {{ step }}</p>

    <GridView :grid :params="defaultParams" />
  </div>
</template>

<style scoped>
.container {
  display: flex;
}

.step {
  position: absolute;
  width: 100px;
  text-align: center;
  bottom: 12px;
  right: 12px;
  background: #f4f4f4;
  color: #000;
  padding: 4px;
  border-radius: 4px;
}
</style>
