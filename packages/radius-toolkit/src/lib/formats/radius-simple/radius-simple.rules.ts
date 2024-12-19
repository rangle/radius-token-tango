import {
  createDecompositionFunction,
  TokenFormatDescription,
  createRuleSet,
  RuleDescriptions,
} from "../rules.utils";

export const formatDescription: TokenFormatDescription = {
  name: "radius-simple",
  version: "1.0.0",
  description: {
    short: "A simple type-first token naming format",
    long: `The radius-simple format provides a straightforward approach to naming design tokens, 
    focusing on the token type as the primary identifier. This format is ideal for simpler design systems 
    where all tokens belong to a single collection or where semantic layering is not required.

    The format follows a simple structure:
    - Type (first segment): What the token represents (color, spacing, etc.)
    - Attributes (remaining segments): Variations or specific use cases

    This format is particularly useful for:
    - Small to medium-sized design systems
    - Systems without complex semantic layering
    - Direct mapping between design tokens and their values`,
  },
  separator: ".",
  segments: [
    {
      name: "type",
      type: "type",
      description: "The kind of design token (color, spacing, etc.)",
      examples: {
        valid: ["color", "spacing", "borderRadius"],
        invalid: ["primary", "large", "button"],
      },
    },
    {
      name: "attributes",
      type: "attributes",
      description:
        "Additional descriptors that specify the token's purpose or variation",
      examples: {
        valid: ["primary", "large", "hover"],
        invalid: ["color", "spacing"],
      },
    },
  ],
  examples: {
    valid: [
      "color.primary",
      "spacing.large",
      "borderRadius.small",
      "fontSize.body.large",
    ],
    invalid: ["primary.color", "button.backgroundColor", "large.spacing"],
  },
};

export const decomposeTokenName =
  createDecompositionFunction(formatDescription);

export const ruleDescriptions: RuleDescriptions = {
  "min-two-segments": {
    description: "Token names must have at least two segments",
    validators: [
      {
        type: "segment",
        length: { min: 2 },
        message: "Token names must have at least two segments",
      },
    ],
  },
  "dot-separation": {
    description:
      "Segments within a token name must be separated by a single dot",
    validators: [
      {
        type: "string-pattern",
        pattern: { type: "regex", pattern: "\\." },
        message:
          "Segments within a token name must be separated by a single dot",
      },
    ],
  },
  "type-as-first-segment": {
    description:
      "The first segment of the token name must indicate the token type unless the token is a color",
    validators: [
      {
        type: "position",
        position: "first",
        pattern: { type: "function", name: "isTokenType" },
        message: "First segment must be a valid token type",
        skipIf: [
          {
            type: "token-type",
            value: "COLOR",
          },
        ],
      },
    ],
  },
  "lowercase-or-camelcase": {
    description:
      "Each segment can be in lowercase or camelCase unless it's the last segment, that can be either a camelCase value or a numeric value",
    validators: [
      {
        type: "segment-pattern",
        pattern: { type: "function", name: "isLowerCaseOrCamelCase" },
        excludeLastSegment: true,
        message:
          "Segments should be in lowercase or camelCase, or an expression if it's the last segment. It should also have no special characters",
      },
      {
        type: "position",
        position: "last",
        pattern: {
          type: "function",
          name: "isLowerCaseCamelCaseOrNumber",
        },
        message: "Last segment should be in camelCase or be a numeric value",
      },
    ],
  },
  "no-leading-or-trailing-dots": {
    description: "Token names must not start or end with a dot",
    validators: [
      {
        type: "string-pattern",
        pattern: { type: "regex", pattern: "^[^.].*[^.]$" },
        message: "Token names must not start or end with a dot",
      },
    ],
  },
  length: {
    description:
      "Each segment within a token name should be between 1 to 25 characters long",
    validators: [
      {
        type: "segment-pattern",
        pattern: {
          type: "regex",
          pattern: "^.{1,25}$",
        },
        message:
          "Each segment within a token name should be between 1 to 25 characters long",
      },
    ],
  },
  "no-consecutive-dots": {
    description: "Multiple consecutive dots are not allowed",
    validators: [
      {
        type: "string-pattern",
        pattern: { type: "regex", pattern: "^(?!.*\\.\\.).*$" },
        message: "Multiple consecutive dots are not allowed",
      },
    ],
  },
};

export const rules = createRuleSet(ruleDescriptions);
