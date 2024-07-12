import {
  formatKey,
  toKebabCase,
  TokenLayer,
  TokenLayers,
  formatLayerName,
  inferVariableType,
  TokenCollection,
  TokenVariable,
  VariablesMode,
  TokenNameFormatType,
  convertVariableToToken,
  isString,
} from "radius-toolkit";

import { createLogger } from "@repo/utils";

const log = createLogger("utils:generator");

export const PARAM_SECTION_NAME = "section-name";

const SCREEN_SIZE_VARIABLES =
  /(screen|screens|grid)[.-/ ](minWidth|maxWidth|min[-./ ][Ww]idth|max[-./ ][Ww]idth)/;

const hasScreenSizes = <T extends TokenVariable>(v: T) =>
  SCREEN_SIZE_VARIABLES.test(v.name) && v.value !== undefined;

const renderScreenSizes = <T extends TokenVariable>({ name, value }: T) => {
  const [_, __, param] = name.match(SCREEN_SIZE_VARIABLES) ?? [];
  return param ? { [`screen-${formatKey(param)}`]: value } : {};
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
  format: TokenNameFormatType,
): TokenLayers => {
  const getType = inferVariableType(format);
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
            variables: variables.map((v) =>
              convertVariableToToken(v, getType(v)),
            ),
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
  u.layers.every(isTokenLayer) &&
  (u as TokenLayers).order.every(isString) &&
  ((u as TokenLayers).vectors === undefined ||
    Array.isArray((u as TokenLayers).vectors));
