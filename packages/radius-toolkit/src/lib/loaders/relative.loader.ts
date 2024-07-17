import { TemplateLoader, TemplateModule } from "./loader.types";
import path from "path";
import jiti from "jiti";
import { createLogger } from "../utils/logging.utils";

const log = createLogger("loader:relative");

const jitiLoader = jiti(__filename, { interopDefault: true });

const moduleCache: Map<string, TemplateModule> = new Map();

const isTemplateModule = (module: unknown): module is TemplateModule =>
  typeof module === "object" &&
  module !== null &&
  typeof (module as TemplateModule).render === "function";

const loadModule = (modulePath: string): TemplateModule | null => {
  try {
    const module = jitiLoader(modulePath);
    return isTemplateModule(module) ? module : null;
  } catch (error) {
    log("debug", "loadModule", (error as Error).message);
    return null;
  }
};

const findValidModule = (paths: string[]): TemplateModule | null =>
  paths.length === 0
    ? null
    : loadModule(paths[0]) ?? findValidModule(paths.slice(1));

export const relativeLoader: TemplateLoader = async (templateId, options) => {
  // Check cache first
  if (moduleCache.has(templateId)) {
    log("debug", "relativeLoader", "Returning cached module for", templateId);
    return moduleCache.get(templateId)!;
  }

  const modulePaths = options.path.map((dir) =>
    path.resolve(dir, `${templateId}.ts`)
  );

  const loadedModule = findValidModule(modulePaths);

  if (loadedModule) {
    // Cache the loaded module
    moduleCache.set(templateId, loadedModule);
    log("debug", "relativeLoader", "Cached new module for", templateId);
  } else {
    log("debug", "relativeLoader", "Module not found for", templateId);
  }

  return loadedModule;
};
