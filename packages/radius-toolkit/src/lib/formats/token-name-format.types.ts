export const tokenTypeNames = [
  // Responsiveness
  "screens",
  "supports",
  "data",

  // Reusable base configs
  "colors",
  "spacing",

  // Components
  "container",

  // Utilities
  "inset",
  "zIndex",
  "order",
  "gridColumn",
  "gridColumnStart",
  "gridColumnEnd",
  "gridRow",
  "gridRowStart",
  "gridRowEnd",

  "aspectRatio",

  "height",
  "maxHeight",
  "minHeight",
  "width",
  "maxWidth",
  "minWidth",

  "gap",

  "backgroundColor",

  "fill",
  "stroke",

  "padding",
  "margin",

  "flex",
  "flexShrink",
  "flexGrow",
  "flexBasis",

  "borderSpacing",
  "transformOrigin",
  "translate",
  "rotate",
  "skew",
  "scale",
  "animation",
  "keyframes",
  "cursor",
  "scrollMargin",
  "scrollPadding",
  "listStyleType",
  "columns",
  "gridAutoColumns",
  "gridAutoRows",
  "gridTemplateColumns",
  "gridTemplateRows",
  "space",
  "divideWidth",
  "divideColor",
  "divideOpacity",

  "borderRadius",
  "borderWidth",
  "borderColor",
  "borderOpacity",
  "backgroundOpacity",
  "backgroundImage",
  "gradientColorStops",
  "backgroundSize",
  "backgroundPosition",
  "strokeWidth",
  "objectPosition",

  "textIndent",
  "fontFamily",
  "fontSize",
  "fontWeight",
  "lineHeight",
  "letterSpacing",
  "textColor",
  "textOpacity",
  "textDecorationColor",
  "textDecorationThickness",
  "textUnderlineOffset",

  "placeholderColor",
  "placeholderOpacity",
  "caretColor",
  "accentColor",
  "opacity",
  "boxShadow",
  "boxShadowColor",
  "outlineWidth",
  "outlineOffset",
  "outlineColor",
  "ringWidth",
  "ringColor",
  "ringOpacity",
  "ringOffsetWidth",
  "ringOffsetColor",
  "blur",
  "brightness",
  "contrast",
  "dropShadow",
  "grayscale",
  "hueRotate",
  "invert",
  "saturate",
  "sepia",
  "backdropBlur",
  "backdropBrightness",
  "backdropContrast",
  "backdropGrayscale",
  "backdropHueRotate",
  "backdropInvert",
  "backdropOpacity",
  "backdropSaturate",
  "backdropSepia",
  "transitionProperty",
  "transitionTimingFunction",
  "transitionDelay",
  "transitionDuration",
  "willChange",
  "content",
  "aria",
] as const;

export type TokenTypeName = (typeof tokenTypeNames)[number];

export const tokenTypeAliases: Record<string, TokenTypeName> = {
  color: "colors",
  COLOR: "colors",
  size: "spacing",
  grid: "screens",
};

export type TokenNameDescription = {
  type: TokenTypeName;
  attributes: string[];
  otherSegments?: Record<string, string | undefined>;
};

const isTokenType = (t: unknown): t is TokenTypeName =>
  tokenTypeNames.indexOf(t as TokenTypeName) !== -1;

export const getTokenType = (t: unknown): TokenTypeName | undefined =>
  isTokenType(t)
    ? t
    : (t as keyof typeof tokenTypeAliases) in tokenTypeAliases
      ? (tokenTypeAliases[t as keyof typeof tokenTypeAliases] as TokenTypeName)
      : undefined;
