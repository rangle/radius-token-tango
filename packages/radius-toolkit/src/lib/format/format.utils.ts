import {
  TokenGlobalRuleValidationResult,
  TokenNameValidationResult,
  TokenRuleSet,
} from "./format.types";

export const isFraction = (s: string) => /^\d+\/\d+$/.test(s);

export const isNumber = (s: string) => !isNaN(Number(s));

export const isNumberOrFraction = (s: string) => isNumber(s) || isFraction(s);

export const isCamelCase = (s: string) =>
  /^[a-z0-9]+(?:[A-Z][a-z0-9]*)*$/.test(s) && !/[A-Z]{2}/.test(s);

/** convert names to kebab-case in case they come as CamelCase or pascalCase */
export const toKebabCase = (s: string) =>
  s
    .replace(/\./g, "-")
    .replace(/[^A-Za-z0-9_-]/g, " ")
    .replace(/([A-Z]+)/g, " $1")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase()
    .replace(/\s/g, "-")
    .replace(/--/g, "-");

export const validationResult = (
  result: boolean,
  message?: string,
  offendingSegments?: string[]
): TokenNameValidationResult => {
  return [result, message || "", offendingSegments || []] as const;
};

export const validationError = (
  message: string,
  offendingSegments?: string[]
): TokenNameValidationResult => {
  return [false, message || "", offendingSegments || []] as const;
};

export const validationWarning = (
  message: string,
  offendingSegments?: string[]
): TokenNameValidationResult => {
  return [true, message || "", offendingSegments || []] as const;
};

export const globalValidationError = (
  message: string,
  offendingSegments?: [
    collectionName: string,
    tokenName: string,
    segmentName: string,
  ][]
): TokenGlobalRuleValidationResult => {
  return [message, false, offendingSegments || []] as const;
};

export const globalValidationWarning = (
  message: string,
  offendingSegments?: [
    collectionName: string,
    tokenName: string,
    segmentName: string,
  ][]
): TokenGlobalRuleValidationResult => {
  return [message, true, offendingSegments || []] as const;
};

/// Inverts a grouped object where the keys are group names and the values are the group members
export const invertGroupedObject = <T extends Record<string, string[]>>(
  groups: T
) =>
  Object.entries(groups).reduce(
    (acc, [groupName, groupValues]) => {
      groupValues.forEach((value) => {
        acc[value] = [...(acc[value] || []), groupName];
      });
      return acc;
    },
    {} as Record<string, string[]>
  );

export const ruleSet = <T extends string>(rules: TokenRuleSet<T>) => rules;
