import { contextBridge, ipcRenderer } from 'electron';

interface CaseState {
  vegetation: boolean; // true = végétation, false = inerte
  fireState: 'none' | 'burning' | 'hot' | 'cold';
  burningIteration: number; // Nombre d'itérations depuis l'allumage du feu
}

interface ForestParams {
  width: number;
  height: number;
  terrainType: 'continue' | 'closely-spaced' | 'spaced' | 'sparse';
  humidity: 'wet' | 'normal' | 'dry' | 'very_dry';
  windStrength: 0 | 1 | 2 | 3;
}

// Custom APIs for renderer
const forest = {
  createGround: (params: ForestParams) => ipcRenderer.invoke('forest:createGround', params),
  simulateStep: (grid: CaseState[][], params: ForestParams) =>
    ipcRenderer.invoke('forest:simulateStep', grid, params)
};

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('forest', forest);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.forest = forest;
}
