import { Command } from "commander";
import { version } from "../package.json";
import { registerGenerateCommand } from "./cli/generate";
import { registerValidateCommand } from "./cli/validate";

const program = new Command();

program
  .name("radius")
  .description("A toolkit for handling design tokens")
  .version(version);

registerGenerateCommand(program);
registerValidateCommand(program);

program.parse(process.argv);
