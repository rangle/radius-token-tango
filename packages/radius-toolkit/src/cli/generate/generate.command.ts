import { builtInTemplates } from "../../templates/exporting";
import { loadTemplateModule } from "../../lib/services/service.utils";
import { systemOperations } from "../system.utils";

import { generateFileService } from "../../lib/services/generate.services";
import { Command, Option } from "commander";

export type GenerateOptions = {
  template: string;
  output?: string;
};

export const registerGenerateCommand = (program: Command) => {
  program
    .command("generate")
    .argument("<fileName>", "Token file to generate outputs from")
    .addOption(
      new Option("-t, --template <TEMPLATE>", "template to use")
        .choices(Object.keys(builtInTemplates))
        .default("css")
    )
    .addOption(new Option("-s, --stdin", "Accept input form stdin"))
    .addOption(new Option("-o, --output <OUTPUT>", "Output file"))
    .description("Generate outputs from design tokens")
    .action(async (fileName: string, options: GenerateOptions) => {
      console.log("Generating outputs...", options);
      const templateModule = await loadTemplateModule(options.template, {
        path: [process.cwd()],
      });
      return await generateFileService(templateModule, {
        source: { fileName },
        target: {
          fileName:
            options.output ??
            templateModule.formatFileName?.(fileName, { kebabCase: true }) ??
            `${fileName}.${options.template}`,
        },
        operations: systemOperations,
      });
    });
};
