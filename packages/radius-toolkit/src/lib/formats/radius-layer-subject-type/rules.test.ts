import { describe, expect, it } from "vitest";
import { rules } from "./rules";
import { ruleTestValues } from "../rules-testing.utils";

export const testValidValues = ruleTestValues([
  { input: "primitive.accentColor.auto" },
  { input: "primitive.animation.none" },
  { input: "primitive.animation.spin" },
  { input: "primitive.animation.ping" },
  { input: "primitive.animation.pulse" },
  { input: "primitive.animation.bounce" },
  { input: "primitive.aria.checked" },
  { input: "primitive.listStyleType.disc" },
  { input: "primitive.listStyleType.decimal" },
  { input: "primitive.margin.auto" },
  { input: "primitive.maxHeight.full" },
  { input: "primitive.maxWidth.none" },
  { input: "primitive.maxWidth.full" },
  { input: "primitive.minHeight.full" },
  { input: "primitive.minWidth.full" },
  { input: "semantic.action.opacity.100" },
  { input: "semantic.action.outlineColor.blue" },
  { input: "semantic.action.padding.primary.xs" },
  { input: "semantic.action.padding.primary.sm" },
  { input: "component.button.spacing.primary.sm" },
  { input: "component.button.spacing.primary.md" },
  { input: "component.button.spacing.primary.lg" },
  { input: "component.button.spacing.secondary.sm" },
  { input: "component.button.spacing.secondary.md" },
  { input: "component.button.spacing.secondary.lg" },
  { input: "someLayer.genericSubject.animation.slow" },
  { input: "someLayer.genericSubject.width.1/2" },
  { input: "someLayer.genericSubject.width.2" },
  { input: "someLayer.genericSubject.width.2xl" },
  { input: "someLayer.genericSubject.width.1.5" },
]);

export const testInvalidValues = ruleTestValues<keyof typeof rules>([
  {
    input: "someLayer.genericSubject.invalidType.attribute",
    errors: ["consistent-type-naming"],
  },
  {
    input: "someLayer.genericSubject.animation.∞ as you know",
    errors: ["lowercase-or-camelcase"],
  },
  {
    input: "animation",
    errors: [
      "minimum-three-segments",
      "dot-separation",
      "layer-as-first-segment",
      "subject-for-non-primitive-tokens",
      "attribute-segments",
      "consistent-type-naming",
    ],
  },
  {
    input: "animation.NONE.none.none",
    errors: [
      "lowercase-or-camelcase",
      "consistent-type-naming",
      "layer-as-first-segment",
    ],
    warnings: ["repetition-of-information"],
  },
  {
    input: "animation.withOneVeryLongSegmentNameToTestTheRule",
    errors: [
      "length-constraints",
      "minimum-three-segments",
      "consistent-type-naming",
      "layer-as-first-segment",
    ],
  },
  {
    input: "animation.with..consecutive.dots",
    errors: [
      "no-consecutive-dots",
      "lowercase-or-camelcase",
      "length-constraints",
      "layer-as-first-segment",
      "consistent-type-naming",
    ],
  },
  {
    input: ".animation.with.more.dots.and.lots.of.errors",
    errors: [
      "no-leading-or-trailing-dots",
      "consistent-type-naming",
      "lowercase-or-camelcase",
      "length-constraints",
      "layer-as-first-segment",
      "subject-for-non-primitive-tokens",
    ],
  },
]);

describe("test rules: radius-layer-subject-type", () => {
  it("should have a valid rule set", () => {
    expect(rules).toBeTruthy();
    const ruleEntries = Object.entries(rules);
    expect(ruleEntries).toHaveLength(18);
  });

  testValidValues(rules);
  testInvalidValues(rules);
});
