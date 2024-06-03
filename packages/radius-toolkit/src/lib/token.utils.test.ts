import { describe, expect, it } from "vitest";
import {
  isCamelCase,
  TokenError,
  validateTokenName,
  calculateSubjectsFromProps,
  inferVariableType,
  combineComponentUsage,
} from "./token.utils";
import { ComponentUsage } from "./token.types";

describe("isCamelCase", () => {
  it("should return true for valid camel case strings", () => {
    expect(isCamelCase("test")).toBe(true);
    expect(isCamelCase("testNoveo")).toBe(true);
    expect(isCamelCase("nodaSmellSa")).toBe(true);
  });

  it("should return false for invalid camel case strings", () => {
    expect(isCamelCase("test noveo")).toBe(false);
    expect(isCamelCase("test_")).toBe(false);
    expect(isCamelCase("Dstest")).toBe(false);
    expect(isCamelCase("nodaSSmellSa")).toBe(false);
    expect(isCamelCase("NADA")).toBe(false);
  });
});

describe("validateTokenName", () => {
  it("should return valid for a valid token name", () => {
    const name = "density.static.color.primary";
    const [theName, valid, errors] = validateTokenName(name);
    expect(theName).toBe(name);
    expect(valid).toBe(true);
    expect(errors).toHaveLength(0);
  });

  it("should return invalid for an invalid token name", () => {
    const name = "color";
    const [theName, valid, errors] = validateTokenName(name);
    expect(theName).toBe(name);
    expect(valid).toBe(false);
    expect(errors).toHaveLength(3);
    expect(errors[0]).toMatchObject<Partial<TokenError>>({
      key: "two-segments",
    });
  });
});

describe("calculateSubjectsFromProps", () => {
  it("should return an array of subjects from component props", () => {
    const componentProps = [
      "semantic.static.color.primary",
      "density.static.size.lg",
      "density.action.margin.sm",
      "semantic.action.color.secondary",
    ];
    const subjects = calculateSubjectsFromProps(componentProps);
    expect(subjects).toEqual(["static", "action"]);
  });

  it("should return an empty array if component props is empty", () => {
    const componentProps: string[] = [];
    const subjects = calculateSubjectsFromProps(componentProps);
    expect(subjects).toEqual([]);
  });
});

describe("inferVariableType", () => {
  it("should infer the variable type based on the token variable", () => {
    const variable = {
      name: "color.primary",
      value: "#FF0000",
      type: "color",
    };
    const type = inferVariableType(variable);
    expect(type).toBe("color");
  });
});

describe("combineComponentUsage", () => {
  it("should combine two component usages into a single usage", () => {
    const usageA: ComponentUsage = {
      id: "1",
      name: "Button",
      props: [
        {
          name: "size",
          value: "large",
          from: "variable",
        },
      ],
      children: [],
    };
    const usageB: ComponentUsage = {
      id: "1",
      name: "Button",
      props: [
        {
          name: "color",
          value: "secondary",
          from: "variable",
        },
      ],
      children: [],
    };
    const combinedUsage = combineComponentUsage(usageA, usageB);
    expect(combinedUsage).toEqual({
      id: "1",
      name: "Button",
      props: [
        {
          name: "size",
          value: "large",
          from: "variable",
        },
        {
          name: "color",
          value: "secondary",
          from: "variable",
        },
      ],
      children: [],
    });
  });
});
