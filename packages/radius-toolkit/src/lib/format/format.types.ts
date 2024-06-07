/**
 * Token Name
 */
export type TokenName = {
  name: string;
  alias?: string;
};

/**
 * Token Name Collection
 */
export type TokenNameCollection = {
  name: string;
  modes?: string[];
  tokens: TokenName[];
};

export type TokenNameValidationResult =
  | readonly [isValid: true] // ok
  | readonly [isValid: boolean, message: string] // error or warning
  | readonly [isValid: boolean, message: string, offendingSegments: string[]]; // error or warning with offending segments

export type TokenGlobalRuleValidationResult =
  | readonly []
  | readonly [message: string]
  | readonly [
      message: string,
      isWarning: boolean,
      offendingSegments: [
        collectionName: string,
        tokenName?: string,
        segmentName?: string,
      ][],
    ];

/** Token Rule Validation Function
 * A function that validates a token name
 * @param name The token name to validate
 * @returns A tuple with the first element indicating if the token name is valid
 * and the second element providing a message if the token name is invalid
 * and the third element providing a list of offending segments
 * if a message is returned but the first element is true, consider the message as a warning
 * */
export type TokenRuleValidationFunction = (
  name: string
) => TokenNameValidationResult;

/** Token Global Rule validation function
 * A function that validates collections of token names
 * @param collections The token name collections to validate
 * @returns An array of tuples representing every error or warning found in the collections. if all collections are valid, the array will be empty
 * each error or warning is represented by a tuple with the first element indicating the collection name, the second the token name, the third element indicating the message and the fourth indicating the offending segments
 * */
export type TokenGlobalRuleValidationFunction = (
  collection: TokenNameCollection[]
) => TokenGlobalRuleValidationResult;

/** Token Rule
 * Describes a rule that a token name must follow
 */
export type TokenNameRule = {
  description: string;
  /// Validates a token name
  validate: TokenRuleValidationFunction;
};

/** Token Global Rule
 * Describes a rule that a token name must follow
 */
export type TokenGlobalNameRule = {
  description: string;
  type: "global";
  /// Validates token names in collections
  validate: TokenGlobalRuleValidationFunction;
};

export const isTokenGlobalNameRule = (
  rule: TokenNameRule | TokenGlobalNameRule
): rule is TokenGlobalNameRule =>
  (rule as TokenGlobalNameRule).type === "global";

/**
 * Token Rule Set
 * A set of rules that describe how token names should be formatted
 */
export type TokenRuleSet<T extends string = string> = Record<
  T,
  TokenNameRule | TokenGlobalNameRule
>;

/** Token Name Format Type
 * Describes the format of a token name
 */
export type TokenNameFormatType = {
  name: string;
  description: string;
  version: string;
  segments: string[];
  separator: string;
  rules: TokenRuleSet;
};
