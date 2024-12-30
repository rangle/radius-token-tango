const { widget } = figma;
const { AutoLayout, Text, Frame, SVG } = widget;
import { colors } from "@repo/bandoneon";
import { Icon16px, IconProps } from "./icon.js";

export type LibrayButtonProps = {
  state?: "default" | "inactive" | "loaded";
  label?: string;
  count?: number;
  onClosed?: () => void;
} & BaseProps &
  TextChildren &
  IconProps &
  AutoLayoutProps;

const colorScheme = {
  default: [colors.active.bg, colors.active.fg],
  inactive: [colors.active.info, colors.active.fg],
  loaded: [colors.status.success, colors.active.fg],
};

export const NumberBadge = ({ count }: { count: number }) => {
  return (
    <AutoLayout
      name="CountBadge"
      fill="#000"
      cornerRadius={45}
      overflow="visible"
      spacing={3}
      padding={{
        vertical: 4,
        horizontal: 8,
      }}
      height={22}
      horizontalAlignItems="center"
      verticalAlignItems="center"
    >
      <Text
        name="ErrorText"
        fill="#FFF"
        verticalAlignText="center"
        horizontalAlignText="center"
        lineHeight="150%"
        fontFamily="Arial"
        fontSize={12}
        fontWeight={700}
      >
        {count}
      </Text>
    </AutoLayout>
  );
};

export const LibraryButton: FunctionalWidget<LibrayButtonProps> = ({
  state,
  label,
  count,
  onClosed,
  icon,
  ...props
}) => {
  const [bg, fg] = colorScheme[state ?? "default"];
  const buttonIcon = state === "loaded" ? undefined : icon;
  const padding =
    state === "loaded"
      ? {
          vertical: 8,
          left: 8,
          right: 16,
        }
      : {
          vertical: 8,
          horizontal: 16,
        };
  return (
    <AutoLayout
      name="LibraryButton"
      fill={bg}
      cornerRadius={45}
      overflow="visible"
      spacing={8}
      padding={padding}
      width="hug-contents"
      height="hug-contents"
      horizontalAlignItems="center"
      verticalAlignItems="center"
      {...props}
    >
      <AutoLayout
        name="LabelGroup"
        overflow="visible"
        spacing={8}
        padding={0}
        verticalAlignItems="center"
      >
        {buttonIcon ? (
          <Icon16px icon={buttonIcon} size={16} color={fg} />
        ) : (
          <NumberBadge count={count || 0} />
        )}
        <Text
          name="Button Label"
          fill={fg}
          verticalAlignText="center"
          horizontalAlignText="center"
          lineHeight="150%"
          fontFamily="Inter"
          fontSize={14}
          fontWeight={700}
        >
          {label}
        </Text>
      </AutoLayout>
      {state === "loaded" && (
        <Icon16px
          onClick={onClosed}
          icon="close"
          size={12}
          color={colors.white}
        />
      )}
    </AutoLayout>
  );
};
