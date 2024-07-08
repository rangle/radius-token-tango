/*
   TEMPLATE FOR TAILWIND CONFIGURATION FILE
  Generates a Tailwind Config file with all the tokens in the theme
*/
import {
  processKeyName,
  isVariableReference,
  TemplateRenderFunction,
  defaultOptions,
  isNotNil,
  toKebabCase,
} from "../../lib";

export const formatFileName = (
  name: string,
  options: { kebabCase: boolean }
) =>
  options.kebabCase ? `${toKebabCase(name)}.config.ts` : `${name}.config.ts`;

type TokenValue = {
  key: string;
  type: string;
  layers: string[];
  values: string[];
};

const isTokenValue = (value: unknown): value is TokenValue =>
  typeof value === "object" && value !== null && "value" in value;

type TokenStructure =
  | Record<string, string>
  | Record<string, TokenValue>
  | { [key: string]: TokenStructure };

const nestObject = (
  obj: TokenStructure,
  keys: string[],
  value: TokenValue,
  leafRenderer?: (value: TokenValue) => string
): TokenStructure => {
  const [currentKey, ...restKeys] = keys;
  const currentValue = obj[currentKey];

  // external renderer to convert the value to a string
  const render = leafRenderer ?? ((v: TokenValue) => v);

  const nestedValue =
    restKeys.length > 0 &&
    !isTokenValue(currentValue) &&
    typeof currentValue !== "string"
      ? nestObject(currentValue || {}, restKeys, value, leafRenderer)
      : render(value);

  return {
    ...obj,
    [currentKey]: nestedValue,
  } as TokenStructure;
};

export const render: TemplateRenderFunction = (
  { order, layers },
  options = defaultOptions
) => {
  const ignoreLayers = options.ignoreLayers ?? defaultOptions.ignoreLayers;
  const layerVariables = order
    .map((layer) =>
      layers.find((l) => l.name === layer && !ignoreLayers.includes(l.name))
    )
    .filter(isNotNil)
    .reduce(
      (tokens, layer) => {
        const { name, variables } = layer;
        const previous = tokens || {};
        // accumulates variables from all layers, recording in which layers they appear
        const updated = variables.reduce(
          (acc, curr) => {
            const previousToken =
              previous[curr.name] ??
              ({
                key: curr.key,
                type: curr.type,
                layers: [layer.name],
                values: [curr.value],
              } satisfies TokenValue);
            const token = {
              ...previousToken,
              layers: [...previousToken.layers.filter((l) => l !== name), name],
              values: [
                ...previousToken.values.filter((v) => v !== curr.value),
                curr.value,
              ],
            };
            return { ...acc, [curr.name]: token };
          },
          {} as Record<string, TokenValue>
        );
        return {
          ...previous,
          ...updated,
        };
      },
      {} as Record<string, TokenValue>
    );

  // returns an object that nests one level for every dot in the token key
  const nestedTokenValues = (renderer?: (token: TokenValue) => string) =>
    Object.entries(layerVariables).reduce((allTokens, [key, token]) => {
      const [type, name] = processKeyName(key).split(".");
      return nestObject(
        allTokens,
        type === "unknown" && token.type.toLowerCase().startsWith("color")
          ? ["colors", name]
          : [type, name],
        token,
        renderer
      );
    }, {} as TokenStructure);

  return Buffer.from(`
        /// Tailwind Configuration generated by Rangle Radius. DO NOT EDIT.
        export default ${JSON.stringify(
          nestedTokenValues((v) =>
            isVariableReference(v.values[0])
              ? `var(${v.key})`
              : `var(${v.key}, ${v.values[0]})`
          ),
          null,
          2
        )} as const;
        `);
};
