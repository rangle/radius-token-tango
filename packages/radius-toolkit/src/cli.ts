import { Command, Option } from "commander";
import { version } from "../package.json";
import { createValidators } from "./lib";

export const THIS_IS_THE_CLI_ENTRYPOINT = "This is the CLI entrypoint";

const program = new Command();

program
  .name("radius")
  .description("A toolkit for handling design tokens")
  .version(version);

program
  .command("generate")
  .description("Generate outputs from design tokens")
  .action(() => {
    console.log("Generating outputs...");
  });

program
  .command("validate-token-name")
  .argument("<name>", "Token name to validate")
  .addOption(
    new Option("-f, --format <FORMAT>", "Format to use for validation")
      .choices(["radius-simple", "radius-layer-subject-type"])
      .default("radius-simple")
  )
  .addOption(
    new Option(
      "-o, --output <OUTPUT>",
      "Format for the output of the validation"
    )
      .choices(["text", "json"])
      .default("text")
  )
  .description(
    "Checks if a token name is valid. list error messages and warnings if it is not."
  )
  .action(async (name: string, options: any) => {
    console.log(name, options);
    const [validateTokenName] = createValidators(options.format);
    console.log(validateTokenName(name, ""));
  });

program.parse(process.argv);
