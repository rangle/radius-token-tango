import { Command } from "commander";
import { version } from "../package.json";
import { validateTokenName } from "./index";

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
  .command("validate-token-name <name>")
  .description("Checks if a token name is valid")
  .action((name) => {
    console.log(validateTokenName(name));
  });

program.parse(process.argv);
