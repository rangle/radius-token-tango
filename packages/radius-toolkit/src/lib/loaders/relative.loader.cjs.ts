// ESM
import { TemplateLoader, TemplateModule } from "./loader.utils";

import path from "path";

export const relativeEsmLoader: TemplateLoader = async (
  templateId,
  options
) => {
  try {
    const modulePath = path.resolve(...options.path, templateId);
    const module = await import(modulePath);
    return module as TemplateModule;
  } catch (error) {
    return null;
  }
};
