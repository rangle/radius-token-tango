import { TemplateModule } from "../../lib/loaders/loader.utils";
import * as css from "./css-variables.template";
import * as tailwind from "./tailwind-config.template";

export const builtInTemplates = {
  css,
  tailwind,
} satisfies Record<string, TemplateModule>;

export type BuiltInTemplates = typeof builtInTemplates;
export type BuiltInTemplate = keyof BuiltInTemplates;
