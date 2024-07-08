import { getTokenType } from "../formats";
import {
  RGB,
  RGBA,
  TokenOutput,
  TokenVariable,
  VariableValue,
  formatKey,
} from "../tokens";

// Utility functions
export const renderSimpleKey = (name: string): string => `--${formatKey(name)}`;
export const formatReference = (alias: string): string =>
  `{${renderSimpleKey(alias)}}`;

// Type guards
const isArray = <T>(o: T | T[]): o is T[] => Array.isArray(o);
const isNumber = (s: unknown): s is number =>
  typeof s === "number" && !Number.isNaN(s);
const isRGB = (s: VariableValue): s is RGB =>
  !!s && typeof s === "object" && "r" in s && "g" in s && "b" in s;
const isRGBA = (s: VariableValue): s is RGBA => isRGB(s) && "a" in s;

// Value rendering functions
const renderPrimitiveValue = (s: unknown): string => JSON.stringify(s);
const renderNumericValue = (n: number, unit: string): string => `${n}${unit}`;
const color = (c: number): number => Math.round(c * 255);
const renderRGB = ({ r, g, b }: RGB): string =>
  `rgb(${color(r)}, ${color(g)}, ${color(b)})`;
const renderRGBA = ({ r, g, b, a }: RGBA): string =>
  `rgba(${color(r)}, ${color(g)}, ${color(b)}, ${a.toFixed(2)})`;

// Main rendering function
export const renderValue = (type: string, v: VariableValue): string => {
  const colorTypes = ["COLOR", "colors", "textColor", "backgroundColor"];
  const dimensionTypes = [
    "spacing",
    "width",
    "height",
    "margin",
    "padding",
    "screens",
    "borderRadius",
    "borderWidth",
  ];

  if (colorTypes.includes(type)) {
    if (isRGBA(v)) return renderRGBA(v);
    if (isRGB(v)) return renderRGB(v);
  }

  if (dimensionTypes.includes(type)) {
    if (isArray(v) && v.every(isNumber))
      return v.map((n: number) => renderNumericValue(n, "px")).join(" ");
    if (isNumber(v)) return renderNumericValue(v, "px");
  }

  if (type === "opacity" && isNumber(v)) {
    return renderNumericValue(v, "%");
  }

  if (type === "STRING" && v) {
    return `${v}`;
  }

  return renderPrimitiveValue(v);
};

// Token conversion function
export const convertVariableToToken = (
  variable: TokenVariable,
  givenType: string
): TokenOutput => {
  const { name, description, alias, value } = variable;
  const type = getTokenType(givenType) ?? givenType;
  return {
    name: name.replaceAll("/", "."),
    key: renderSimpleKey(name),
    type,
    description,
    value: alias ? formatReference(alias) : renderValue(type, value ?? ""),
  };
};
