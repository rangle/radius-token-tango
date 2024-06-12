import { VariableValue } from "./variable.types";

export type TokenVariable = {
  name: string;
  value?: VariableValue;
  alias?: string;
  description?: string;
  type: string;
};

export type VariablesMode = {
  name: string;
  variables: TokenVariable[];
};

export type TokenCollection = {
  name: string;
  modes: VariablesMode[];
};

export type TokenUse = {
  name: string;
  value: string;
  from: "variable" | "token studio" | "style";
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
export type TokenRule = {
  title: string;
  validate: (
    name: string
  ) => readonly [boolean, string] | readonly [boolean, string, string[]];
};
