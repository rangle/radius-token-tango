import {
  TokenNameCollection,
  DecomposeTokenName,
  TokenRuleSet,
  TokenNameRule,
  TokenGlobalNameRule,
  TokenNameValidationResult,
  TokenGlobalRuleValidationResult,
} from "./format.types";
import {
  isCamelCase,
  isLowerCase,
  isLowerCaseIdentifier,
  isNumberOrFraction,
  toKebabCase,
} from "./format.utils";
import { getTokenType, TokenTypeName } from "./token-name-format.types";
import { isVariableAlias } from "../tokens";

// Predefined validation functions that can be referenced by name
export const validationFunctions = {
  isCamelCase,
  isLowerCase,
  isLowerCaseIdentifier,
  isLowerCaseOrCamelCase: (segment: string) =>
    isLowerCase(segment) || isCamelCase(segment),
  isNumberOrFraction,
  isLowerCaseCamelCaseOrNumber: (segment: string) =>
    isLowerCaseIdentifier(segment) ||
    isCamelCase(segment) ||
    isNumberOrFraction(segment),
  isTokenType: (segment: string) => getTokenType(segment) !== undefined,
  isPrimitiveToken: (name: string) => {
    const segments = name.split(".");
    if (segments.length !== 3) return false;
    const [layer, typeSegment] = segments;
    return layer === "primitive" && getTokenType(typeSegment) !== undefined;
  },
  hasNoRepeatedSegments: (name: string) => {
    const segments = toKebabCase(name).split("-");
    return !segments.some(
      (segment, index) => segments.indexOf(segment) !== index
    );
  },
  isNotGenericType: (segment: string) => {
    const genericTypes = ["color", "spacing"];
    return !genericTypes.includes(segment);
  },
} as const;

export type ValidationFunctionName = keyof typeof validationFunctions;

// Core validation result types
export type ValidationSeverity = "error" | "warning" | "disabled";

export type ValidationResult = {
  isValid: boolean;
  message?: string;
  offendingSegments?: string[];
  severity: ValidationSeverity;
};

// Skip conditions
export type SkipCondition =
  | { type: "token-type"; value: string }
  | { type: "primitive-token" }
  | { type: "segment-count"; min?: number; max?: number }
  | { type: "segment-value"; position: number; value: string }
  | { type: "pattern-match"; pattern: StringPattern };

// Base validator configuration
type BaseValidatorConfig = {
  severity?: ValidationSeverity;
  message?: string;
  skipIf?: SkipCondition[];
  description?: string;
  examples?: {
    valid: string[];
    invalid: string[];
  };
};

// Pattern types for serializable configurations
export type StringPattern =
  | {
      type: "regex";
      pattern: string;
    }
  | {
      type: "function";
      name: ValidationFunctionName;
      allowEmpty?: boolean;
      operator?: "not";
    };

export type SegmentLength = {
  min?: number;
  max?: number;
};

export type SegmentPosition = number | "last" | "first";

// Collection validation types
export type CollectionValidationType =
  | { type: "unique-modes" }
  | { type: "common-prefix" }
  | { type: "unique-subjects" }
  | { type: "no-aliases"; target: "primitive" | "non-primitive" }
  | { type: "segment-uniqueness"; position: number }
  | { type: "segment-pattern"; pattern: StringPattern }
  | { type: "attribute-sparsity"; minSegments: number };

// Validator configurations
type SegmentValidatorConfig = BaseValidatorConfig & {
  type: "segment";
  length?: SegmentLength;
  separator?: string;
};

type SegmentPatternValidatorConfig = BaseValidatorConfig & {
  type: "segment-pattern";
  pattern: StringPattern;
  excludeLastSegment?: boolean;
};

type PositionalValidatorConfig = BaseValidatorConfig & {
  type: "position";
  position: SegmentPosition;
  pattern: StringPattern;
};

type StringPatternValidatorConfig = BaseValidatorConfig & {
  type: "string-pattern";
  pattern: StringPattern;
};

type CollectionValidatorConfig = BaseValidatorConfig & {
  type: "collection";
  validation: CollectionValidationType;
};

// Rule configuration
export type RuleConfig = {
  description: string;
  severity?: ValidationSeverity;
  validators: (
    | SegmentValidatorConfig
    | SegmentPatternValidatorConfig
    | PositionalValidatorConfig
    | StringPatternValidatorConfig
    | CollectionValidatorConfig
  )[];
  examples?: {
    valid: string[];
    invalid: string[];
  };
};

export type RuleDescriptions<T extends string = string> = {
  [key in T]: RuleConfig;
};

// Helper to evaluate skip conditions
const shouldSkipValidation = (
  conditions: SkipCondition[] | undefined,
  context: {
    name: string;
    tokenType?: string;
    segments: string[];
  }
): boolean => {
  if (!conditions) return false;

  return conditions.some((condition) => {
    switch (condition.type) {
      case "token-type":
        return context.tokenType === condition.value;
      case "primitive-token":
        return validationFunctions.isPrimitiveToken(context.name);
      case "segment-count":
        return (
          (!condition.min || context.segments.length >= condition.min) &&
          (!condition.max || context.segments.length <= condition.max)
        );
      case "segment-value":
        return context.segments[condition.position] === condition.value;
      case "pattern-match":
        return evaluatePattern(condition.pattern, context.name);
    }
  });
};

// Helper to create validation result
const createValidationResult = (
  isValid: boolean,
  config: BaseValidatorConfig,
  message?: string,
  offendingSegments?: string[]
): ValidationResult => {
  return {
    isValid,
    message: message || config.message,
    offendingSegments,
    severity: config.severity || "error",
  };
};

// Helper functions to evaluate patterns
const evaluatePattern = (pattern: StringPattern, value: string): boolean => {
  if (pattern.type === "regex") {
    return new RegExp(pattern.pattern).test(value);
  } else {
    const fn = validationFunctions[pattern.name];
    if (!value?.length && !pattern.allowEmpty) return false;
    if (pattern.operator === "not") return !fn(value);
    return fn(value);
  }
};

// Collection validation functions
const validateCollectionByType = (
  config: CollectionValidationType,
  collections: TokenNameCollection[]
): { isValid: boolean; message?: string; offendingSegments?: string[] } => {
  switch (config.type) {
    case "unique-modes": {
      const collectionsByMode = collections.reduce(
        (acc, collection) => {
          if (!collection.modes) return acc;
          return collection.modes.reduce(
            (acc, mode) => ({
              ...acc,
              [mode]: [...(acc[mode] || []), collection.name],
            }),
            acc
          );
        },
        {} as Record<string, string[]>
      );

      const duplicates = Object.entries(collectionsByMode)
        .filter(([_, cols]) => cols.length > 1)
        .map(([mode, cols]) => ({ mode, collections: cols }));

      return {
        isValid: duplicates.length === 0,
        message:
          duplicates.length > 0
            ? `Modes should be unique to each collection. Found duplicate modes in ${duplicates.flatMap((d) => d.collections).join(", ")}`
            : undefined,
      };
    }

    case "common-prefix": {
      const heterogenousPrefixes = collections
        .map((collection) => ({
          name: collection.name,
          prefixes: [
            ...new Set(
              collection.tokens.map((token) => token.name.split(".")[0])
            ),
          ],
        }))
        .filter(({ prefixes }) => prefixes.length > 1);

      return {
        isValid: heterogenousPrefixes.length === 0,
        message:
          heterogenousPrefixes.length > 0
            ? `Collections should have a common prefix. Found heterogenous prefixes in ${heterogenousPrefixes.map((h) => h.name).join(", ")}`
            : undefined,
      };
    }

    case "no-aliases": {
      const tokens = collections
        .filter((collection) =>
          config.target === "primitive"
            ? collection.name === "primitive" ||
              collection.tokens.every((token) =>
                validationFunctions.isPrimitiveToken(token.name)
              )
            : collection.name !== "primitive" &&
              collection.tokens.some(
                (token) => !validationFunctions.isPrimitiveToken(token.name)
              )
        )
        .flatMap((collection) => collection.tokens);

      const aliases = tokens.filter((token) =>
        Object.values(token.values ?? {}).some(isVariableAlias)
      );

      return {
        isValid: aliases.length === 0,
        message:
          aliases.length > 0
            ? `${config.target === "primitive" ? "Primitive" : "Non-primitive"} tokens should not contain aliases. Found aliases in ${aliases.map((a) => a.name).join(", ")}`
            : undefined,
      };
    }

    case "attribute-sparsity": {
      const flatTokens = collections.flatMap((c) => c.tokens);
      const maxSegments = Math.max(
        0,
        ...flatTokens.map((t) => t.name.split(".").length)
      );

      if (maxSegments < config.minSegments) return { isValid: true };

      const indistinguishedAttributes = new Array(
        maxSegments - config.minSegments + 1
      )
        .fill(0)
        .map((_, i) => {
          const segmentGroups = flatTokens.reduce(
            (acc, token) => {
              const segments = token.name.split(".");
              const key = segments.slice(0, config.minSegments + i).join(".");
              return {
                ...acc,
                [key]: (acc[key] || 0) + 1,
              };
            },
            {} as Record<string, number>
          );

          return Object.entries(segmentGroups)
            .filter(([_, count]) => count === 1)
            .map(([segments]) => segments);
        })
        .flat();

      return {
        isValid: indistinguishedAttributes.length === 0,
        message:
          indistinguishedAttributes.length > 0
            ? `Attributes should be used sparingly. Found attributes that do not distinguish tokens: ${indistinguishedAttributes.join(", ")}`
            : undefined,
      };
    }

    default:
      return { isValid: true };
  }
};

// Validator functions
const validateSegments = (
  config: SegmentValidatorConfig,
  context: { name: string; tokenType?: string }
): ValidationResult => {
  const segments = context.name.split(config.separator || ".");

  if (shouldSkipValidation(config.skipIf, { ...context, segments })) {
    return createValidationResult(true, config);
  }

  const { length } = config;
  const isValid =
    (!length?.min || segments.length >= length.min) &&
    (!length?.max || segments.length <= length.max);

  return createValidationResult(
    isValid,
    config,
    isValid
      ? undefined
      : `Token names must have between ${length?.min} and ${length?.max} segments`
  );
};

const validateSegmentPattern = (
  config: SegmentPatternValidatorConfig,
  context: { name: string; tokenType?: string }
): ValidationResult => {
  const segments = context.name.split(".");
  const segmentsToValidate = config.excludeLastSegment
    ? segments.slice(0, -1)
    : segments;

  const invalidSegments = segmentsToValidate.filter(
    (segment) => !evaluatePattern(config.pattern, segment)
  );

  return createValidationResult(
    invalidSegments.length === 0,
    config,
    invalidSegments.length > 0 ? "Invalid segment pattern" : undefined,
    invalidSegments
  );
};

const validatePosition = (
  config: PositionalValidatorConfig,
  context: { name: string; tokenType?: string }
): ValidationResult => {
  if (
    shouldSkipValidation(config.skipIf, {
      ...context,
      segments: context.name.split("."),
    })
  ) {
    return createValidationResult(true, config);
  }

  const segments = context.name.split(".");
  const position =
    config.position === "last"
      ? segments.length - 1
      : config.position === "first"
        ? 0
        : config.position;

  const segment = segments[position];
  if (
    !segment &&
    config.pattern.type === "function" &&
    config.pattern.allowEmpty
  )
    return createValidationResult(true, config);

  const isValid = evaluatePattern(config.pattern, segment);
  return createValidationResult(
    isValid,
    config,
    isValid ? undefined : `Invalid segment at position ${position}`,
    [segment]
  );
};

const validateStringPattern = (
  config: StringPatternValidatorConfig,
  context: { name: string; tokenType?: string }
): ValidationResult => {
  const isValid = evaluatePattern(config.pattern, context.name);
  return createValidationResult(
    isValid,
    config,
    isValid ? undefined : "Invalid string pattern",
    []
  );
};

const validateCollection = (
  config: CollectionValidatorConfig,
  collections: TokenNameCollection[]
): ValidationResult => {
  const result = validateCollectionByType(config.validation, collections);
  if (result.isValid) return createValidationResult(true, config);

  return createValidationResult(
    false,
    config,
    result.message || "",
    result.offendingSegments || []
  );
};

// Helper to convert internal validation result to external token name validation result
const toTokenNameValidationResult = (
  result: ValidationResult
): TokenNameValidationResult => {
  if (result.isValid) return [true] as const;
  if (result.severity === "warning")
    return [
      false,
      result.message || "",
      result.offendingSegments || [],
      true,
    ] as const;
  return [false, result.message || "", result.offendingSegments || []] as const;
};

// Helper to convert internal validation results to external global validation result
const toGlobalValidationResult = (
  results: ValidationResult[],
  _collections: TokenNameCollection[]
): TokenGlobalRuleValidationResult => {
  if (results.length === 0) return [] as const;

  const firstResult = results[0];
  if (!firstResult.offendingSegments) {
    return [firstResult.message || ""] as const;
  }

  return [
    firstResult.message || "",
    firstResult.severity === "warning",
    firstResult.offendingSegments.map((segment) => [segment]) as [
      string,
      string?,
      string?,
    ][],
  ] as const;
};

// Main rule creator function
export const createRule = (
  config: RuleConfig
): TokenNameRule | TokenGlobalNameRule => {
  const isCollectionRule = config.validators.some(
    (v) => v.type === "collection"
  );

  const baseConfig: BaseValidatorConfig = {
    severity: config.severity || "error",
    examples: config.examples,
  };

  if (isCollectionRule) {
    return {
      description: config.description,
      type: "global" as const,
      validate: (
        collections: TokenNameCollection[]
      ): TokenGlobalRuleValidationResult => {
        if (config.severity === "disabled") return [] as const;

        const results: ValidationResult[] = [];
        for (const validator of config.validators) {
          if (validator.type === "collection") {
            const result = validateCollection(
              {
                ...validator,
                ...baseConfig,
              },
              collections
            );
            if (!result.isValid) results.push(result);
          }
        }
        return toGlobalValidationResult(results, collections);
      },
    };
  }

  return {
    description: config.description,
    validate: (name: string, tokenType?: string): TokenNameValidationResult => {
      if (config.severity === "disabled") {
        return [true] as const;
      }

      for (const validator of config.validators) {
        const validatorWithBase = {
          ...validator,
          severity: validator.severity || baseConfig.severity,
        };

        let result: ValidationResult;
        const context = { name, tokenType };

        switch (validator.type) {
          case "segment":
            result = validateSegments(
              validatorWithBase as SegmentValidatorConfig,
              context
            );
            break;
          case "segment-pattern":
            result = validateSegmentPattern(
              validatorWithBase as SegmentPatternValidatorConfig,
              context
            );
            break;
          case "position":
            result = validatePosition(
              validatorWithBase as PositionalValidatorConfig,
              context
            );
            break;
          case "string-pattern":
            result = validateStringPattern(
              validatorWithBase as StringPatternValidatorConfig,
              context
            );
            break;
          default:
            continue;
        }

        if (!result.isValid) return toTokenNameValidationResult(result);
      }

      return [true] as const;
    },
  };
};

// Helper function to create a rule set
export const createRuleSet = <T extends string>(rules: RuleDescriptions) => {
  return Object.fromEntries(
    Object.entries(rules).map(([key, config]) => [
      key,
      createRule(config as RuleConfig),
    ])
  ) as TokenRuleSet<T>;
};

// Token decomposition types
export type TokenSegmentDescription = {
  name: string;
  type: "layer" | "subject" | "type" | "attributes";
  description: string;
  examples?: {
    valid: string[];
    invalid: string[];
  };
  condition?: {
    type: "primitive" | "non-primitive";
    value?: string;
    description?: string;
  };
};

export type TokenFormatDescription = {
  name: string;
  version: string;
  description: {
    short: string;
    long: string;
  };
  segments: TokenSegmentDescription[];
  separator: string;
  primitiveFormat?: {
    requiredSegments: number;
    layerName: string;
    description: string;
  };
  examples?: {
    valid: string[];
    invalid: string[];
  };
};

// Token decomposition function creator
export const createDecompositionFunction = (
  format: TokenFormatDescription
): DecomposeTokenName => {
  return (name: string) => {
    const segments = name.split(format.separator);

    // Check if it's a primitive token if primitive format is defined
    const isPrimitive =
      format.primitiveFormat &&
      segments.length === format.primitiveFormat.requiredSegments &&
      segments[0] === format.primitiveFormat.layerName;

    // Early return if format doesn't match
    if (
      isPrimitive &&
      segments.length !== format?.primitiveFormat?.requiredSegments
    )
      return null;
    if (!isPrimitive && segments.length < format.segments.length) return null;

    // Map segments to their roles
    const segmentMap = format.segments.reduce(
      (acc, segDesc, index) => {
        if (segDesc.condition) {
          const shouldInclude =
            ((segDesc.condition.type === "primitive" && isPrimitive) ||
              (segDesc.condition.type === "non-primitive" && !isPrimitive)) &&
            (!segDesc.condition.value ||
              segments[index] === segDesc.condition.value);

          if (shouldInclude) {
            acc[segDesc.name] = segments[index];
          }
        } else {
          acc[segDesc.name] = segments[index];
        }
        return acc;
      },
      {} as Record<string, string>
    );

    // Get remaining segments as attributes
    const attributeStartIndex = format.segments.filter(
      (s) =>
        !s.condition ||
        (s.condition.type === "primitive" && isPrimitive) ||
        (s.condition.type === "non-primitive" && !isPrimitive)
    ).length;
    const attributes = segments.slice(attributeStartIndex);

    return {
      type: segmentMap.type as TokenTypeName,
      attributes,
      otherSegments: Object.fromEntries(
        Object.entries(segmentMap).filter(([key]) => key !== "type")
      ),
    };
  };
};
