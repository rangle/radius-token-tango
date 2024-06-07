import { TokenNameFormatType } from "../format.types";
import { rules } from "./rules";

export const radiusSimpleFormat: TokenNameFormatType = {
  name: "radius-simple",
  description: "Radius Simple",
  version: "1.0.0",
  separator: ".",
  segments: ["type", "attribute"],
  rules,
};
