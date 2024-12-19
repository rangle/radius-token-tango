import { test, expect } from "vitest";
import {
  TokenRuleSet,
  isTokenGlobalNameRule,
  TokenNameValidationResult,
  TokenGlobalRuleValidationResult,
} from "./format.types";

// Define possible validation states for better type safety
type ValidationState = {
  hasError: boolean;
  hasWarning: boolean;
  message?: string;
  offendingSegments?: string[];
};

export type RuleTest<T extends string = string> = {
  input: string;
  errors?: (keyof TokenRuleSet<T>)[];
  warnings?: (keyof TokenRuleSet<T>)[];
};

/**
 * Analyzes a validation result and returns its state
 */
const getValidationState = (
  result: TokenNameValidationResult | TokenGlobalRuleValidationResult
): ValidationState => {
  // Handle empty global validation result
  if (Array.isArray(result) && result.length === 0) {
    return {
      hasError: false,
      hasWarning: false,
      message: "",
      offendingSegments: [],
    };
  }

  // Handle single element array (valid result)
  if (Array.isArray(result) && result.length === 1 && result[0] === true) {
    return {
      hasError: false,
      hasWarning: false,
      message: "",
      offendingSegments: [],
    };
  }

  // Handle two element array [isValid, message]
  if (Array.isArray(result) && result.length === 2) {
    const [isValid, message] = result;
    return {
      hasError: !isValid,
      hasWarning: false,
      message,
      offendingSegments: [],
    };
  }

  // Handle three element array [isValid, message, offendingSegments]
  if (Array.isArray(result) && result.length === 3) {
    const [isValid, message, offendingSegments] = result;

    return {
      hasError: !isValid,
      hasWarning: false,
      message: message as string,
      offendingSegments: offendingSegments as string[],
    };
  }

  // Handle four element array [isValid, message, offendingSegments, isWarning]
  if (
    Array.isArray(result) &&
    result.length === 4 &&
    typeof result[3] === "boolean"
  ) {
    const [isValid, message, offendingSegments, isWarning] = result;
    return {
      hasError: !isValid && !isWarning,
      hasWarning: isWarning,
      message,
      offendingSegments,
    };
  }

  // Default case - treat as invalid
  return {
    hasError: true,
    hasWarning: false,
    message: "Invalid validation result format",
    offendingSegments: [],
  };
};

/**
 * automatically runs a set of test cases for a given rule set
 */
export const ruleTestValues = <T extends string>(
  tokenNameTests: RuleTest<T>[]
) => {
  return (ruleSet: TokenRuleSet) => {
    const ruleEntries = Object.entries(ruleSet);

    ruleEntries.forEach(([ruleName, rule]) => {
      if (isTokenGlobalNameRule(rule)) {
        // TODO: Implement global rule tests
        return;
      }

      tokenNameTests.forEach((tokenNameTest) => {
        const {
          input,
          errors: expectedErrors = [],
          warnings: expectedWarnings = [],
        } = tokenNameTest;

        test(`Rule '${ruleName}' validating '${input}'`, () => {
          const result = rule.validate(input, "");
          const { hasError, hasWarning, message } = getValidationState(result);

          // Test for errors
          if (hasError) {
            expect(
              expectedErrors,
              `Rule '${ruleName}' should have triggered an error for '${input}'`
            ).toContain(ruleName);
            expect(message).toBeDefined();
          } else {
            expect(
              expectedErrors,
              `Rule '${ruleName}' should not have triggered an error for '${input}', but it did`
            ).not.toContain(ruleName);
          }

          // Test for warnings
          if (hasWarning) {
            expect(
              expectedWarnings,
              `Rule '${ruleName}' should have triggered a warning for '${input}'`
            ).toContain(ruleName);
          } else {
            expect(
              expectedWarnings,
              `Rule '${ruleName}' should not have triggered a warning for '${input}', but it did`
            ).not.toContain(ruleName);
          }
        });
      });
    });
  };
};
