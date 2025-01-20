import { Icon16px, IconProps } from "./icon.js";
import { colors } from "@repo/bandoneon";

const { widget } = figma;
const { Text, AutoLayout, Ellipse } = widget;

export type BulletColour = "green" | "amber" | "red" | "white" | "black";

export type BulletLabelProps = {
  color: BulletColour;
} & BaseProps &
  TextChildren;

const bulletColors: Record<BulletColour, string> = {
  green: colors.status.bullet.green,
  amber: colors.status.bullet.amber,
  red: colors.status.bullet.red,
  white: colors.status.bullet.white,
  black: colors.status.bullet.black,
};

export const BulletLabel: FunctionalWidget<BulletLabelProps> = ({
  color = "black",
  children,
}) => {
  return (
    <AutoLayout
      name="BulletLabel"
      overflow="visible"
      spacing={12}
      verticalAlignItems="center"
    >
      <Ellipse name="Icon" fill={bulletColors[color]} width={8} height={8} />
      <Text
        name="Label"
        fill={colors.status.bullet.black}
        lineHeight="100%"
        fontFamily="Inter"
      >
        {children}
      </Text>
    </AutoLayout>
  );
};
