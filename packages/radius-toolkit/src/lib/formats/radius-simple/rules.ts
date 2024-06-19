import { DecomposeTokenName } from "../format.types";
import {
  isCamelCase,
  isNumberOrFraction,
  ruleSet,
  validationError,
  validationResult,
} from "../format.utils";
import { TokenNameDescription, getTokenType } from "../token-name-format.types";

export const decomposeTokenName: DecomposeTokenName = (name) => {
  const [typeSegment, ...attributes] = name.split(".");
  const type = getTokenType(typeSegment);
  if (!type) return null;
  return {
    type,
    attributes,
  } satisfies TokenNameDescription;
};

export const rules = ruleSet({
  "min-two-segments": {
    description: "Token names must have at least two segments",
    validate: (name: string) => {
      const segments = name.split(".");
      return segments.length >= 2
        ? validationResult(true)
        : validationError(
            `Token names must have at least two segments (found ${segments.length})`
          );
    },
  },
  "dot-separation": {
    description:
      "Segments within a token name must be separated by a single dot",
    validate: (name: string) => {
      return name.includes(".")
        ? validationResult(true)
        : validationError(
            "Segments within a token name must be separated by a single dot"
          );
    },
  },
  "type-as-first-segment": {
    description:
      "The first segment of the token name must indicate the token type unless the token is a color",
    validate: (name: string, tokenType: string) => {
      if (tokenType === "COLOR") return validationResult(true);
      const [firstSegment] = name.split(".");
      const type = getTokenType(firstSegment);
      return type
        ? validationResult(true)
        : validationError(
            `Segment '${firstSegment}' is not a valid token type`,
            [firstSegment]
          );
    },
  },
  "lowercase-or-camelcase": {
    description:
      "Each segment can be in lowercase or camelCase unless it's the last segment, that can be either a camelCase value or a numeric value",
    validate: (name: string) => {
      const segments = name.split(".");
      const allButLast = segments.slice(0, segments.length - 1);
      const lastSegment = segments[segments.length - 1];
      return allButLast.every(isCamelCase) &&
        (isCamelCase(lastSegment) || isNumberOrFraction(lastSegment))
        ? validationResult(true)
        : validationError(
            "Segments should be in lowercase or camelCase, or an expression if it's the last segment. It should also have no special characters",
            segments.filter((s) => !isCamelCase(s))
          );
    },
  },
  "no-leading-or-trailing-dots": {
    description: "Token names must not start or end with a dot",
    validate: (name: string) => {
      return !name.startsWith(".") && !name.endsWith(".")
        ? validationResult(true)
        : validationError("Token names must not start or end with a dot");
    },
  },
  length: {
    description:
      "Each segment within a token name should be between 1 to 25 characters long",
    validate: (name: string) => {
      const segments = name.split(".");
      return segments.every((s) => s.length >= 1 && s.length <= 25)
        ? validationResult(true)
        : validationError(
            "Each segment within a token name should be between 1 to 25 characters long",
            segments.filter((s) => s.length < 1 || s.length > 25)
          );
    },
  },
  "no-consecutive-dots": {
    description: "Multiple consecutive dots are not allowed",
    validate: (name: string) => {
      return !name.includes("..")
        ? validationResult(true)
        : validationError("Multiple consecutive dots are not allowed");
    },
  },
});
