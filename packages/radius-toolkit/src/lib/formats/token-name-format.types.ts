export const tokenTypeNames = [
  // Core Design Tokens (Primitive Values)
  "colors",
  "spacing",

  // Layout & Responsive Patterns
  "screens",
  "container",
  "supports",
  "data",

  // Spacing Derivatives
  "padding",
  "margin",
  "gap",
  "space",
  "inset",
  "scrollMargin",
  "scrollPadding",

  // Sizing & Dimensions
  "width",
  "minWidth",
  "maxWidth",
  "height",
  "minHeight",
  "maxHeight",
  "aspectRatio",

  // Grid System
  "gridColumn",
  "gridColumnStart",
  "gridColumnEnd",
  "gridRow",
  "gridRowStart",
  "gridRowEnd",
  "gridAutoColumns",
  "gridAutoRows",
  "gridTemplateColumns",
  "gridTemplateRows",
  "columns",

  // Flexbox
  "flex",
  "flexShrink",
  "flexGrow",
  "flexBasis",

  // Positioning & Stacking
  "zIndex",
  "order",

  // Colors & Opacity Derivatives
  "backgroundColor",
  "backgroundOpacity",
  "borderColor",
  "borderOpacity",
  "textColor",
  "textOpacity",
  "placeholderColor",
  "placeholderOpacity",
  "ringColor",
  "ringOpacity",
  "divideColor",
  "divideOpacity",
  "boxShadowColor",
  "outlineColor",
  "ringOffsetColor",
  "caretColor",
  "accentColor",
  "opacity",
  "fill",
  "stroke",

  // Typography
  "fontFamily",
  "fontSize",
  "fontWeight",
  "lineHeight",
  "letterSpacing",
  "textIndent",
  "textDecorationColor",
  "textDecorationThickness",
  "textUnderlineOffset",
  "listStyleType",

  // Borders & Outlines
  "borderRadius",
  "borderWidth",
  "borderSpacing",
  "outlineWidth",
  "outlineOffset",
  "ringWidth",
  "ringOffsetWidth",
  "divideWidth",
  "strokeWidth",

  // Backgrounds & Images
  "backgroundImage",
  "gradientColorStops",
  "backgroundSize",
  "backgroundPosition",
  "objectPosition",

  // Transforms & Animations
  "transformOrigin",
  "translate",
  "rotate",
  "skew",
  "scale",
  "animation",
  "keyframes",

  // Filters & Effects
  "blur",
  "brightness",
  "contrast",
  "dropShadow",
  "grayscale",
  "hueRotate",
  "invert",
  "saturate",
  "sepia",
  "boxShadow",

  // Backdrop Filters
  "backdropBlur",
  "backdropBrightness",
  "backdropContrast",
  "backdropGrayscale",
  "backdropHueRotate",
  "backdropInvert",
  "backdropOpacity",
  "backdropSaturate",
  "backdropSepia",

  // Transitions & Animations
  "transitionProperty",
  "transitionTimingFunction",
  "transitionDelay",
  "transitionDuration",

  // Miscellaneous
  "cursor",
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

export const getTokenType = (t: unknown): TokenTypeName | undefined => {
  if (isTokenType(t)) {
    return t;
  }
  if ((t as keyof typeof tokenTypeAliases) in tokenTypeAliases) {
    return tokenTypeAliases[
      t as keyof typeof tokenTypeAliases
    ] as TokenTypeName;
  }
  return undefined;
};
