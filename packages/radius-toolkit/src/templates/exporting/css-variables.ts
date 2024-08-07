/**
   STANDARD TEMPLATE FOR GENERATING CSS VARIABLES
   Generates a CSS file with all the variables in the library
   in a single css file
*/
import {
  toKebabCase,
  TemplateRenderFunction,
  defaultOptions,
  isNotIgnoredLayer,
  PARAM_SECTION_NAME,
  PARAM_SCREEN_MIN_WIDTH,
  PARAM_SCREEN_MAX_WIDTH,
  isVariableReference,
  variableReferenceRegex,
  isExpression,
  TokenOutput,
  TokenLayer,
} from "../../lib";
// NOTE: replace relative import with "radius-toolkit" if you are using this template in your project

/*
  Exports 3 symbols to conform type TemplateModule:
  - name: string
  - formatFileName: (name: string, options: { kebabCase: boolean }) => string
  - render: TemplateRenderFunction
*/

/** Name of the Template */
export const name = "css-variables";

/**
 * Generates the file name for the output file
 * @param name original name of the source file
 * @param options options for generating the file name
 * @returns formatted file name
 */
export const formatFileName = (
  name: string,
  options: { kebabCase: boolean }
) => (options.kebabCase ? `${toKebabCase(name)}.css` : `${name}.css`);

/**
 * Renders the template for generating CSS variables
 * @param data data to be rendered
 * @param options options for rendering the template
 * @returns a buffer with the rendered content
 */
export const render: TemplateRenderFunction = (
  { order, layers },
  options = defaultOptions
) => {
  const ignoreLayers = options.ignoreLayers ?? defaultOptions.ignoreLayers;
  const processValue = options.processValue ?? defaultOptions.processValue;

  const effectiveLayers = layers.filter(isNotIgnoredLayer(ignoreLayers));

  return Buffer.from(`
@layer ${order.join()},defaultLayers;

@layer defaultLayers {
  /* Generated to allow the site to have defaults derived by Designer decisions */
  :root {
    --defaultLayers: ${getDefaultLayerCssClasses(effectiveLayers).join(" ")};
  }
}

${effectiveLayers
  .map(
    ({ name, variables, parameters, dependencies }) => `

@layer ${name} {
  ${layerWrapper(
    { ...parameters, name },
    dependencies,
    variables
      .map(convertVariableReferences)
      .map(convertExpressions)
      .map(({ key, value }) => `${key}: ${processValue(key, value)};`)
      .join("\n    ")
  )}
}`
  )
  .join("")}
  `);
};

/* 
   Utility functions
*/

/** Wraps the template for either `:root` or the different `dependencies` */
const forEachDependency = (
  dependencies: string[] | ":root" = ":root",
  template: string,
  indentLevel = 1
) => {
  const indentSpacing = new Array(indentLevel).fill("  ").join("");
  if (Array.isArray(dependencies) && dependencies.length > 0) {
    return `
/* consolidated layer */
/* this layer will be effective in the relevant sections where it sources its variables from */
${dependencies.map((name) => `.${toKebabCase(name)}`).join(", ")} {
  ${template}
}
`.replace(/\n/g, `\n${indentSpacing}`);
  }
  return `
  :root {
    ${template}
  }
`.replace(/\n/g, `\n${indentSpacing}`);
};

// Wraps special layers based on detecting specific parameters.
// It is possible to create more sophisticated parameters for layers in the future
const layerWrapper = (
  params: Record<string, string | undefined>,
  dependencies: string[],
  template: string
) => {
  const sectionName = params[PARAM_SECTION_NAME];
  const layerName = params.name ?? "global";
  // get the prefixes of the layer name without the last part
  const layerNamePrefix = toKebabCase(
    layerName.split("--").slice(0, -1).join(" ")
  );
  if (sectionName)
    return `
  /* ${sectionName} */
  /* this layer requires a class to be added to a section or the body */
  .${toKebabCase(sectionName)} {
    --${layerNamePrefix}: ${toKebabCase(sectionName)};
    ${template}
  }
`;

  if (params[PARAM_SCREEN_MIN_WIDTH] && params[PARAM_SCREEN_MAX_WIDTH])
    return `
  /* this layer automatically activates when the screen is between two specific sizes */
  @media screen and (min-width: ${
    params[PARAM_SCREEN_MIN_WIDTH]
  }) and (max-width: ${params[PARAM_SCREEN_MAX_WIDTH]}) {
    ${forEachDependency(dependencies, template, 2)}
  }
`;

  if (params[PARAM_SCREEN_MIN_WIDTH])
    return `
  /* this layer automatically activates when the screen is bigger than a specific size */
  @media screen and (min-width: ${params[PARAM_SCREEN_MIN_WIDTH]}) {
    ${forEachDependency(dependencies, template, 2)}
  }
`;

  if (params[PARAM_SCREEN_MAX_WIDTH])
    return `
  /* this layer automatically activates when the screen is smaller than a specific size */
  @media screen and (max-width: ${params[PARAM_SCREEN_MAX_WIDTH]}) {
    ${forEachDependency(dependencies, template, 2)}
  }
`;

  // if it's not a special case, returns only the template
  return forEachDependency(dependencies, template);
};

const convertVariableReferences = (token: TokenOutput): TokenOutput =>
  isVariableReference(token.value)
    ? {
        ...token,
        value: token.value.replace(variableReferenceRegex, "var($1)"),
      }
    : token;

const convertExpressions = (token: TokenOutput): TokenOutput =>
  isExpression(token.value)
    ? { ...token, value: `Calc(${token.value})` }
    : token;

const getDefaultLayerCssClasses = (layers: TokenLayer[]) => {
  return layers.flatMap(({ name, parameters }) => {
    const sectionName = parameters[PARAM_SECTION_NAME] ?? name;
    return sectionName ? toKebabCase(String(sectionName)) : [];
  });
};
