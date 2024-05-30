export type TokenUse = {
  name: string;
  value: string;
  from: "variable" | "token studio";
};

export const isTokenUse = (o: unknown): o is TokenUse =>
  !!o && typeof o === "object" && "name" in o && "value" in o && "from" in o;

export type ComponentUsage = {
  id: string;
  name: string;
  props: TokenUse[];
  children: ComponentUsage[];
};

export type ComponentTokens = {
  name: string;
  attribute: string;
  subjects: string[];
  tokens: [string, string][];
};

export type TokenRecords = Record<string, Record<string, string>>;
