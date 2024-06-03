export type VariableResolvedDataType = "BOOLEAN" | "COLOR" | "FLOAT" | "STRING";
export interface RGB {
  readonly r: number;
  readonly g: number;
  readonly b: number;
}
export interface RGBA {
  readonly r: number;
  readonly g: number;
  readonly b: number;
  readonly a: number;
}
export interface VariableAlias {
  type: "VARIABLE_ALIAS";
  id: string;
}
export type VariableValue =
  | boolean
  | string
  | number
  | RGB
  | RGBA
  | VariableAlias;
