export const status = {
  error: "#da0000",
  success: "#00B012",
  warning: "#854D0F",
  neutral: "#0077B2",
  fg: "#ffffff",
  info: "#696969",
} as const;

export const base = {
  bg: "#fafafa",
  fg: "#e3e3e3",
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

export const disabled = {
  bg: "#e7e7e7",
  fg: "#808080",
  info: "#696969",
  muted: "#dadada",
} as const;

export const success = {
  bg: "#00b012",
  fg: "#ffffff",
  info: "#696969",
  muted: "#defadd",
} as const;

export const colors = {
  white: "#ffffff",
  black: "#000000",
  disabled,
  status,
  base,
  data,
  repository,
  library,
  active,
  success,
} as const;
