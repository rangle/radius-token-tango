import { TokenNameFormatType } from "../format.types";
import { rules } from "./rules";

export const format: TokenNameFormatType = {
  name: "radius-simple",
  description: "Radius Simple",
  version: "1.0.0",
  separator: ".",
  typePosition: 0,
  rules,
};
