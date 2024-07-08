import { colors } from "@repo/bandoneon";
import { Icon16px, IconProps } from "./icon.js";

const { widget } = figma;
const { Text, AutoLayout } = widget;

export type WarningProps = BaseProps & TextChildren;

export const WarningBadge: FunctionalWidget<WarningProps> = ({ children }) => {
  return (
    <AutoLayout
      name="WarningBadge"
      overflow="visible"
      spacing={2}
      width={121}
      verticalAlignItems="center"
    >
      <Icon16px name="icon" icon="warning" />
      <Text
        name="WarningsLabel"
        fill={colors.status.info}
        fontFamily="Inter"
        fontSize={12}
        fontWeight={500}
      >
        {children}
      </Text>
    </AutoLayout>
  );
};
