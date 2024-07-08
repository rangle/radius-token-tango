export type VectorOutput = {
  name: string;
  description?: string;
  properties: Record<string, string>;
  source: string;
  parent: string | undefined;
};
