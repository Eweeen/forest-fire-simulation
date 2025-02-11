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
}

interface WindDistribution {
  x: number;
  y: number;
  prob: number;
}

interface Result {
  grid: CaseState[][];
  isFinished: boolean;
}

const TERRAIN_DISTRIBUTION = {
  continue: 1,
  'closely-spaced': 0.95,
  spaced: 0.8,
  sparse: 0.5
};

const HUMIDITY_DISTRIBUTION = {
  wet: 0.1,
  normal: 0.3,
  dry: 0.6,
  very_dry: 0.9
};

const WIND_DISTRIBUTION: Record<number, WindDistribution[]> = {
  0: [
    { x: -1, y: -2, prob: 0.1 },
    { x: 0, y: -2, prob: 0.1 },
    { x: 1, y: -2, prob: 0.1 },
    { x: -2, y: -1, prob: 0.1 },
    { x: -1, y: -1, prob: 0.2 },
    { x: 0, y: -1, prob: 0.3 },
    { x: 1, y: -1, prob: 0.2 },
    { x: 2, y: -1, prob: 0.1 },
    { x: -2, y: 0, prob: 0.1 },
    { x: -1, y: 0, prob: 0.3 },
    { x: 1, y: 0, prob: 0.3 },
    { x: 2, y: 0, prob: 0.1 },
    { x: -2, y: 1, prob: 0.1 },
    { x: -1, y: 1, prob: 0.2 },
    { x: 0, y: 1, prob: 0.3 },
    { x: 1, y: 1, prob: 0.2 },
    { x: 2, y: 1, prob: 0.1 },
    { x: -1, y: 2, prob: 0.1 },
    { x: 0, y: 2, prob: 0.1 },
    { x: 1, y: 2, prob: 0.1 }
  ]
};

export const createGround = (params: ForestParams): CaseState[][] => {
  const grid: CaseState[][] = Array.from({ length: params.width }, () =>
    Array.from({ length: params.height }, () => ({
      vegetation: Math.random() < TERRAIN_DISTRIBUTION[params.terrainType],
      fireState: 'none',
      burningIteration: 0
    }))
  );

  // Placez les deux cases enflammées aléatoirement
  const x1 = Math.floor(Math.random() * params.width);
  const y1 = Math.floor(Math.random() * params.height);
  const x2 = Math.floor(Math.random() * params.width);
  const y2 = Math.floor(Math.random() * params.height);

  grid[x1][y1].fireState = 'burning';
  grid[x2][y2].fireState = 'burning';

  return grid;
};

/**
 * Simule une itération de propagation du feu.
 * Le vent vient toujours d'en haut.
 *
 * @param {CaseState[][]} grid
 * @param {ForestParams} forestParams
 * @returns
 */
export const simulateStep = (grid: CaseState[][], forestParams: ForestParams): Result => {
  const newGrid: CaseState[][] = JSON.parse(JSON.stringify(grid));

  const humidityProb = HUMIDITY_DISTRIBUTION[forestParams.humidity];
  const brandonEmissionProb = 0.005;
  const distribution = WIND_DISTRIBUTION[0];

  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid[x].length; y++) {
      const currentCase = grid[x][y];

      // Évolution de l'état du feu
      if (currentCase.fireState === 'burning') {
        if (currentCase.burningIteration < 2) {
          newGrid[x][y].burningIteration++;
        } else {
          newGrid[x][y].fireState = 'hot';
        }
      } else if (currentCase.fireState === 'hot') {
        if (Math.random() < 0.4) {
          newGrid[x][y].fireState = 'cold';
        }
      }

      // Propagation du feu
      if (currentCase.fireState === 'burning') {
        _burningCase(newGrid, x, y, distribution, humidityProb);
      }

      // Émission de brandons
      if (currentCase.fireState === 'hot' && Math.random() < brandonEmissionProb) {
        _burningCase(newGrid, x, y, distribution, humidityProb);
      }
    }
  }

  // Fini quand il n'y a plus de cases enflammées ou chaudes
  const isFinished = newGrid.every((row) =>
    row.every((cell) => cell.fireState === 'cold' || cell.fireState === 'none')
  );

  return { grid: newGrid, isFinished };
};

/**
 * Propage le feu à une case voisine.
 *
 * @param {CaseState[][]} grid
 * @param {number} x
 * @param {number} y
 * @param {WindDistribution[]} distribution
 */
function _burningCase(
  grid: CaseState[][],
  x: number,
  y: number,
  distribution: WindDistribution[],
  humidityProb: number
): void {
  for (const { x: dx, y: dy, prob } of distribution) {
    const nx = x + dx;
    const ny = y + dy;

    if (nx >= 0 && nx < grid.length && ny >= 0 && ny < grid[x].length) {
      const neighbor = grid[nx][ny];

      if (neighbor.vegetation && neighbor.fireState === 'none' && Math.random() < prob) {
        if (Math.random() < humidityProb) {
          grid[nx][ny].fireState = 'burning';
        }
      }
    }
  }
}
