// This is a generic type that matches the structure of TokenLayers from radius-toolkit
export type TokenLayerStructure = {
  layers: Array<unknown>;
  order: Array<string>;
};

export const isTokenLayerStructure = (u: unknown): u is TokenLayerStructure =>
  u !== null &&
  typeof u === "object" &&
  "layers" in u &&
  Array.isArray(u["layers"]) &&
  "order" in u &&
  Array.isArray(u["order"]) &&
  u["order"].every((item) => typeof item === "string");
