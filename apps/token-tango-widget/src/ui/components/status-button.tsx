import { borderRadius, colors, typography } from "@repo/bandoneon";
import { Icon16px, IconProps } from "./icon.js";
const { widget } = figma;
const { SVG, Text, Frame, AutoLayout } = widget;

export const StatusButton: FunctionalWidget<
  BaseProps &
    TextChildren &
    Pick<IconProps, "icon" | "color"> & {
      variant?: "success" | "default";
    } & {
      label?: string;
    }
> = ({ color, label, icon, children, variant, ...props }) =>
  variant === "success" ? (
    <StatusButtonSuccess color={color} icon={icon} {...props}>
      {children}
    </StatusButtonSuccess>
  ) : (
    <AutoLayout
      name="Button"
      fill={color}
      cornerRadius={9999}
      overflow="visible"
      padding={3.7}
      spacing={4}
      width={"hug-contents"}
      height={"hug-contents"}
      verticalAlignItems="center"
      {...props}
    >
      <Icon16px
        name="StatusIcon"
        width={14.775}
        height={14.775}
        icon={icon}
        color="#fff"
      />
      {label && (
        <Text name="Label" {...typography.buttonSm} fill={colors.status.fg}>
          {label}
        </Text>
      )}
      {children}
    </AutoLayout>
  );

export const StatusButtonSuccess: FunctionalWidget<
  BaseProps & TextChildren & Pick<IconProps, "icon" | "color">
> = ({ color, icon, children, ...props }) => {
  return (
    <AutoLayout
      name="StatusButtonStatusSuccess"
      fill={colors.status.success}
      cornerRadius={borderRadius.pill.action}
      strokeWidth={0.923}
      overflow="visible"
      spacing={4}
      padding={{
        top: 3.7,
        right: 8,
        bottom: 3.7,
        left: 3.7,
      }}
      horizontalAlignItems="end"
      verticalAlignItems="center"
      {...props}
    >
      <SVG
        name="Primary"
        x={{
          type: "center",
          offset: 0,
        }}
        y={{
          type: "center",
          offset: 0,
        }}
        height={16}
        width={16}
        src="<svg width='17' height='17' viewBox='0 0 17 17' fill='none' xmlns='http://www.w3.org/2000/svg'>
<path d='M8.69995 16.7C10.8217 16.7 12.8565 15.8571 14.3568 14.3568C15.8571 12.8565 16.7 10.8217 16.7 8.69995C16.7 6.57822 15.8571 4.54339 14.3568 3.0431C12.8565 1.54281 10.8217 0.699951 8.69995 0.699951C6.57822 0.699951 4.54339 1.54281 3.0431 3.0431C1.54281 4.54339 0.699951 6.57822 0.699951 8.69995C0.699951 10.8217 1.54281 12.8565 3.0431 14.3568C4.54339 15.8571 6.57822 16.7 8.69995 16.7ZM8.2312 11.2312L7.69995 11.7625L7.1687 11.2312L4.6687 8.7312L5.7312 7.6687L7.69995 9.63745L11.6687 5.6687L12.7312 6.7312L8.2312 11.2312Z' fill='white'/>
</svg>
"
      />
      <Text
        name="date"
        fill="#FFF"
        horizontalAlignText="center"
        lineHeight="140%"
        fontFamily="Inter"
        fontSize={12}
        letterSpacing={0.24}
        fontWeight={500}
      >
        Synced
      </Text>
    </AutoLayout>
  );
};
