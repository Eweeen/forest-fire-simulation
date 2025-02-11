<script setup lang="ts">
import { computed } from 'vue';

export interface CaseState {
  vegetation: boolean; // true = végétation, false = inerte
  fireState: 'none' | 'burning' | 'hot' | 'cold';
  burningIteration: number; // Nombre d'itérations depuis l'allumage du feu
  road: boolean;
}

const props = defineProps({
  grid: {
    type: Array,
    required: true
  },
  params: {
    type: Object,
    required: true
  }
});

const width = computed<number>(() => props.params.width);
const sizeCell: string = '20px';

const getCellClass = (cell: CaseState): string => {
  switch (cell.fireState) {
    case 'burning':
      return 'burning';
    case 'hot':
      return 'hot';
    case 'cold':
      return 'cold';
    default:
      return cell.vegetation ? `vegetation ${props.params.humidity}` : cell.road ? 'road' : 'empty';
  }
};
</script>

<template>
  <div class="grid">
    <div v-for="(row, rowIndex) in grid" :key="rowIndex" class="row">
      <div
        v-for="(cell, colIndex) in row"
        :key="colIndex"
        :class="['cell', getCellClass(cell)]"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(v-bind(width), v-bind(sizeCell));
  border-radius: 4px;
  overflow: hidden;
  margin: 12px;
  height: fit-content;
}

.cell {
  width: v-bind(sizeCell);
  height: v-bind(sizeCell);
}

/* Couleurs des cases */
.vegetation.wet {
  background-color: #14532d;
}
.vegetation.normal {
  background-color: #4d7c0f;
}
.vegetation.dry {
  background-color: #22c55e;
}
.vegetation.very-dry {
  background-color: #4ade80;
}

.empty {
  background-color: #431407;
}

.road {
  background-color: #57534e;
}

.burning {
  background-color: #dc2626;
}

.hot {
  background-color: #ea580c;
}

.cold {
  background-color: #7c2d12;
}
</style>
