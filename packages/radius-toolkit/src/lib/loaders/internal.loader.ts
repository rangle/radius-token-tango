import { TemplateLoader } from "./loader.types";

import { BuiltInTemplate, builtInTemplates } from "../../templates";

export const internalTemplateLoader: TemplateLoader = async (
  templateId,
  _options
) => {
  if (templateId.startsWith(".")) return null;
  return builtInTemplates[templateId as BuiltInTemplate] || null;
};
