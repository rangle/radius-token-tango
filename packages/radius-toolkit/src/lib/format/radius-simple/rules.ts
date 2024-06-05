import { TokenRuleSet } from "../format.types";
import { isCamelCase } from "../format.utils";
import { isTokenType } from "../token-name-format.types";

export const rules: TokenRuleSet = {
  "min-two-segments": {
    description: "Token names must have at least two segments",
    validate: (name: string) => {
      const segments = name.split(".");
      return segments.length >= 2
        ? [true]
        : [
            false,
            `Token names must have at least two segments (found ${segments.length})`,
          ];
    },
  },
  "dot-separation": {
    description:
      "Segments within a token name must be separated by a single dot",
    validate: (name: string) => {
      return name.includes(".")
        ? [true]
        : [
            false,
            "Segments within a token name must be separated by a single dot",
          ];
    },
  },
  "type-as-first-segment": {
    description:
      "The first segment of the token name must indicate the token type",
    validate: (name: string) => {
      const [firstSegment] = name.split(".");
      return isTokenType(firstSegment)
        ? [true]
        : [
            false,
            `Segment ${firstSegment} is not a valid token type`,
            [firstSegment],
          ];
    },
  },
  "lowercase-or-camelcase": {
    description: "Each segment can be in lowercase or camelCase",
    validate: (name: string) => {
      const segments = name.split(".");
      return segments.every(isCamelCase)
        ? [true]
        : [
            false,
            "Segments should be in lowercase or camelCase",
            segments.filter((s) => !isCamelCase(s)),
          ];
    },
  },
  "no-leading-or-trailing-dots": {
    description: "Token names must not start or end with a dot",
    validate: (name: string) => {
      return !name.startsWith(".") && !name.endsWith(".")
        ? [true]
        : [false, "Token names must not start or end with a dot"];
    },
  },
  length: {
    description:
      "Each segment within a token name should be between 1 to 20 characters long",
    validate: (name: string) => {
      const segments = name.split(".");
      return segments.every((s) => s.length >= 1 && s.length <= 20)
        ? [true]
        : [
            false,
            "Each segment within a token name should be between 1 to 20 characters long",
            segments.filter((s) => s.length < 1 || s.length > 20),
          ];
    },
  },
  "no-consecutive-dots": {
    description: "Multiple consecutive dots are not allowed",
    validate: (name: string) => {
      return !name.includes("..")
        ? [true]
        : [false, "Multiple consecutive dots are not allowed"];
    },
  },
};
