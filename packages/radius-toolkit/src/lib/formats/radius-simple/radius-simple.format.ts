import {
  TokenNamePortableFormatType,
  toTokenNameFormatType,
} from "../format.types";
import { ruleDescriptions, formatDescription } from "./radius-simple.rules";

export const radiusSimpleFormat: TokenNamePortableFormatType<"radius-simple"> =
  {
    name: "radius-simple",
    description: "Radius Simple",
    version: "2.0.0",
    separator: ".",
    segments: ["type", "attribute"],
    formatDescription,
    ruleDescriptions,
  };

export const radiusSimpleFormatType = toTokenNameFormatType(radiusSimpleFormat);
