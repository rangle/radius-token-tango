export type VectorOutput = {
  name: string;
  description?: string;
  properties: Record<string, string>;
  source: string;
  parent: string | undefined;
};

export const isVectorOutput = (u: unknown): u is VectorOutput =>
  !!u &&
  typeof u === "object" &&
  "name" in u &&
  "properties" in u &&
  "source" in u;
