import { TokenNameFormatType } from "../format.types";
import { rules, decomposeTokenName } from "./rules";

export const radiusLayerSubjectTypeFormat: TokenNameFormatType<"radius-layer-subject-type"> =
  {
    name: "radius-layer-subject-type",
    description: "Radius Layer Subject Type",
    version: "1.0.0",
    separator: ".",
    segments: ["layer", "subject", "type", "attribute"],
    decomposeTokenName,
    rules,
  };
