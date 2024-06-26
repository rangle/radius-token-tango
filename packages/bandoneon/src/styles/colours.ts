export const status = {
  error: "#da0000",
  success: "#00B212",
  warning: "#B28100",
  neutral: "#0077B2",
  fg: "#ffffff",
  info: "#696969",
} as const;

export const base = {
  bg: "#fafafa",
  fg: "#696969",
  info: "#d3d3d3",
  muted: "#d3d3d3",
} as const;

export const data = {
  bg: "#ffffff",
  fg: "#262626",
  info: "#696969",
  muted: "#d3d3d3",
} as const;

export const repository = {
  bg: "#333333",
  fg: "#696969",
  info: "#969696",
  muted: "#dadada",
} as const;

export const library = {
  bg: "#434343",
  fg: "#ffffff",
  info: "#696969",
  muted: "#dadada",
} as const;

export const active = {
  bg: "#000000",
  fg: "#ffffff",
  info: "#696969",
  muted: "#dadada",
} as const;

export const colors = {
  white: "#ffffff",
  black: "#000000",
  status,
  base,
  data,
  repository,
  library,
  active,
} as const;
