import {
  parseData,
  TemplateRenderFunction,
  ServiceOptions,
  SystemOperations,
} from "../exporting";
import { createReplaceFunction } from "../tokens/token-parser.utils";
import { GeneratorMappingDictionary } from "../tokens/token-parser.types";
import { builtInTemplates } from "../../templates/exporting";
import { loadTemplateModule } from "./service.utils";

/**
 * reads the tokens from a source
 * @param source object describing the source of the tokens
 * @returns a promise that resolves to a buffer containing the tokens
 * @returns
 */

const readTokens = async (
  { readStdin, loadFile }: SystemOperations,
  source: ServiceOptions["source"]
) => {
  if ("fileName" in source) {
    return loadFile(source.fileName);
  }
  if ("content" in source) {
    return Buffer.from(source.content);
  }
  if ("stdin" in source) {
    return readStdin();
  }
  console.warn("NO SOURCE SPECIFIED");
  return Buffer.from("");
};

/**
 * writes a buffer to the target
 * @param target object describing the target of the tokens
 * @param buffer buffer containing the tokens
 * @returns a promise that resolves when the buffer is written to the target
 */
const writeTarget = async (
  { writeFile, writeToStdout }: SystemOperations,
  target: ServiceOptions["target"],
  buffer: Buffer
) => {
  if ("fileName" in target) {
    return writeFile(target.fileName, buffer);
  }
  if ("sink" in target) {
    return target.sink(buffer);
  }
  if ("stdout" in target) {
    return writeToStdout(buffer);
  }
  console.warn("NO TARGET SPECIFIED");
};

const loadGeneratorMappingModule = async (
  path: string
): Promise<GeneratorMappingDictionary | null> => {
  try {
    return (await import(path)) as GeneratorMappingDictionary;
  } catch (e) {
    return null;
  }
};

/**
 * Loads all generator mappings for a given template
 * @param templateName name of the template renderer to use as a key
 * @returns a GeneratorMappingDictionary object, containing all mappings for the given template
 */

export const loadGeneratorMappings = (templateName: string) => {
  console.warn("LOADING GENERATOR MAPPINGS for", templateName);
  const mapping = [
    `./mapping/${templateName}-generator`,
    `./mapping/all-generator`,
    `./mapping/generator`,
  ].reduce<Promise<GeneratorMappingDictionary>>(async (res, path) => {
    const loadedModule = await loadGeneratorMappingModule(path);
    const previousResult = await res;
    const map = loadedModule ? loadedModule["default"] : {};
    return { ...previousResult, ...map };
  }, Promise.resolve({}));

  return mapping;
};

/** 
  # Export Tokens Service
  - reads layers from standard input
  - parses the data into a JSON
  - renders each layer, using the appropriate template
  - writes the file to stdout so it can be saved to disk
    to be used by the Design System packages
*/

export const generateFileService = async (
  templateName: string,
  { source, target, operations, ...renderOptions }: ServiceOptions
) => {
  return readTokens(operations, source)
    .then((input) =>
      Promise.all([
        parseData(input),
        loadGeneratorMappings(templateName),
        loadTemplateModule(templateName, { path: ["./templates"] }),
      ])
    )
    .then(([data, mappings, { render }]) =>
      render(data, {
        processValue: createReplaceFunction(mappings[templateName]),
        ...renderOptions,
      })
    )
    .then((buffer) => writeTarget(operations, target, buffer))
    .catch((e) => {
      console.error("ERROR:", e);
    });
};
