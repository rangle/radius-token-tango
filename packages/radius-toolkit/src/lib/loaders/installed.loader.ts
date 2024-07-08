import { TemplateLoader, TemplateModule } from "./loader.utils";

export const installedModuleLoader: TemplateLoader = async (
  templateId,
  _options
) => {
  if (!templateId.startsWith(".")) return null;
  try {
    const module = await import(templateId);
    if (!("render" in module)) return null;
    return module as TemplateModule;
  } catch (error) {
    return null;
  }
};
