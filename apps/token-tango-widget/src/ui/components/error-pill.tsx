import { colors, typography } from "@repo/bandoneon";
import { Icon16px, IconProps } from "./icon.js";

const { widget } = figma;
const { Text, AutoLayout } = widget;

export type WarningProps = {
  level?: "error" | "warning" | "success";
} & BaseProps & TextChildren;

export const ErrorPill: FunctionalWidget<WarningProps> = ({ level, children }) => {
  const fill = colors.status[level || "error"];
  const fg = colors.status.fg;
  return (
    <AutoLayout
      name="IssueBadge"
      fill={fill}
      cornerRadius={45}
      overflow="visible"
      spacing={3}
      padding={{
        vertical: 4,
        horizontal: 8,
      }}
      horizontalAlignItems="center"
      verticalAlignItems="center"
    >
      <Text
        name="ErrorText"
        {...typography.error}
        fill={fg}
      >
        {children}
      </Text>
    </AutoLayout>
  );
};
