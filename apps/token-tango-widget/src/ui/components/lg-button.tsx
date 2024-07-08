import { borderRadius, colors, padding, typography } from "@repo/bandoneon";
import { Icon16px, IconProps } from "./icon.js";

const { widget } = figma;
const { Text, AutoLayout } = widget;

export type LgButtonProps = {
  label: string;
  variant?: keyof typeof colorScheme;
} & BaseProps &
  TextChildren &
  IconProps;

const colorScheme = {
  success: [colors.status.success, colors.status.fg],
  default: [colors.active.bg, colors.active.fg],
  disabled: [colors.disabled.bg, colors.disabled.fg],
};

export const LgButton: FunctionalWidget<LgButtonProps> = ({
  children,
  label,
  variant = "default",
  icon,
  ...props
}) => {
  const [bg, fg] = colorScheme[variant];
  console.log("YOUI KNOW WHAT I AM SAYING?", children);
  return (
    <AutoLayout
      name="LgButton"
      fill={bg}
      cornerRadius={borderRadius.button.base}
      overflow="visible"
      spacing={8}
      padding={padding.button}
      width="hug-contents"
      height="hug-contents"
      maxHeight={60}
      horizontalAlignItems="center"
      verticalAlignItems="center"
      {...props}
    >
      <AutoLayout
        name="LabelGroup"
        overflow="visible"
        spacing={8}
        verticalAlignItems="center"
      >
        <Icon16px icon={icon} size={22} color={fg} />
        <Text
          name="Button Label"
          {...typography.buttonLg}
          fill={fg}
          verticalAlignText="center"
          horizontalAlignText="center"
        >
          {label}
        </Text>
      </AutoLayout>
      {Array.isArray(children) && children.length > 0 ? (
        <AutoLayout
          name={`errors ${children.length}`}
          direction="horizontal"
          spacing={4}
          minWidth={24}
          width={"hug-contents"}
        >
          {children}
        </AutoLayout>
      ) : (
        <AutoLayout
          name="no-errors"
          direction="horizontal"
          spacing={4}
          width={12}
        ></AutoLayout>
      )}
    </AutoLayout>
  );
};
