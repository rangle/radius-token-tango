import { TemplateLoader, TemplateModule } from "./loader.types";

export const installedModuleLoader: TemplateLoader = async (
  templateId,
  _options
) => {
  if (templateId.startsWith(".")) return null;
  try {
    // console.log("internalTemplateLoader", templateId);

    const module = await import(templateId);
    if (!("render" in module)) return null;
    return module as TemplateModule;
  } catch (error) {
    return null;
  }
};
