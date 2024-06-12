import { describe, expect, it } from "vitest";
import {
  calculateSubjectsFromProps,
  inferVariableType,
  combineComponentUsage,
} from "./token.utils";
import { ComponentUsage } from "./token.types";
import { getFormat, radiusLayerSubjectTypeFormat } from "../formats";

describe("calculateSubjectsFromProps", () => {
  const getSubjects = calculateSubjectsFromProps(
    getFormat("radius-layer-subject-type") ?? radiusLayerSubjectTypeFormat
  );

  it("should return an array of subjects from component props", () => {
    const componentProps = [
      "semantic.static.color.primary",
      "density.static.size.lg",
      "density.action.margin.sm",
      "semantic.action.color.secondary",
    ];

    const subjects = getSubjects(componentProps);
    expect(subjects).toEqual(["static", "action"]);
  });

  it("should return an empty array if component props is empty", () => {
    const componentProps: string[] = [];
    const subjects = getSubjects(componentProps);
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
    const getTokenType = inferVariableType(
      getFormat("radius-layer-subject-type") ?? radiusLayerSubjectTypeFormat
    );
    const type = getTokenType(variable);
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
