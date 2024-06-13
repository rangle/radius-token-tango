import { Icon16px, IconProps } from "./icon.js";

const { widget } = figma;
const { Text, AutoLayout, Ellipse } = widget;

export type BulletColour = "green" | "amber" | "red" | "white" | "black";

export type BulletLabelProps = {
  color: BulletColour;
} & BaseProps &
  TextChildren;

const colors: Record<BulletColour, string> = {
  green: "#09C000",
  amber: "#f1ba13",
  red: "#da0000",
  white: "#ffffff",
  black: "#232323",
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
      <Ellipse name="Icon" fill={colors[color]} width={8} height={8} />
      <Text name="Label" fill="#232323" lineHeight="100%" fontFamily="Inter">
        {children}
      </Text>
    </AutoLayout>
  );
};
