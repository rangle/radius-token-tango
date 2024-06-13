import {
  DecomposedTokenName,
  TokenGlobalRuleValidationResult,
  TokenNameCollection,
} from "../format.types";
import {
  globalValidationError,
  globalValidationWarning,
  invertGroupedObject,
  isCamelCase,
  isNumberOrFraction,
  ruleSet,
  toKebabCase,
  validationError,
  validationResult,
  validationWarning,
} from "../format.utils";
import { TokenNameDescription, isTokenType } from "../token-name-format.types";

export const isPrimitiveToken = (name: string) => {
  return name.split(".").length === 3;
};

export const getSubject = (name: string) => {
  return name.split(".")[1];
};

export const decomposeTokenName: DecomposedTokenName = (name) => {
  if (!isPrimitiveToken(name)) {
    const [layer, type, ...attributes] = name.split(".");
    if (!isTokenType(type)) return null;
    return {
      type,
      attributes,
      otherSegments: { layer },
    } satisfies TokenNameDescription;
  }
  const [layer, subject, type, ...attributes] = name.split(".");
  if (!isTokenType(type)) return null;
  return {
    type,
    attributes,
    otherSegments: { layer, subject },
  } satisfies TokenNameDescription;
};

export const groupByFirstNSegments = (
  n: number,
  collections: TokenNameCollection[]
) => {
  // accumulate all tokens with more than n segments in a single array
  const tokensWithAttributes = collections.reduce(
    (acc, collection) => {
      const tokens = collection.tokens.filter(
        (token) => token.name.split(".").length > n
      );
      return [...acc, ...tokens];
    },
    [] as TokenNameCollection["tokens"]
  );
  // create an object with the first n segments as keys and the number of tokens with those same first 4 segments as values
  const tokensByFirstFourSegments = tokensWithAttributes.reduce(
    (acc, token) => {
      const firstFourSegments = token.name.split(".").slice(0, n).join(".");
      const nextSegment = token.name.split(".")[n];
      const count = acc[firstFourSegments].count || 0;
      return {
        ...acc,
        [firstFourSegments]: { count: count + 1, nextSegment },
      };
    },
    {} as Record<string, { count: number; nextSegment: string }>
  );
  return tokensByFirstFourSegments;
};

export const rules = ruleSet({
  "minimum-three-segments": {
    description:
      "Token names must have at least three segments. Primitive tokens have exactly three segments, while other layers have four or more segments.",
    validate: (name: string) => {
      const segments = name.split(".");
      return segments.length >= 3
        ? validationResult(true)
        : validationError(
            `Token names must have at least three segments (found ${segments.length})`
          );
    },
  },
  "layer-as-first-segment": {
    description:
      "The first segment of the token name must indicate the layer and not the type. Common layer names include `primitive`, `semantic`, or `component`, but can vary by the design team's preferences.",
    validate: (name: string) => {
      const [firstSegment] = name.split(".");
      return !firstSegment || isTokenType(firstSegment)
        ? validationError(
            `Segment ${firstSegment} is not a valid token layer`,
            [firstSegment]
          )
        : validationResult(true);
    },
  },
  "subject-for-non-primitive-tokens": {
    description:
      "The subject segment is mandatory for semantic or component tokens but absent in primitive tokens. Subjects should be the second segment, that can be any name, but not a type.",
    validate: (name: string) => {
      const segments = name.split(".");
      const isPrimitive = segments.length === 3;
      const [_layer, subject] = segments;
      return isPrimitive || (!!subject && !isTokenType(subject))
        ? validationResult(true)
        : validationError(
            `Token ${name} is missing a subject segment. ${subject} is not a valid subject name`,
            [subject]
          );
    },
  },
  "attribute-segments": {
    description:
      "The fourth segment and subsequent segments can be anything the designers want to use to distinguish tokens.",
    validate: (name: string) => {
      const segments = name.split(".");
      const isPrimitive = segments.length === 3;
      const hasAttributes = segments.length > 3;
      return isPrimitive || hasAttributes
        ? validationResult(true)
        : validationError(`Token ${name} is missing attribute segments`);
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
            "Segments should be in lowercase or camelCase, or an expression if it's the last segment",
            segments.filter((s) => !isCamelCase(s))
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
  "no-leading-or-trailing-dots": {
    description: "Token names must not start or end with a dot",
    validate: (name: string) => {
      return !name.startsWith(".") && !name.endsWith(".")
        ? validationResult(true)
        : validationError("Token names must not start or end with a dot");
    },
  },
  "length-constraints": {
    description:
      "Each segment within a token name should be between 1 to 20 characters long",
    validate: (name: string) => {
      const segments = name.split(".");
      return segments.every((s) => s.length >= 1 && s.length <= 20)
        ? validationResult(true)
        : validationError(
            "Each segment within a token name should be between 1 to 20 characters long"
          );
    },
  },
  "no-consecutive-dots": {
    description: "Multiple consecutive dots (`..`) are not allowed",
    validate: (name: string) => {
      return name.includes("..")
        ? validationError("Multiple consecutive dots (`..`) are not allowed")
        : validationResult(true);
    },
  },
  "consistent-type-naming": {
    description:
      "The third segment of the token name (or the second in the case of primitive tokens) must indicate the token type. Types should be drawn from a predefined list.",
    validate: (name: string) => {
      const segments = name.split(".");
      const tokenType = segments.length === 3 ? "primitive" : "semantic";
      const segment = tokenType === "primitive" ? segments[1] : segments[2];
      return isTokenType(segment)
        ? validationResult(true)
        : validationError(
            `The ${tokenType} token ${name} has an invalid type '${segment}'. Valid types can be found in the Widget documentation`
          );
    },
  },
  "modes-unique-to-collections": {
    description:
      "Ensure that modes are unique to each collection to avoid conflicts and maintain semantic consistency within the collection.",
    type: "global",
    validate: (
      collections: TokenNameCollection[]
    ): TokenGlobalRuleValidationResult => {
      // returns an object with modes as keys and an array of collections names as values
      const collectionsByMode = collections.reduce(
        (acc, collection) => {
          if (!collection.modes) return acc;
          return collection.modes.reduce((acc, mode) => {
            return {
              ...acc,
              [mode]: [...(acc[mode] || []), collection.name],
            };
          }, acc);
        },
        {} as Record<string, string[]>
      );

      const duplicates = Object.entries(collectionsByMode)
        .filter(([_mode, collections]) => collections.length > 1)
        .map(([mode, collections]) => ({
          mode,
          collections,
        }));
      return duplicates.length === 0
        ? []
        : globalValidationError(
            `Modes should be unique to each collection. Found duplicate modes in ${duplicates
              .flatMap((d) => d.collections)
              .join(", ")}`,
            []
          );
    },
  },
  "same-prefix-for-collections": {
    description:
      "Ensure that all tokens within a collection share a common prefix to facilitate filtering and grouping.",
    type: "global",
    validate: (
      collections: TokenNameCollection[]
    ): TokenGlobalRuleValidationResult => {
      const collectionPrefixes = collections.map((collection) => {
        const prefixes = collection.tokens.map(
          (token) => token.name.split(".")[0]
        );
        return { name: collection.name, prefixes };
      });
      const heterogenousPrefixes = collectionPrefixes.filter(({ prefixes }) => {
        return new Set(prefixes).size > 1;
      });
      return heterogenousPrefixes.length === 0
        ? []
        : globalValidationWarning(
            `Collections should have a common prefix. Found heterogenous prefixes in ${heterogenousPrefixes
              .map((h) => h.name)
              .join(", ")}`,
            []
          );
    },
  },
  "subjects-unique-to-layers": {
    description:
      "Avoid using the same subject name across different layers to prevent confusion and maintain clarity and proper semantics in the design language.",
    type: "global",
    validate: (
      collections: TokenNameCollection[]
    ): TokenGlobalRuleValidationResult => {
      const subjectsByLayer = collections.reduce(
        (acc, collection) => {
          if (collection.tokens.every((token) => isPrimitiveToken(token.name)))
            return acc;
          const subjects = collection.tokens.map((token) =>
            getSubject(token.name)
          );
          return {
            ...acc,
            [collection.name]: subjects,
          };
        },
        {} as Record<string, string[]>
      );
      const layersBySubject = invertGroupedObject(subjectsByLayer);
      const duplicates = Object.entries(layersBySubject).filter(
        ([_subject, layers]) => layers.length > 1
      );
      return duplicates.length === 0
        ? []
        : globalValidationWarning(
            `Subjects should be unique to each layer. Found duplicate subjects in ${duplicates
              .flatMap((d) => d[1])
              .join(", ")}`,
            []
          );
    },
  },
  "attributes-used-sparingly": {
    description:
      "Use attributes only when necessary to prevent overcomplicating the token structure.",
    type: "global",
    validate: (
      collections: TokenNameCollection[]
    ): TokenGlobalRuleValidationResult => {
      console.log("RULE: attributes-used-sparingly 1");
      const flatCollectionOfTokens = collections.reduce(
        (acc, collection) => [...acc, ...collection.tokens],
        [] as TokenNameCollection["tokens"]
      );
      console.log("RULE: attributes-used-sparingly 2", flatCollectionOfTokens);
      const maxNumberOfSegments = Math.max(
        ...flatCollectionOfTokens.map((token) => token.name.split(".").length)
      );
      console.log("RULE: attributes-used-sparingly 3", maxNumberOfSegments);

      const indistinguisedAttributes = new Array(maxNumberOfSegments - 3)
        .fill(0)
        .map((_, i) => {
          const tokensByFirstNSegments = groupByFirstNSegments(
            i + 4,
            collections
          );
          console.log(
            "RULE: attributes-used-sparingly 4",
            tokensByFirstNSegments
          );
          return Object.entries(tokensByFirstNSegments)
            .filter(([_, { count }]) => count === 1)
            .map(
              ([firstSegments, { nextSegment }]) =>
                `${firstSegments}.${nextSegment}`
            );
        })
        .flat();
      console.log(
        "RULE: attributes-used-sparingly 5",
        indistinguisedAttributes
      );
      return indistinguisedAttributes.length === 0
        ? []
        : globalValidationWarning(
            `Attributes should be used sparingly. Found attributes that do not distinguish tokens: ${indistinguisedAttributes.join(", ")}`,
            []
          );
    },
  },
  "repetition-of-information": {
    description:
      "Avoid repeating the same information in different segments to keep token names concise and clear.",
    validate: (name: string) => {
      const segmentCollection = toKebabCase(name).split("-");
      const duplicateItems = segmentCollection.filter(
        (item, index) => segmentCollection.indexOf(item) !== index
      );
      return duplicateItems.length === 0
        ? validationResult(true)
        : validationWarning(
            `Repetition of information should be avoided. Found redundant information in token Name: ${duplicateItems.join(", ")}`,
            duplicateItems
          );
    },
  },
  "avoid-generic-types": {
    description:
      "Avoid generic types like color or spacing when more specific types can be used.",
    validate: (name: string) => {
      const segments = name.split(".");
      const attributeSegments = segments.slice(3);
      if (attributeSegments.length === 0) return validationResult(true);
      const genericTypes = ["color", "spacing"];
      const tokenType = segments[2];
      const moreSpecificName = attributeSegments.find((segment) =>
        isTokenType(segment)
      );
      return genericTypes.includes(tokenType) && moreSpecificName
        ? validationWarning(
            `Avoid generic types like 'color' or 'spacing' when better names are available. Consider using more specific names: ${tokenType} -> ${moreSpecificName}`,
            [moreSpecificName]
          )
        : validationResult(true);
    },
  },
  "primitive-tokens-no-aliases": {
    description:
      "Primitive tokens should be direct values and not contain aliases to other tokens to maintain simplicity and directness.",
    type: "global",
    validate: (
      collections: TokenNameCollection[]
    ): TokenGlobalRuleValidationResult => {
      const primitiveTokens = collections
        .filter(
          (collection) =>
            collection.name === "primitive" ||
            collection.tokens.every((token) => isPrimitiveToken(token.name))
        )
        .flatMap((collection) => collection.tokens);
      const aliases = primitiveTokens.filter((token) => token.alias);
      return aliases.length === 0
        ? []
        : globalValidationWarning(
            `Primitive tokens should not contain aliases. Found aliases in ${aliases
              .map((a) => a.name)
              .join(", ")}`,
            []
          );
    },
  },
  "non-primitive-tokens-no-arbitrary-values": {
    description:
      "Non-primitive tokens should reference primitive tokens to maintain consistency and avoid arbitrary values.",
    type: "global",
    validate: (
      collections: TokenNameCollection[]
    ): TokenGlobalRuleValidationResult => {
      const nonPrimitiveTokens = collections
        .filter(
          (collection) =>
            collection.name !== "primitive" &&
            collection.tokens.some((token) => !isPrimitiveToken(token.name))
        )
        .flatMap((collection) => collection.tokens);
      const arbitraryValues = nonPrimitiveTokens.filter(
        (token) => !isPrimitiveToken(token.name) && !token.alias
      );
      return arbitraryValues.length === 0
        ? []
        : globalValidationWarning(
            `Non-primitive tokens should only contain references to primitive values. Found arbitrary values in ${arbitraryValues
              .map((a) => a.name)
              .join(", ")}`,
            []
          );
    },
  },
});
