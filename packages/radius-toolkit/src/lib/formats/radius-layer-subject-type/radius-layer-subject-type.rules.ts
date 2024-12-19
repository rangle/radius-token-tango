import {
  createRuleSet,
  createDecompositionFunction,
  TokenFormatDescription,
  RuleDescriptions,
} from "../rules.utils";

export const formatDescription: TokenFormatDescription = {
  name: "radius-layer-subject-type",
  version: "1.0.0",
  description: {
    short:
      "A format that enforces layer-based token naming with subjects and types",
    long: `The radius-layer-subject-type format ensures that design tokens follow a consistent naming convention as the complexity of the token layer increases. 
    This format is ideal for scenarios where multiple modes and layers of aliases are needed, ensuring clarity and distinction among various types of tokens.
    
    The format enforces a clear hierarchy:
    - Layer (first segment): Indicates the abstraction level (primitive, semantic, component)
    - Subject (second segment, optional for primitives): Provides context (e.g., action, button)
    - Type (third segment): Defines what the token represents (e.g., color, spacing)
    - Attributes (remaining segments): Additional variations or states`,
  },
  separator: ".",
  primitiveFormat: {
    requiredSegments: 3,
    layerName: "primitive",
    description:
      "Primitive tokens follow a simplified format with exactly three segments: layer, type, and value",
  },
  segments: [
    {
      name: "layer",
      type: "layer",
      description: "Indicates the abstraction level of the token",
      examples: {
        valid: ["primitive", "semantic", "component"],
        invalid: ["color", "spacing", "size"],
      },
    },
    {
      name: "subject",
      type: "subject",
      description: "Provides context about what the token applies to",
      examples: {
        valid: ["button", "action", "input"],
        invalid: ["color", "spacing"],
      },
      condition: {
        type: "non-primitive",
        description: "Subject is only required for non-primitive tokens",
      },
    },
    {
      name: "type",
      type: "type",
      description:
        "Defines the kind of value the token contains (color, spacing, etc.)",
      examples: {
        valid: ["color", "spacing", "borderRadius"],
        invalid: ["button", "action"],
      },
    },
  ],
  examples: {
    valid: [
      "primitive.color.primary",
      "semantic.action.color.primary",
      "component.button.backgroundColor.hover",
    ],
    invalid: [
      "color.primary",
      "semantic.color",
      "component.backgroundColor.button",
    ],
  },
};

export const decomposeTokenName =
  createDecompositionFunction(formatDescription);

export const ruleDescriptions: RuleDescriptions = {
  "minimum-three-segments": {
    description:
      "Token names must have at least three segments. Primitive tokens have exactly three segments, while other layers have four or more segments.",
    validators: [
      {
        type: "segment",
        length: { min: 3 },
        message: "Token names must have at least three segments",
      },
    ],
  },
  "layer-as-first-segment": {
    description:
      "The first segment of the token name must indicate the layer and not the type. Common layer names include `primitive`, `semantic`, or `component`, but can vary by the design team's preferences.",
    validators: [
      {
        type: "position",
        position: "first",
        pattern: {
          type: "function",
          name: "isTokenType",
          operator: "not",
        },
        message: "First segment must not be a token type",
      },
    ],
  },
  "subject-for-non-primitive-tokens": {
    description:
      "The subject segment is mandatory for semantic or component tokens but absent in primitive tokens. Subjects should be the second segment, that can be any name, but not a type.",
    validators: [
      {
        type: "position",
        position: 1,
        pattern: {
          type: "function",
          name: "isTokenType",
          operator: "not",
        },
        message:
          "Second segment must not be a token type for non-primitive tokens",
        skipIf: [
          {
            type: "primitive-token",
          },
        ],
      },
    ],
  },
  "attribute-segments": {
    description:
      "The fourth segment and subsequent segments can be anything the designers want to use to distinguish tokens.",
    validators: [
      {
        type: "segment",
        length: { min: 4 },
        message: "Non-primitive tokens must have at least four segments",
        skipIf: [
          {
            type: "primitive-token",
          },
        ],
      },
    ],
  },
  "lowercase-or-camelcase": {
    description:
      "Each segment can be in lowercase or camelCase unless it's the last segment, that can be either a camelCase value or an expression",
    validators: [
      {
        type: "segment-pattern",
        pattern: { type: "function", name: "isLowerCaseOrCamelCase" },
        excludeLastSegment: true,
        message:
          "Segments should be in lowercase or camelCase, or an expression if it's the last segment",
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
  "length-constraints": {
    description:
      "Each segment within a token name should be between 1 to 20 characters long",
    validators: [
      {
        type: "segment-pattern",
        pattern: { type: "regex", pattern: "^.{1,20}$" },
        message:
          "Each segment within a token name should be between 1 to 20 characters long",
      },
    ],
  },
  "no-consecutive-dots": {
    description: "Multiple consecutive dots (`..`) are not allowed",
    validators: [
      {
        type: "string-pattern",
        pattern: { type: "regex", pattern: "^(?!.*\\.\\.).*$" },
        message: "Multiple consecutive dots (`..`) are not allowed",
      },
    ],
  },
  "consistent-type-naming": {
    description:
      "The third segment of the token name (or the second in the case of primitive tokens) must indicate the token type, unless it's a color token.",
    validators: [
      {
        type: "position",
        position: 2,
        pattern: { type: "function", name: "isTokenType" },
        message: "Third segment must be a valid token type",
        skipIf: [
          {
            type: "token-type",
            value: "COLOR",
          },
          {
            type: "primitive-token",
          },
        ],
      },
    ],
  },
  "modes-unique-to-collections": {
    description:
      "Ensure that modes are unique to each collection to avoid conflicts and maintain semantic consistency within the collection.",
    validators: [
      {
        type: "collection",
        validation: { type: "unique-modes" },
        message: "Modes should be unique to each collection",
      },
    ],
    severity: "warning",
  },
  "same-prefix-for-collections": {
    description:
      "Ensure that all tokens within a collection share a common prefix to facilitate filtering and grouping.",
    validators: [
      {
        severity: "warning",
        type: "collection",
        validation: { type: "common-prefix" },
        message: "Collections should have a common prefix",
      },
    ],
    severity: "warning",
  },
  "subjects-unique-to-layers": {
    description:
      "Avoid using the same subject name across different layers to prevent confusion and maintain clarity and proper semantics in the design language.",
    validators: [
      {
        severity: "warning",
        type: "collection",
        validation: { type: "unique-subjects" },
        message: "Subjects should be unique to each layer",
      },
    ],
    severity: "warning",
  },
  "attributes-used-sparingly": {
    description:
      "Use attributes only when necessary to prevent overcomplicating the token structure.",
    validators: [
      {
        severity: "warning",
        type: "collection",
        validation: { type: "attribute-sparsity", minSegments: 4 },
        message: "Attributes should be used sparingly",
      },
    ],
    severity: "warning",
  },
  "repetition-of-information": {
    description:
      "Avoid repeating the same information in different segments to keep token names concise and clear.",
    validators: [
      {
        severity: "warning",
        type: "collection",
        validation: {
          type: "segment-pattern",
          pattern: { type: "function", name: "hasNoRepeatedSegments" },
        },
        message: "Repetition of information should be avoided",
      },
    ],
    severity: "warning",
  },
  "avoid-generic-types": {
    description:
      "Avoid generic types like color or spacing when more specific types can be used.",
    validators: [
      {
        type: "position",
        position: 2,
        pattern: {
          type: "function",
          name: "isNotGenericType",
          allowEmpty: true,
        },
        message:
          "Avoid using generic types when more specific types are available",
        skipIf: [
          {
            type: "segment-count",
            max: 2,
          },
        ],
      },
    ],
    severity: "warning",
  },
  "primitive-tokens-no-aliases": {
    description:
      "Primitive tokens should be direct values and not contain aliases to other tokens to maintain simplicity and directness.",
    validators: [
      {
        severity: "warning",
        type: "collection",
        validation: { type: "no-aliases", target: "primitive" },
        message: "Primitive tokens should not contain aliases",
      },
    ],
    severity: "warning",
  },
  "non-primitive-tokens-no-arbitrary-values": {
    description:
      "Non-primitive tokens should reference primitive tokens to maintain consistency and avoid arbitrary values.",
    validators: [
      {
        severity: "warning",
        type: "collection",
        validation: { type: "no-aliases", target: "non-primitive" },
        message:
          "Non-primitive tokens should only contain references to primitive values",
      },
    ],
    severity: "warning",
  },
};

export const rules = createRuleSet(ruleDescriptions);
