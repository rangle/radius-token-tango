import { test, expect } from "vitest";
import oldTokenLayers from "../__mocks__/token-layers";
import { toTokenValues } from "./library.services";

test("toTokenValues", () => {
  const tokenName = "background";
  console.log(toTokenValues);
  const result = toTokenValues(tokenName, oldTokenLayers.layers);
  expect(result).toMatchObject({
    "Colour Semantics": {
      value: "rgba(255, 255, 255, 0.00)",
    },
  });
});
