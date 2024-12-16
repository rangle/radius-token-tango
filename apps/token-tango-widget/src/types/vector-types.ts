import { VectorOutput } from "radius-toolkit";

export type LayerRender = undefined | VectorOutput;

export type VectorState = {
  persistedVectors: string | null;
  loadedVectors: number | null;
  withVectors: boolean;
}; 