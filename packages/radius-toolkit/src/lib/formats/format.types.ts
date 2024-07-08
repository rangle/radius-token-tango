import { TokenVariable } from "../tokens/token.types";
import { TokenNameDescription } from "./token-name-format.types";

/**
 * Token Value or Alias
 */
export type TokenValue =
  | {
      value: TokenVariable["value"];
    }
  | {
      alias: string;
    };

/**
 * Token Name
 */
export type TokenName = {
  name: string;
  type: string;
  values?: Record<string, TokenValue>;
};

/**
 * Token Name Collection
 */
export type TokenNameCollection = {
  name: string;
  modes: string[];
  tokens: TokenName[];
};

export const isTokenNameCollection = (o: unknown): o is TokenNameCollection =>
  !!o &&
  typeof o === "object" &&
  "name" in o &&
  "tokens" in o &&
  Array.isArray((o as TokenNameCollection).tokens);

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

/** Token Validation Result
 * A result of a token name validation
 * */
export type TokenValidationResult = {
  collection: string;
  token: TokenName;
  isWarning: boolean;
  message: string;
  offendingSegments: string[];
};

export const isTokenValidationResult = (
  result: TokenValidationResult | GlobalValidationResult
): result is TokenValidationResult =>
  (result as TokenValidationResult).collection !== undefined &&
  (result as TokenValidationResult).token !== undefined;

/** Global Validation Result
 * A result of a token name validation
 * */
export type GlobalValidationResult = {
  isWarning: boolean;
  message: string;
  offendingSegments: [
    collectopnName: string,
    tokenName?: string,
    segmentName?: string,
  ][];
};

export const isGlobalValidationResult = (
  result: TokenValidationResult | GlobalValidationResult
): result is GlobalValidationResult =>
  (result as TokenValidationResult).collection === undefined &&
  (result as TokenValidationResult).token === undefined;

/** FormatValidationResult
 */
export type FormatValidationResult =
  | TokenValidationResult
  | GlobalValidationResult;

export const isFormatValidationResult = (
  result: unknown
): result is FormatValidationResult =>
  typeof result === "object" &&
  result !== null &&
  "isWarning" in result &&
  "message" in result &&
  "offendingSegments" in result;

/** Token Rule Validation Function
 * A function that validates a token name
 * @param name The token name to validate
 * @returns A tuple with the first element indicating if the token name is valid
 * and the second element providing a message if the token name is invalid
 * and the third element providing a list of offending segments
 * if a message is returned but the first element is true, consider the message as a warning
 * */
export type TokenRuleValidationFunction = (
  name: string, // The token name to validate
  type: string // The token type
) => TokenNameValidationResult;

/** Token Global Rule validation function
 * A function that validates collections of token names
 * @param collections The token name collections to validate
 * @returns An array of tuples representing every error or warning found in the collections. if all collections are valid, the array will be empty
 * each error or warning is represented by a tuple with the first element indicating the collection name, the second the token name, the third element indicating the message and the fourth indicating the offending segments
 * */
export type TokenGlobalRuleValidationFunction = (
  collections: TokenNameCollection[]
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

export const isTokenNameRule = (
  rule: TokenNameRule | TokenGlobalNameRule
): rule is TokenNameRule => (rule as TokenGlobalNameRule).type === undefined;

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

/**
 * Decompose Token Name
 * returns an object with segments identified by their name
 */

export type DecomposeTokenName = (name: string) => TokenNameDescription | null;

/** Token Name Format Type
 * Describes the format of a token name
 */
export type TokenNameFormatType<FormatName = string> = {
  name: FormatName;
  description: string;
  version: string;
  segments: string[];
  separator: string;
  decomposeTokenName: DecomposeTokenName;
  rules?: TokenRuleSet;
};

/** Token Name Format Type
 * Describes the format of a token name
 */
export type TokenNamePortableFormatType<FormatName = string> = {
  name: FormatName;
  description: string;
  version: string;
  segments: string[];
  separator: string;
};

export const isTokenNameFormatType = (
  format: unknown
): format is TokenNameFormatType =>
  typeof format === "object" &&
  format !== null &&
  "name" in format &&
  "description" in format &&
  "version" in format &&
  "segments" in format &&
  "separator" in format &&
  "decomposeTokenName" in format;

export const isTokenNamePortableFormatType = (
  format: unknown
): format is TokenNamePortableFormatType =>
  typeof format === "object" &&
  format !== null &&
  "name" in format &&
  "description" in format &&
  "version" in format &&
  "segments" in format &&
  "separator" in format;
