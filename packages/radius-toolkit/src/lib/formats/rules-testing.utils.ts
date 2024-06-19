import { test, expect } from "vitest";
import { TokenRuleSet, isTokenGlobalNameRule } from "./format.types";

export type RuleTest<T extends string = string> = {
  input: string;
  errors?: (keyof TokenRuleSet<T>)[];
  warnings?: (keyof TokenRuleSet<T>)[];
};

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
        const { input, errors, warnings } = tokenNameTest;
        test(`Rule ${ruleName} should validate ${input}`, () => {
          const [ok, msg] = rule.validate(input, "");
          if (!ok) {
            expect(errors, "to expect errors").toBeTruthy();
            expect(
              errors?.length,
              "to expect at least one error"
            ).toBeGreaterThan(0);
            const err = errors?.find((e) => e === ruleName);
            expect(msg, "to have an error message").toBeTruthy();
            expect(err, "to have the correct error").toBe(ruleName);
          } else {
            const err = errors?.find((e) => e === ruleName);
            const warn = warnings?.find((e) => e === ruleName);
            expect(err, "to expect no errors").toBeUndefined();
            if (warn) {
              expect(warn, "to have the correct warning").toBe(ruleName);
            } else {
              expect(msg, "to have no warnings").toBeFalsy();
            }
            expect(ok, "to have passed").toBe(true);
          }
        });
      });
    });
  };
};
