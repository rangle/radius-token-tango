import { builtInTemplates } from "../../templates";
import { loadTemplateModule } from "../../lib/services/template.services";
import { systemOperations } from "../system.utils";

import { generateFileService } from "../../lib/services/generate.services";
import { Command, Option } from "commander";

export type GenerateOptions = {
  template: string;
  customTemplate?: string;
  templateDir?: string;
  output?: string;
};

const pwd = process.cwd();

export const registerGenerateCommand = (program: Command) => {
  program
    .command("generate")
    .argument("<fileName>", "Token file to generate outputs from")
    .addOption(
      new Option("-t, --template <TEMPLATE>", "built-in template to use")
        .choices(Object.keys(builtInTemplates))
        .conflicts(["-c", "-T"])
        .default("css")
    )
    .addOption(
      new Option(
        "-c, --custom-template <TEMPLATE>",
        "custom template module to use"
      ).conflicts("-t")
    )
    .addOption(
      new Option(
        "-T, --template-dir <TEMPLATE_DIR>",
        "directory for custom template modules"
      ).conflicts("-t")
    )
    .addOption(new Option("-s, --stdin", "Accept input form stdin"))
    .addOption(new Option("-o, --output <OUTPUT>", "Output file"))
    .description("Generate outputs from design tokens")
    .action(async (fileName: string, options: GenerateOptions) => {
      //  console.log("debug", "Generating outputs...", options);
      const templateModule = await loadTemplateModule(
        options.customTemplate ?? options.template,
        {
          path: [
            options.templateDir ?? pwd,
            pwd,
            `${pwd}/templates`,
            `${pwd}/src/templates`,
            `${pwd}/dist/templates`,
          ],
        }
      );
      const outputFile =
        options.output ??
        templateModule.formatFileName?.(fileName, { kebabCase: true }) ??
        `${fileName}.${options.template}`;

      console.log("SAVING: ", outputFile);

      return await generateFileService(templateModule, {
        source: { fileName },
        target: {
          fileName: outputFile,
        },
        operations: systemOperations,
      });
    });
};
