import { Icon16px, IconProps } from "./icon.js";

const { widget } = figma;
const { Text, AutoLayout } = widget;

export type WarningProps = BaseProps & TextChildren;

export const ErrorPill: FunctionalWidget<WarningProps> = ({ children }) => {
  return (
    <AutoLayout
      name="IssueBadge"
      fill="#DA0000"
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
        fill="#FFF"
        lineHeight={12}
        fontFamily="Inter"
        fontSize={12}
      >
        {children}
      </Text>
    </AutoLayout>
  );
};
