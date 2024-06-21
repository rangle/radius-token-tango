import { radiusSimpleFormat } from "./radius-simple";
import { radiusLayerSubjectTypeFormat } from "./radius-layer-subject-type";
import {
  TokenNameCollection,
  TokenNameFormatType,
  isTokenGlobalNameRule,
  isTokenNameRule,
} from "./format.types";

export const formats = [
  radiusLayerSubjectTypeFormat,
  radiusSimpleFormat,
] as const;

export type FormatName = (typeof formats)[number]["name"];

export const formatNames: FormatName[] = formats.map((format) => format.name);

export const getFormat = (
  formatName: FormatName
): TokenNameFormatType | undefined => {
  return formats.find((format) => format.name === formatName);
};

export const createValidators = (formatName: FormatName) => {
  const format = getFormat(formatName);
  if (!format) {
    throw new Error(`Format ${formatName} not found`);
  }
  return createValidatorFunctions(format);
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
  offendingSegments?: string[];
};

export type TokenGlobalIssue = {
  message?: string;
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
    function validateTokenName(tokenName: string, tokenType: string) {
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
            return [[...errors, { message, offendingSegments }], warnings];
          } else if (message) {
            return [errors, [...warnings, { message, offendingSegments }]];
          }
          return [errors, warnings];
        },
        [[], []] as [TokenNameIssue[], TokenNameIssue[]]
      );
      return [errors, warnings];
    },
    function validateTokenCollections(tokenCollections: TokenNameCollection[]) {
      console.log("validating token collections", tokenCollections.length);
      const [errors, warnings] = globalRules.reduce<
        [TokenGlobalIssue[], TokenGlobalIssue[]]
      >(
        (acc, rule) => {
          console.log("validating global rule", rule);
          const [errors, warnings] = acc;
          const [message, isWarning, offendingSegments] =
            rule.validate(tokenCollections);
          console.log(
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
      return [errors, warnings];
    },
  ] as const;
};
