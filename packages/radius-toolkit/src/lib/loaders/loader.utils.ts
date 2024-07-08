import { TemplateRenderFunction } from "../exporting/exporter.utils";

/**
 * Options for the template loader
 */
export type TemplateLoaderOptions = {
  path: string[]; // List of directores to search for templates when using relative loaders
};

/**
 * A module that exports a template render function
 * and optionally a function to format the file name
 * @see TemplateRenderFunction
 */
export type TemplateModule = {
  formatFileName?:
    | ((name: string, options: { kebabCase: boolean }) => string)
    | ((name: string) => string);
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
