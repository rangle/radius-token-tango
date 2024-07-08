// ESM
import { TemplateLoader } from "./loader.utils";

import path from "path";

export const relativeEsmLoader: TemplateLoader = async (
  templateId,
  options
) => {
  try {
    const modulePath = path.resolve(...options.path, templateId);
    const module = await import(modulePath);
    if (!("render" in module)) return null;
    return module;
  } catch (error) {
    return null;
  }
};
