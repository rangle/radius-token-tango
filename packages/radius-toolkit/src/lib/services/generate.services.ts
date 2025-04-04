import { parseData, ServiceOptions, SystemOperations } from "../exporting";
import { createReplaceFunction } from "../tokens/token-parser.utils";
import { GeneratorMappingDictionary } from "../tokens/token-parser.types";
import { TemplateModule } from "../loaders/loader.types";
import { createLogger } from "../utils/logging.utils";
import { jitiLoader } from "../loaders/relative.loader";
import { isNotNil } from "../tokens";

const log = createLogger("service:generate");

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
  log("warn", "NO SOURCE SPECIFIED");
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
  buffer: Buffer,
  customFileName?: string
) => {
  if ("fileName" in target) {
    return writeFile(customFileName || target.fileName, buffer);
  }
  if ("sink" in target) {
    return target.sink(buffer);
  }
  if ("stdout" in target) {
    return writeToStdout(buffer);
  }
  log("warn", "NO TARGET SPECIFIED");
};

const loadMappingModule = (
  modulePath: string
): GeneratorMappingDictionary | null => {
  try {
    const module = jitiLoader(modulePath);

    return isNotNil(module) ? module : null;
  } catch (error) {
    log("debug", "loadModule", (error as Error).message);
    return null;
  }
};

/**
 * Loads all generator mappings for a given template
 * @param templateName name of the template renderer to use as a key
 * @returns a GeneratorMappingDictionary object, containing all mappings for the given template
 */

export const loadGeneratorMappings = (templateName: string, pwd: string) => {
  log("warn", "LOADING GENERATOR MAPPINGS for", templateName);
  const mapping = [
    `${pwd}/mapping/${templateName}-generator.ts`,
    `${pwd}/mapping/all-generator.ts`,
    `${pwd}/mapping/generator.ts`,
    `${pwd}/mappings/${templateName}-generator.ts`,
    `${pwd}/mappings/all-generator.ts`,
    `${pwd}/mappings/generator.ts`,
  ].reduce<Promise<GeneratorMappingDictionary>>(async (res, path) => {
    const loadedModule = await loadMappingModule(path);
    const previousResult = await res;

    const map = loadedModule ? loadedModule["default"] : {};
    // merges previously loaded mappings with the new ones
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
  templateModule: TemplateModule,
  { source, target, operations, ...renderOptions }: ServiceOptions,
  pwd: string
) => {
  const { name, render, formatFileName } = templateModule;

  if (!name) throw new Error("Template module must have a name");

  try {
    const input = await readTokens(operations, source);
    const [data, mappings] = await Promise.all([
      parseData(input),
      loadGeneratorMappings(name, pwd),
    ]);

    // Handle case where formatFileName exists and returns an array
    if (formatFileName && "fileName" in target) {
      const baseName = target.fileName;
      // Get the file name(s) from formatFileName
      const fileNameResult = formatFileName(baseName, { kebabCase: true });

      if (Array.isArray(fileNameResult)) {
        // Display warning about multiple files being generated
        const fileNames = fileNameResult.map((item) =>
          typeof item === "string" ? item : item.name
        );

        log(
          "warn",
          `Multiple files will be generated from template '${name}':`
        );
        fileNames.forEach((fileName) => {
          log("warn", `  - ${fileName}`);
        });

        if (target.fileName) {
          log(
            "warn",
            `Note: The provided output filename '${target.fileName}' will be ignored.`
          );
        }

        // Multiple files to generate
        return Promise.all(
          fileNameResult.map((fileItem) => {
            const fileInfo = typeof fileItem === "string" ? fileItem : fileItem;
            const fileName =
              typeof fileItem === "string" ? fileItem : fileItem.name;

            const buffer = render(data, {
              processValue: createReplaceFunction(mappings[name]),
              fileInfo,
              ...renderOptions,
            });

            return writeTarget(operations, target, buffer, fileName);
          })
        );
      }
    }

    // Default single file generation
    const buffer = await render(data, {
      processValue: createReplaceFunction(mappings[name]),
      ...renderOptions,
    });

    return writeTarget(operations, target, buffer);
  } catch (e) {
    log("error", "ERROR:", e);
    throw e;
  }
};
