import { borderRadius, padding, typography, colors } from "@repo/bandoneon";
import { Icon16px, IconProps } from "./icon.js";

const { widget } = figma;
const { Text, AutoLayout } = widget;

// Define button variants
type ButtonVariant = "default" | "ghost";

// Define button states
type ButtonState = "default" | "disabled";

// Extend ButtonProps to include variant and state
export type ButtonProps = BaseProps &
  TextChildren &
  IconProps & {
    variant?: ButtonVariant;
    state?: ButtonState;
  };

/**
 * Button component that supports different variants and states
 */
export const Button: FunctionalWidget<ButtonProps> = ({
  children,
  icon,
  variant = "default",
  state = "default",
  ...props
}) => {
  console.log(">>>>>>>>>>>>>>>>>>>>>>>> BUTTON", variant, state, icon, props);
  // Define variant-specific styles
  const variantStyles = {
    default: {
      fill:
        state === "disabled"
          ? colors.button.default.disabled.bg
          : colors.button.default.bg,
      padding: padding.button,
      textColor:
        state === "disabled"
          ? colors.button.default.disabled.fg
          : colors.button.default.fg,
    },
    ghost: {
      fill: "transparent",
      padding: {
        vertical: padding.button.vertical,
        horizontal: 0,
      },
      textColor:
        state === "disabled"
          ? colors.button.ghost.disabled.fg
          : colors.button.ghost.fg,
    },
  };

  const currentStyle = variantStyles[variant];

  return (
    <AutoLayout
      name="Button"
      cornerRadius={borderRadius.button.base}
      overflow="visible"
      spacing={16}
      padding={currentStyle.padding}
      verticalAlignItems="center"
      fill={currentStyle.fill}
      {...props}
    >
      <Text
        name="Label"
        {...typography.buttonLabel}
        fill={currentStyle.textColor}
      >
        {children}
      </Text>
      <Icon16px icon={icon} color={currentStyle.textColor} />
    </AutoLayout>
  );
};
