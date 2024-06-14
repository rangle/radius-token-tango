import { GithubFileDetails, findInPreviousPath } from "./github.utils";
import { describe, it, expect } from "vitest";

const fileDetails: GithubFileDetails = {
  content: "eyJ2YWx1ZSI6Im5vZGUifQ==",
  encoding: "base64",
  name: "code.js",
  path: "/dist/code.js",
  sha: "1234567890",
  size: 100,
  type: "file",
  url: "https://api.github.com/repos/octocat/Hello-World/contents/dist/code.js",
  download_url:
    "https://raw.githubusercontent.com/octocat/Hello-World/main/dist/code.js",
  html_url: "",
};

describe("findInPreviousPath", () => {
  it("should not find the substring, but the segment instead", () => {
    expect(
      findInPreviousPath("/dist/code.js", async (file) =>
        file === "/dist" ? fileDetails : undefined
      )
    ).resolves.toBeFalsy();
  });

  it("should resolve to 'dist' when the file path is '/dist/code.js' and the visit function returns 'dist'", () => {
    expect(
      findInPreviousPath("/dist/code.js", async (file) =>
        file === "dist" ? fileDetails : undefined
      )
    ).resolves.toMatch("dist");
  });

  it("should resolve to falsy when the file path is '//code/.js/s/23/.' and the visit function returns false", () => {
    expect(
      findInPreviousPath(
        "//code/.js/s/23/.",
        async (file) => (
          console.log(file), file === "dist" ? fileDetails : undefined
        )
      )
    ).resolves.toBeFalsy();
  });

  it("should resolve to '../../dist' when the file path is '../../dist/nas/files/img.jpg' and the visit function returns '../../dist'", () => {
    expect(
      findInPreviousPath(
        "../../dist/nas/files/img.jpg",
        async (file) => (
          console.log(file), file === "../../dist" ? fileDetails : undefined
        )
      )
    ).resolves.toMatch("../../dist");
  });

  it("should resolve to './code/package.json' when the file path is './code/package.json' and the visit function returns true", () => {
    expect(
      findInPreviousPath(
        "./code/package.json",
        async (file) => (
          console.log(file),
          file.endsWith("package.json") ? fileDetails : undefined
        )
      )
    ).resolves.toMatch("./code/package.json");
  });

  it("should resolve to 'dist' when the file path is '/dist/ code.js' and the visit function returns 'dist'", () => {
    expect(
      findInPreviousPath(
        "/dist/ code.js",
        async (file) => (
          console.log(file), file === "dist" ? fileDetails : undefined
        )
      )
    ).resolves.toMatch("dist");
  });

  it("should resolve to 'when/the/peace/says' when the file path is '/when/the/peace/says/there's/no/other/way/_code.js' and the visit function returns 'when/the/peace/says'", () => {
    expect(
      findInPreviousPath(
        "/when/the/peace/says/there's/no/other/way/_code.js",
        async (file) => (
          console.log(file),
          file === "when/the/peace/says" ? fileDetails : undefined
        )
      )
    ).resolves.toMatch("when/the/peace/says");
  });

  it("should resolve to 'when/the/peace/says' when the file path is 'when/the/peace/says/there's/no/other/way/_code.js' and the visit function returns 'when/the/peace/says'", () => {
    expect(
      findInPreviousPath(
        "when/the/peace/says/there's/no/other/way/_code.js",
        async (file) => (
          console.log(file),
          file === "when/the/peace/says" ? fileDetails : undefined
        )
      )
    ).resolves.toMatch("when/the/peace/says");
  });

  it("should resolve to 'when/the/peace/says' when the file path is '/when/the/peace/says/there's/no/other/way/_code.js' and the visit function returns 'when/the/peace/says/package.json'", () => {
    expect(
      findInPreviousPath(
        "/when/the/peace/says/there's/no/other/way/_code.js",
        async (file) => (
          console.log(`${file}/package.json`),
          `${file}/package.json` === "when/the/peace/says/package.json"
            ? fileDetails
            : undefined
        )
      )
    ).resolves.toMatch("when/the/peace/says");
  });

  it("should resolve to falsy when the file path contains a URL", () => {
    expect(
      findInPreviousPath("https://example.com/dist/code.js", async (file) =>
        file === "https://example.com/dist" ? fileDetails : undefined
      )
    ).resolves.toBeFalsy();
  });

  it("should resolve to falsy when the file path contains a protocol", () => {
    expect(
      findInPreviousPath("ftp://example.com/dist/code.js", async (file) =>
        file === "ftp://example.com/dist" ? fileDetails : undefined
      )
    ).resolves.toBeFalsy();
  });

  it("should resolve to falsy when the file path contains query parameters", () => {
    expect(
      findInPreviousPath("/dist/code.js?version=1.0", async (file) =>
        file === "/dist" ? fileDetails : undefined
      )
    ).resolves.toBeFalsy();
  });

  it("should resolve to falsy when the file path contains multiple query parameters", () => {
    expect(
      findInPreviousPath(
        "/dist/code.js?version=1.0&debug=true",
        async (file) => (file === "/dist" ? fileDetails : undefined)
      )
    ).resolves.toBeFalsy();
  });

  it("should resolve to falsy when the file path contains a URL with query parameters", () => {
    expect(
      findInPreviousPath(
        "https://example.com/dist/code.js?version=1.0",
        async (file) =>
          file === "https://example.com/dist" ? fileDetails : undefined
      )
    ).resolves.toBeFalsy();
  });

  it("should resolve to falsy when the file path contains a URL with multiple query parameters", () => {
    expect(
      findInPreviousPath(
        "https://example.com/dist/code.js?version=1.0&debug=true",
        async (file) =>
          file === "https://example.com/dist" ? fileDetails : undefined
      )
    ).resolves.toBeFalsy();
  });

  it("should resolve to falsy when the file path contains a URL with a protocol and query parameters", () => {
    expect(
      findInPreviousPath(
        "ftp://example.com/dist/code.js?version=1.0",
        async (file) =>
          file === "ftp://example.com/dist" ? fileDetails : undefined
      )
    ).resolves.toBeFalsy();
  });

  it("should resolve to falsy when the file path contains a URL with a protocol and multiple query parameters", () => {
    expect(
      findInPreviousPath(
        "ftp://example.com/dist/code.js?version=1.0&debug=true",
        async (file) =>
          file === "ftp://example.com/dist" ? fileDetails : undefined
      )
    ).resolves.toBeFalsy();
  });

  it("should resolve to the previous path when the file path contains a URL without a protocol", () => {
    expect(
      findInPreviousPath("//example.com/dist/code.js", async (file) =>
        file === "//example.com/dist" ? fileDetails : undefined
      )
    ).resolves.toMatch("//example.com/dist");
  });

  it("should resolve to the previous path when the file path contains a URL without a protocol and query parameters", () => {
    expect(
      findInPreviousPath(
        "//example.com/dist/code.js?version=1.0",
        async (file) =>
          file === "//example.com/dist" ? fileDetails : undefined
      )
    ).resolves.toMatch("//example.com/dist");
  });

  it("should resolve to the previous path when the file path contains a URL without a protocol and multiple query parameters", () => {
    expect(
      findInPreviousPath(
        "//example.com/dist/code.js?version=1.0&debug=true",
        async (file) =>
          file === "//example.com/dist" ? fileDetails : undefined
      )
    ).resolves.toMatch("//example.com/dist");
  });
});
