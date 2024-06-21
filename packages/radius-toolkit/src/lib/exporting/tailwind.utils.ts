import { TokenTypeName, tokenTypeNames } from "../formats";

const tailwindThemeMap: Record<string, TokenTypeName> = {
  ...Object.fromEntries(tokenTypeNames.map((key) => [key, key])),
  // custom entries to fix imperfections in the variable names
  color: "colors",
  size: "spacing",
  iconSize: "spacing",
  breakpoints: "screens",
  fontFamilies: "fontFamily",
  fontWeights: "fontWeight",
  fontSize: "fontSize",
  lineHeights: "lineHeight",
};

export const isTokenTypeName = (key: string): key is TokenTypeName =>
  tokenTypeNames.includes(key as TokenTypeName);

/**
 * process the key name to remove the tailwind type from the name
 * @param key the token name to process (dot-separated)
 * @returns the processed key name (in the format `typeName.rest-of-the-key-with-the-type-removed`)
 */
export const processKeyName = (key: string): string => {
  const segments = key.split(".");
  segments;
  // find the type in the name. return the found type and the true type (in case the segment is an alias)
  const segment = segments.find((segment) => tailwindThemeMap[segment]);

  // returns the processed key name
  return [
    segment ? tailwindThemeMap[segment] : "unknown",
    segments
      .filter((n) => n !== segment)
      .join("-")
      .replace(" ", "-"),
  ].join(".");
};
