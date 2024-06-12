import { colors } from "./colours";

export type FontWeightNumerical =
  | 100
  | 200
  | 300
  | 400
  | 500
  | 600
  | 700
  | 800
  | 900;
export type FontWeightString =
  | "thin"
  | "extra-light"
  | "light"
  | "normal"
  | "medium"
  | "semi-bold"
  | "bold"
  | "extra-bold"
  | "black";

export type BaseTypographyProps = {
  fontFamily: string;
  fontSize: number;
  fontWeight: FontWeightString | FontWeightNumerical;
  lineHeight: string;
  letterSpacing?: number;
  fill?: string;
};

export const small: BaseTypographyProps = {
  fontFamily: "Inter",
  fontSize: 12,
  fontWeight: 400,
  lineHeight: "140%",
  fill: colors.base.fg,
} as const;

export const body: BaseTypographyProps = {
  fontFamily: "Inter",
  fontSize: 14,
  fontWeight: 400,
  lineHeight: "140%",
  fill: colors.base.fg,
} as const;

export const label: BaseTypographyProps = {
  fontFamily: "Inter",
  fontSize: 14,
  fontWeight: 700,
  lineHeight: "140%",
  fill: colors.base.fg,
} as const;

export const buttonLabel: BaseTypographyProps = {
  fontFamily: "Inter",
  fontSize: 14,
  fontWeight: 700,
  lineHeight: "140%",
  fill: colors.active.fg,
} as const;

export const error: BaseTypographyProps = {
  fontFamily: "Inter",
  fontSize: 12,
  fontWeight: 700,
  lineHeight: "140%",
  fill: colors.status.error,
} as const;

export const warning: BaseTypographyProps = {
  fontFamily: "Inter",
  fontSize: 12,
  fontWeight: 700,
  lineHeight: "140%",
  fill: colors.status.warning,
} as const;

export const leading: BaseTypographyProps = {
  fontFamily: "Inter",
  fontSize: 14,
  fontWeight: 700,
  lineHeight: "140%",
  fill: colors.base.fg,
} as const;

export const code: BaseTypographyProps = {
  fontFamily: "Roboto Mono",
  fontSize: 12,
  fontWeight: 400,
  lineHeight: "140%",
  fill: colors.repository.fg,
} as const;

export const monotype: BaseTypographyProps = {
  fontFamily: "Roboto Mono",
  fontSize: 12,
  fontWeight: 400,
  lineHeight: "140%",
  fill: colors.data.fg,
} as const;

export const link: BaseTypographyProps = {
  fontFamily: "Inter",
  fontSize: 14,
  fontWeight: 700,
  lineHeight: "140%",
  fill: colors.status.neutral,
} as const;

export const typography = {
  small,
  body,
  label,
  buttonLabel,
  error,
  warning,
  leading,
  monotype,
  code,
  link,
} as const;
