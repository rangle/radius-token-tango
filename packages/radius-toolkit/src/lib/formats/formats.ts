import { radiusSimpleFormat } from "./radius-simple";
import { radiusLayerSubjectTypeFormat } from "./radius-layer-subject-type";
import {
  TokenNameCollection,
  TokenNameFormatType,
  TokenNamePortableFormatType,
  isTokenGlobalNameRule,
  isTokenNameRule,
  toTokenNameFormatType,
} from "./format.types";

import { createLogger } from "../utils/logging.utils";

const log = createLogger("lib:formats");

export const formats = [
  radiusLayerSubjectTypeFormat,
  radiusSimpleFormat,
] as const;

export type FormatName = (typeof formats)[number]["name"];

export const formatNames: FormatName[] = formats.map((format) => format.name);

export const getFormat = (
  formatName: FormatName
): TokenNamePortableFormatType | undefined => {
  return formats.find((format) => format.name === formatName);
};

export const createValidators = (formatName: FormatName) => {
  const format = getFormat(formatName);
  if (!format) {
    throw new Error(`Format ${formatName} not found`);
  }
  const formatType = toTokenNameFormatType(format);
  return createValidatorFunctions(formatType);
};

export const splitBy =
  <A, B>(
    predicate: (value: A | B) => value is A,
    otherPredicate: (value: A | B) => value is B
  ) =>
  (arr: (A | B)[]) => {
    return arr.reduce<[A[], B[]]>(
      (res, value) => {
        const [as, bs] = res;
        if (predicate(value)) {
          return [[...as, value as A], bs];
        } else if (otherPredicate(value)) {
          return [as, [...bs, value as B]];
        } else return res;
      },
      [[], []] as [A[], B[]]
    );
  };

const splityGlobalRules = splitBy(isTokenGlobalNameRule, isTokenNameRule);

export type TokenNameIssue = {
  message?: string;
  isWarning?: boolean;
  offendingSegments?: string[];
};

export type TokenGlobalIssue = {
  message?: string;
  isWarning?: boolean;
  offendingSegments?: [
    collectionName: string,
    tokenName?: string | undefined,
    segmentName?: string | undefined,
  ][];
};

export const createValidatorFunctions = (format: TokenNameFormatType) => {
  const allRules = Object.values(format.rules ?? []);
  const [globalRules, rules] = splityGlobalRules(allRules);

  return [
    function validateTokenName(
      tokenName: string,
      tokenType: string
    ): [errors: TokenNameIssue[], warnings: TokenNameIssue[]] {
      const [errors, warnings] = rules.reduce<
        [TokenNameIssue[], TokenNameIssue[]]
      >(
        (acc, rule) => {
          const [errors, warnings] = acc;
          const [isValid, message, offendingSegments] = rule.validate(
            tokenName,
            tokenType
          );
          if (!isValid && message) {
            return [
              [
                ...errors,
                {
                  message,
                  offendingSegments: Array.isArray(offendingSegments)
                    ? offendingSegments
                    : undefined,
                },
              ],
              warnings,
            ];
          } else if (message) {
            return [
              errors,
              [
                ...warnings,
                {
                  message,
                  offendingSegments: Array.isArray(offendingSegments)
                    ? offendingSegments
                    : undefined,
                },
              ],
            ];
          }
          return [errors, warnings];
        },
        [[], []] as [TokenNameIssue[], TokenNameIssue[]]
      );
      return [errors, warnings] as const;
    },
    function validateTokenCollections(
      tokenCollections: TokenNameCollection[]
    ): [errors: TokenGlobalIssue[], warnings: TokenGlobalIssue[]] {
      log("debug", "validating token collections", tokenCollections.length);
      const [errors, warnings] = globalRules.reduce<
        [TokenGlobalIssue[], TokenGlobalIssue[]]
      >(
        (acc, rule) => {
          log("debug", "validating global rule", rule);
          const [errors, warnings] = acc;
          const [message, isWarning, offendingSegments] =
            rule.validate(tokenCollections);
          log(
            "debug",
            "global rule result",
            message,
            isWarning,
            offendingSegments
          );
          if (message && !isWarning) {
            return [[...errors, { message, offendingSegments }], warnings];
          } else if (message) {
            return [errors, [...warnings, { message, offendingSegments }]];
          }
          return [errors, warnings];
        },
        [[], []] as [TokenGlobalIssue[], TokenGlobalIssue[]]
      );
      return [errors, warnings] as const;
    },
  ] as const;
};
