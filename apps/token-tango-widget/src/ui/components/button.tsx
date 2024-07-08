import { borderRadius, padding, typography } from "@repo/bandoneon";
import { Icon16px, IconProps } from "./icon.js";

const { widget } = figma;
const { Text, AutoLayout } = widget;

export type ButtonProps = BaseProps & TextChildren & IconProps;

export const Button: FunctionalWidget<ButtonProps> = ({
  children,
  icon,
  color,
  ...props
}) => (
  <AutoLayout
    name="Button"
    cornerRadius={borderRadius.button.base}
    overflow="visible"
    spacing={16}
    padding={padding.button}
    verticalAlignItems="center"
    {...props}
  >
    <Text name="Label" {...typography.buttonLabel} fill={color}>
      {children}
    </Text>
    <Icon16px icon={icon} color={color} />
  </AutoLayout>
);
