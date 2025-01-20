export const status = {
  error: "#da0000",
  success: "#00B012",
  warning: "#854D0F",
  neutral: "#0077B2",
  fg: "#ffffff",
  info: "#696969",
  bullet: {
    green: "#09C000",
    amber: "#f1ba13",
    red: "#da0000",
    white: "#ffffff",
    black: "#232323",
  },
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

export const text = {
  primary: "#262626",
  secondary: "#696969",
  muted: "#808080",
} as const;

export const button = {
  default: {
    bg: "#000000",
    fg: "#ffffff",
    disabled: {
      bg: "#e7e7e7",
      fg: "#808080",
    },
  },
  ghost: {
    fg: "#262626",
    disabled: {
      fg: "#808080",
    },
  },
  round: {
    default: {
      bg: "#232323",
      fg: "#FFFFFF",
    },
    disabled: {
      bg: "#e7e7e7",
      fg: "#808080",
    },
  },
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
  text,
  button,
} as const;
