import { Command, Option } from "commander";
import { mkdir, copyFile, access } from "node:fs/promises";
import path from "path";
import { asyncFind } from "../../lib/utils/common.utils";
import { createLogger } from "../../lib/utils/logging.utils";

const logger = createLogger("cli:extract");

type ExtractTemplateOptions = {
  outputDir: string;
};

export const registerExtractCommand = (program: Command) => {
  program
    .command("extract")
    .argument("<templateName>", "Name of the template to extract")
    .addOption(
      new Option(
        "-o, --output-dir <DIR>",
        "Directory to extract the template to"
      ).default("./extracted-templates")
    )
    .description(
      "Extracts a built-in template to the specified directory for customization"
    )
    .action(async (templateName: string, options: ExtractTemplateOptions) => {
      try {
        const templatePath = await findTemplatePath(templateName);
        if (!templatePath) {
          throw new Error(`Template '${templateName}' not found`);
        }

        const outputDir = path.resolve(options.outputDir);
        await mkdir(outputDir, { recursive: true });

        const destPath = path.join(outputDir, path.basename(templatePath));
        logger("info", "DEST", templatePath, destPath);
        await copyFile(templatePath, destPath);

        logger(
          "info",
          `Template '${templateName}' has been extracted to ${destPath}`
        );
      } catch (error) {
        logger(
          "error",
          `Error extracting template: ${(error as Error).message}`
        );
        process.exit(1);
      }
    });
};

async function findTemplatePath(templateName: string): Promise<string | null> {
  const possiblePaths = [
    path.join(__dirname, "../../src/templates/exporting", `${templateName}.ts`),
    path.join(__dirname, "../../src/templates", `${templateName}.ts`),
    path.join(__dirname, "../../../dist/templates", `${templateName}.js`),
  ];

  return (
    (await asyncFind(possiblePaths, async (path) => {
      try {
        await access(path); // user can access the file
        logger("debug", "FOUND", path);
        return true;
      } catch {
        logger("debug", "NOT FOUND", path);
        return false;
      }
    })) ?? null
  );
}
