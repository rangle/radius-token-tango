import { render as cssRender } from "./css-variables.template";
import { render as tailwindRender } from "./tailwind-config.template";

export const templateRenderFunctions = {
  css: cssRender,
  tailwind: tailwindRender,
} as const;

export const extensions = {
  css: "css",
  tailwind: "config.ts",
} as const;

export type TemplateType = keyof typeof templateRenderFunctions;
export const defaultTemplates = Object.keys(
  templateRenderFunctions
) as TemplateType[];

export const isBuiltInTemplate = (template: string): template is TemplateType =>
  defaultTemplates.includes(template as TemplateType);
