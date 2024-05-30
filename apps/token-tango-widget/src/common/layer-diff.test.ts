import { describe, it } from "node:test";
import { expect } from "expect";
import { semVerBump } from "./layer-diff.utils.js";

describe("semVerBump function", () => {
  it("should bump minor version when there are additions", () => {
    expect(semVerBump("0.0.0", [true, false, false])).toBe("0.1.0");
  });

  it("should bump minor version when there are modifications", () => {
    expect(semVerBump("0.1.0", [false, true, false])).toBe("0.1.1");
  });

  it("should bump major version when there are breaking changes", () => {
    expect(semVerBump("0.0.0", [false, false, true])).toBe("0.1.0");
    expect(semVerBump("0.1.0", [false, false, true])).toBe("0.2.0");
    expect(semVerBump("1.1.0", [false, false, true])).toBe("1.0.0");
    expect(semVerBump("2.1.0", [false, false, true])).toBe("3.0.0");
  });

  it("should not bump version when there are no changes", () => {
    expect(semVerBump("0.0.0", [false, false, false])).toBe("0.0.0");
    expect(semVerBump("0.1.0", [false, false, false])).toBe("0.1.0");
    expect(semVerBump("1.1.0", [false, false, false])).toBe("1.1.0");
    expect(semVerBump("2.1.0", [false, false, false])).toBe("2.1.0");
  });

  it("should handle multiple changes correctly", () => {
    expect(semVerBump("2.1.0", [true, true, false])).toBe("2.2.0");
    expect(semVerBump("2.1.0", [true, true, true])).toBe("3.0.0");
  });
});
