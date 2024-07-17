import { TemplateModule } from "../lib";
import * as css from "./exporting/css-variables";
import * as tailwind from "./exporting/tailwind-config";

export const builtInTemplates = {
  css,
  tailwind,
  ["css-variables"]: css,
  ["tailwind-config"]: tailwind,
} satisfies Record<string, TemplateModule>;

export type BuiltInTemplates = typeof builtInTemplates;
export type BuiltInTemplate = keyof BuiltInTemplates;
