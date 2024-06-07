import { TokenNameFormatType } from "../format.types";
import { rules } from "./rules";

export const radiusLayerSubjectTypeFormat: TokenNameFormatType = {
  name: "radius-layer-subject-type",
  description: "Radius Layer Subject Type",
  version: "1.0.0",
  separator: ".",
  segments: ["layer", "subject", "type", "attribute"],
  rules,
};
