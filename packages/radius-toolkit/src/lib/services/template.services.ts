import { TemplateLoader, TemplateModule } from "../loaders/loader.types";
import { installedModuleLoader } from "../loaders/installed.loader";
import { internalTemplateLoader } from "../loaders/internal.loader";
import { relativeLoader } from "../loaders/relative.loader";
import { createLogger } from "../utils/logging.utils";

const log = createLogger("services:template");

const prioritizedLoaders = [
  relativeLoader,
  internalTemplateLoader,
  installedModuleLoader,
] satisfies Array<TemplateLoader>;

/**
 * Loads either a built-in template or a custom template dynamically loaded by name
 * the template can be loaded from a file or from a module
 * @param templateName name of the template renderer to load
 * @returns a promise that resolves to a template render function
 */
export const loadTemplateModule: TemplateLoader<TemplateModule> = async (
  templateId,
  options
) => {
  const module = await prioritizedLoaders.reduce(
    async (result, loader) => {
      try {
        return (await result) ?? loader(templateId, options);
      } catch (error) {
        // Log error and continue to next loader
        log("error", "Loader failed:", (error as Error).message);
        return null;
      }
    },
    Promise.resolve(null) as Promise<TemplateModule | null>
  );
  if (!module) throw new Error(`Template ${templateId} not found`);
  return { ...module };
};
