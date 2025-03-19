import { TemplateRenderFunction } from "../exporting/exporter.utils";

/**
 * Options for the template loader
 */
export type TemplateLoaderOptions = {
  path: string[]; // List of directores to search for templates when using relative loaders
};

/**
 * Represents a file to be generated with a name and optional metadata
 */
export type FileTemplate = {
  name: string;
  [key: string]: unknown;
};

/**
 * A module that exports a template render function
 * and optionally a function to format the file name
 * @see TemplateRenderFunction
 */
export type TemplateModule = {
  name?: string;
  formatFileName?:
    | ((name: string, options: { kebabCase: boolean }) => string)
    | ((name: string) => string)
    | ((
        name: string,
        options: { kebabCase: boolean }
      ) => string[] | FileTemplate[])
    | ((name: string) => string[] | FileTemplate[]);
  render: TemplateRenderFunction;
};

/**
 * A function that loads a template by its id
 * @param templateId
 * @param options
 * @returns the template as a string or null if the template was not found
 */
export type TemplateLoader<R = TemplateModule | null> = (
  templateId: string,
  options: TemplateLoaderOptions
) => Promise<R>;
