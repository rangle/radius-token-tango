import { Command, Option } from "commander";
import { createValidators, formatNames } from "../../lib";

type ValidateOptions = {
  format: (typeof formatNames)[number];
  output: "text" | "json";
};

export const registerValidateCommand = (program: Command) => {
  program
    .command("validate-token-name")
    .argument("<name>", "Token name to validate")
    .addOption(
      new Option("-f, --format <FORMAT>", "Format to use for validation")
        .choices(formatNames)
        .default("radius-layer-subject-type")
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
    .action(async (name: string, options: ValidateOptions) => {
      // console.log(name, options);
      const [validateTokenName] = createValidators(options.format);
      console.log(validateTokenName(name, ""));
    });
};
