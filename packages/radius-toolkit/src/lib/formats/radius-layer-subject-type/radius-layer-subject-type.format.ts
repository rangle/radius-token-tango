import {
  TokenNamePortableFormatType,
  toTokenNameFormatType,
} from "../format.types";
import {
  formatDescription,
  ruleDescriptions,
} from "./radius-layer-subject-type.rules";

export const radiusLayerSubjectTypeFormat: TokenNamePortableFormatType<"radius-layer-subject-type"> =
  {
    name: "radius-layer-subject-type",
    description: "Radius Layer Subject Type",
    version: "2.0.0",
    separator: ".",
    segments: ["layer", "subject", "type", "attribute"],
    formatDescription,
    ruleDescriptions,
  };

export const radiusLayerSubjectTypeFormatType = toTokenNameFormatType(
  radiusLayerSubjectTypeFormat
);
