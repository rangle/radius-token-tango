import { builtInTemplates } from "../../templates";
import { loadTemplateModule } from "../../lib/services/template.services";
import { systemOperations } from "../system.utils";

import { generateFileService } from "../../lib/services/generate.services";
import { Command, Option } from "commander";

import { createLogger } from "../../lib/utils/logging.utils";

const log = createLogger("cli:generate");

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
      log("debug", "Generating outputs...", options);
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

      // If formatFileName is not provided, default to a simple output filename
      let outputFile = options.output;

      if (!outputFile && templateModule.formatFileName) {
        const formattedName = templateModule.formatFileName(fileName, {
          kebabCase: true,
        });
        // Check if formatFileName returns an array (multi-file generation)
        if (!Array.isArray(formattedName)) {
          outputFile = formattedName;
        }
        // If it's an array, we'll use the custom handling in generateFileService
      }

      // If we still don't have an output file, use a default format
      if (!outputFile) {
        outputFile = `${fileName}.${options.template}`;
      }

      log("info", "SAVING TO: ", outputFile);

      try {
        await generateFileService(
          templateModule,
          {
            source: { fileName },
            target: {
              fileName: outputFile,
            },
            operations: systemOperations,
          },
          pwd
        );
      } catch (error) {
        log("error", "Failed to generate files:", error);
      }
    });
};
