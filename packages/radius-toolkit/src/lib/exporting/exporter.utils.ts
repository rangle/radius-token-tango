import { GeneratorMappingFunction, TokenLayer, TokenLayers } from "../tokens";
import { createLogger } from "../utils/logging.utils";

const log = createLogger("lib:exporter");

/**
 * A type to be used to inject system operations into the services
 */
export type SystemOperations = {
  loadFile: (fileName: string) => Promise<Buffer>;
  writeFile: (fileName: string, buffer: Buffer) => Promise<void>;
  readStdin: () => Promise<Buffer>;
  writeToStdout: (buffer: Buffer) => void;
};

// converts the buffer to JSON and parse it
export const parseData = (input: Buffer) => {
  log("info", "PARSING JSON DATA");
  const fileDataAsString = input.toString();
  log("info", `read ${fileDataAsString.length} bytes`);
  return JSON.parse(fileDataAsString);
};

// passthrough function to render a value in the template
export const noop: GeneratorMappingFunction = (_: string, value: string) =>
  value;

/// options for the TemplateRenderFunction
export type TemplateOptions = {
  processValue?: GeneratorMappingFunction;
  dsName?: string;
  ignoreLayers?: string[];
};

export type ServiceOptions = TemplateOptions & {
  source:
    | { fileName: string }
    | { content: Buffer | string }
    | { stdin: boolean };
  target:
    | { fileName: string }
    | { sink: (data: Buffer) => Promise<void> }
    | { stdout: boolean };
  operations: SystemOperations;
};

/// default options for the TemplateRenderFunction
export const defaultOptions = {
  processValue: noop,
  dsName: "DS",
  ignoreLayers: [],
};

/**
 * a function that accepts a list of layers to be ignored and returns a function that checks if a layer should be ignored
 * @param ignoreLayers
 * @returns a function that checks if a layer should be ignored
 * @example
 * const ignoreLayers = ['ignore-me'];
 * const isNotIgnoredLayer = ignoreLayerFunction(ignoreLayers);
 * const layers = [{name: 'ignore-me'}, {name: 'keep-me'}];
 * const filteredLayers = layers.filter(isNotIgnoredLayer);
 */
export const isNotIgnoredLayer =
  (ignoreLayers: string[]) => (tokenLayer: TokenLayer) =>
    !ignoreLayers.includes(tokenLayer.name);

/**
 * A function that renders a template using the provided layers and options. The main render function for each template should be a named export called 'render' and be of this type.
 * @param layers
 * @param options
 * @returns a buffer with the rendered template
 */

export type TemplateRenderFunction = (
  layers: TokenLayers,
  options?: TemplateOptions
) => Buffer;
