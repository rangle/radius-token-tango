export const borderRadius = {
  base: 16,
  section: 8,
  checkbox: 4,
  pill: {
    action: 69,
    info: 16,
  },
  button: {
    base: 69,
  },
};

export type Padding =
  | {
      vertical: number;
      horizontal: number;
    }
  | number;

export const padding = {
  base: 24,
  section: 24,
  checkbox: 4,
  actionPill: 4,
  infoPill: {
    vertical: 8,
    horizontal: 16,
  },

  badge: {
    vertical: 4,
    horizontal: 8,
  },
  button: {
    vertical: 16,
    horizontal: 32,
  },
} satisfies Record<string, Padding>;
