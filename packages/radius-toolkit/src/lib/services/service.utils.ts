import { TemplateLoader, TemplateModule } from "../loaders/loader.utils";
import { installedModuleLoader } from "../loaders/installed.loader";
import { internalTemplateLoader } from "../loaders/internal.loader";
import { relativeEsmLoader } from "../loaders/relative.loader.esm";

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
  const module =
    (await internalTemplateLoader(templateId, options)) ??
    (await installedModuleLoader(templateId, options)) ??
    (await relativeEsmLoader(templateId, options));
  if (!module) throw new Error(`Template ${templateId} not found`);
  return { ...module };
};
