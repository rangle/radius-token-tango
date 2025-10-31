import { describe, it, expect } from "vitest";
import { semVerBump } from "./layer-diff.utils.js";

describe("semVerBump function", () => {

  describe("when the version is less than 1.0.0", () => {

    it("should bump patch version when there are additions", () => {
      expect(semVerBump("0.1.0", [true, false, false])).toBe("0.1.1");
    });

    it("should bump patch version when there are modifications", () => {
      expect(semVerBump("0.0.0", [false, true, false])).toBe("0.0.1");
    });

    it("should bump minor version when there are breaking changes", () => {
      expect(semVerBump("0.0.0", [false, false, true])).toBe("0.1.0");
      expect(semVerBump("0.1.0", [false, false, true])).toBe("0.2.0");
    });

    it("should not bump version when there are no changes", () => {
      expect(semVerBump("0.0.0", [false, false, false])).toBe("0.0.0");
      expect(semVerBump("0.1.0", [false, false, false])).toBe("0.1.0");
    });

    it("should handle multiple changes correctly", () => {
      expect(semVerBump("0.1.8", [true, true, false])).toBe("0.1.9");
      expect(semVerBump("0.0.3", [true, true, true])).toBe("0.1.0");
    });

  });

  describe("when the version is equal to or greater than 1.0.0", () => {

    it("should bump minor version when there are additions", () => {
      expect(semVerBump("1.0.0", [true, false, false])).toBe("1.1.0");
    });

    it("should bump patch version when there are modifications", () => {
      expect(semVerBump("1.1.0", [false, true, false])).toBe("1.1.1");
    });

    it("should bump major version when there are breaking changes", () => {
      expect(semVerBump("1.1.0", [false, false, true])).toBe("2.0.0");
      expect(semVerBump("2.1.0", [false, false, true])).toBe("3.0.0");
    });

    it("should not bump version when there are no changes", () => {
      expect(semVerBump("1.1.0", [false, false, false])).toBe("1.1.0");
      expect(semVerBump("2.1.0", [false, false, false])).toBe("2.1.0");
    });

    it("should handle multiple changes correctly", () => {
      expect(semVerBump("2.1.0", [true, true, false])).toBe("2.2.0");
      expect(semVerBump("2.1.0", [true, true, true])).toBe("3.0.0");
    });
  });
});
