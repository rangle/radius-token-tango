import { describe, it, expect } from "vitest";
import { isNumberOrFraction, isCamelCase } from "./format.utils";

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

describe("isNumberOrFraction", () => {
  it("should return true for valid numbers or fractions", () => {
    expect(isNumberOrFraction("123")).toBe(true);
    expect(isNumberOrFraction("1/2")).toBe(true);
    expect(isNumberOrFraction("1.2")).toBe(true);
  });

  it("should return false for invalid numbers or fractions", () => {
    expect(isNumberOrFraction("1/")).toBe(false);
    expect(isNumberOrFraction("1/2/3")).toBe(false);
    expect(isNumberOrFraction("1/2/")).toBe(false);
  });
});
