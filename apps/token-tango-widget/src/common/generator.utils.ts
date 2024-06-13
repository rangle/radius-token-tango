import {
  formatKey,
  toKebabCase,
  TokenLayer,
  TokenLayers,
  TokenOutput,
  TokeTypeName,
  inferVariableType,
  tokenTypeNames,
  TokenCollection,
  TokenVariable,
  VariablesMode,
} from "radius-toolkit";

const DEFAULT_MODE_NAME = "Mode 1";
export const PARAM_SECTION_NAME = "section-name";

const formatLayerName = (modeName: string, description: string) => {
  const visibleModeName = modeName !== DEFAULT_MODE_NAME ? modeName : undefined;
  const cleanDescription = toKebabCase(description.replace(/\d+-/, ""));

  return visibleModeName
    ? `${cleanDescription}--${toKebabCase(visibleModeName)}`
    : cleanDescription;
};

const renderKey = (name: string) => `--${formatKey(name)}`;
const formatReference = (alias: string) => `{${renderKey(alias)}}`;

const variableToTokenOutput = (variable: TokenVariable): TokenOutput => {
  const { name, description } = variable;
  const type = inferVariableType(variable);
  return {
    name: name.replaceAll("/", "."),
    key: renderKey(name),
    type,
    description: description,
    value: variable.alias
      ? formatReference(variable.alias)
      : renderValue(type, variable.value ?? ""),
  };
};

export const isArray = <T>(o: T | T[]): o is T[] => Array.isArray(o);

export const isNumber = (s: unknown): s is number => !Number.isNaN(Number(s));
export const isRGB = (s: VariableValue): s is RGB =>
  !!s && typeof s === "object" && ["r", "g", "b"].every((n) => n in s);
export const isRGBA = (s: VariableValue): s is RGBA =>
  !!s && typeof s === "object" && ["r", "g", "b", "a"].every((n) => n in s);

export const renderPrimitiveValue = (s: unknown) => String(s);
export const renderNumericValue = (n: number, unit: string) => `${n}${unit}`;
export const color = (c: number) => Math.round(c * 255);
export const renderRGB = ({ r, g, b }: RGB): string =>
  `rgb(${color(r)}, ${color(g)}, ${color(b)})`;
export const renderRGBA = ({ r, g, b, a }: RGBA): string =>
  `rgba(${color(r)}, ${color(g)}, ${color(b)}, ${a.toFixed(2)})`;

export const renderValue = (typeName: string, v: VariableValue): string => {
  const type = tokenTypeNames.find((t) => t === (typeName as TokeTypeName));
  switch (type) {
    case "color":
    case "textColor":
    case "backgroundColor":
      // TODO: convert to HSL colors
      if (isRGBA(v)) return renderRGBA(v);
      if (isRGB(v)) return renderRGB(v);
      break;
    case "spacing":
    case "width":
    case "height":
    case "margin":
    case "padding":
    case "grid":
    case "size":
    case "borderRadius":
    case "borderWidth":
      if (Array.isArray(v))
        return `${v.map((n) => renderNumericValue(n, "px"))}`;
      if (isNumber(v)) return renderNumericValue(v, "px");
      break;
    case "opacity":
      if (isNumber(v)) return renderNumericValue(v, "%");
  }
  return renderPrimitiveValue(v);
};

const SCREEN_SIZE_VARIABLES =
  /(screen|grid)[.-/ ](minWidth|maxWidth|min[-./ ][Ww]idth|max[-./ ][Ww]idth)/;

const hasScreenSizes = <T extends TokenVariable>(v: T) =>
  SCREEN_SIZE_VARIABLES.test(v.name) && v.value !== undefined;

const renderScreenSizes = <T extends TokenVariable>({ name, value }: T) => {
  const [_, __, param] = name.match(SCREEN_SIZE_VARIABLES) ?? [];
  return { [`screen-${formatKey(param)}`]: value };
};

const generateParameters = ({ name, variables }: VariablesMode) => {
  const screenSizes = variables
    .filter(hasScreenSizes)
    .reduce((acc, v) => ({ ...acc, ...renderScreenSizes(v) }), {});
  if (Object.keys(screenSizes).length > 0) return screenSizes;
  return {
    [PARAM_SECTION_NAME]: toKebabCase(name),
  };
};

export const generateLayerFile = (
  collections: TokenCollection[],
): TokenLayers => {
  const layers = collections.flatMap(
    ({ name: layerName, modes }): TokenLayer[] => {
      const isStatic = modes.length === 1;
      return modes.map(
        ({ name: modeName, variables }) =>
          ({
            name: formatLayerName(modeName, layerName),
            dependencies: [],
            parameters: {
              ...(isStatic
                ? {}
                : generateParameters({ name: modeName, variables })),
            },
            isStatic,
            variables: variables.map(variableToTokenOutput),
          }) satisfies TokenLayer,
      );
    },
  );

  const order: string[] = layers.map(({ name }) => name);
  return {
    layers,
    order,
  };
};

export const isTokenLayer = (l: unknown): l is TokenLayer =>
  !!l && typeof l === "object" && "name" in l && "variables" in l;

export const isTokenLayers = (u: unknown): u is TokenLayers =>
  !!u &&
  typeof u === "object" &&
  "order" in u &&
  "layers" in u &&
  Array.isArray(u.layers) &&
  u.layers.every(isTokenLayer);
