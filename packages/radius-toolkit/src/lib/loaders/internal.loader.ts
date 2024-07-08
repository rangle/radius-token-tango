import { TemplateLoader } from "./loader.utils";

import { BuiltInTemplate, builtInTemplates } from "../../templates/exporting";

export const internalTemplateLoader: TemplateLoader = async (
  templateId,
  _options
) => {
  if (templateId.startsWith(".")) return null;
  return builtInTemplates[templateId as BuiltInTemplate] || null;
};
