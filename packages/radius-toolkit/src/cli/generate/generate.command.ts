import { defaultTemplates, extensions } from "../../templates/exporting";
import { systemOperations } from "../system.utils";

import { generateFileService } from "../../lib/services/generate.services";
import { Command, Option } from "commander";

export type GenerateOptions = {
  template: (typeof defaultTemplates)[number];
  output?: string;
};

export const registerGenerateCommand = (program: Command) => {
  program
    .command("generate")
    .argument("<fileName>", "Token file to generate outputs from")
    .addOption(
      new Option("-t, --template <TEMPLATE>", "Predefined template to use")
        .choices(defaultTemplates)
        .default("css")
    )
    .addOption(new Option("-s, --stdin", "Accept input form stdin"))
    .addOption(new Option("-o, --output <OUTPUT>", "Output file"))
    .description("Generate outputs from design tokens")
    .action(async (fileName: string, options: GenerateOptions) => {
      console.log("Generating outputs...", options);
      const ext = extensions[options.template];
      return await generateFileService(options.template, {
        source: { fileName },
        target: {
          fileName:
            options.output ?? `${fileName.replace(/\.json$/, "")}.${ext}`,
        },
        operations: systemOperations,
      });
    });
};
