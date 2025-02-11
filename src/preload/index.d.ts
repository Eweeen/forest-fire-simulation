export {};

declare global {
  interface Window {
    forest: {
      createGround: (params: ForestParams) => Promise<CaseState[][]>;
      simulateStep: (
        arg: CaseState[][],
        params: ForestParams
      ) => Promise<{ grid: CaseState[][]; isFinished: boolean }>;
    };
  }
}
