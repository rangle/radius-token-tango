import { TokenNameFormatType } from "../format.types";
import { rules, decomposeTokenName } from "./rules";

export const radiusSimpleFormat: TokenNameFormatType<"radius-simple"> = {
  name: "radius-simple",
  description: "Radius Simple",
  version: "1.0.0",
  separator: ".",
  segments: ["type", "attribute"],
  decomposeTokenName,
  rules,
};
