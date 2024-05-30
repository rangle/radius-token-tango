import { Icon16px, IconProps } from "./icon.js";

const { widget } = figma;
const { Text, AutoLayout } = widget;

export type MessageRibonProps = {
  icon: IconProps["icon"];
  text: string;
};

export const MessageRibbon: FunctionalWidget<MessageRibonProps> = ({
  icon,
  text,
}) => {
  return (
    <AutoLayout
      name="Frame1000002009"
      overflow="visible"
      direction="vertical"
      spacing={8}
      width="fill-parent"
      verticalAlignItems="center"
      horizontalAlignItems="center"
    >
      <AutoLayout
        name="Frame 1000001996"
        fill="#F4EBFF"
        stroke="#E2CCFF"
        cornerRadius={8}
        overflow="visible"
        direction="vertical"
        spacing={10}
        padding={{
          vertical: 16,
          horizontal: 0,
        }}
        width="fill-parent"
        verticalAlignItems="center"
        horizontalAlignItems="center"
      >
        <AutoLayout
          name="Frame 1000001999"
          overflow="visible"
          spacing={10}
          verticalAlignItems="center"
        >
          <Icon16px size={16} icon={icon} />
          <Text
            name="please, configure Github to continue"
            fill="#5F1DB5"
            fontFamily=""
            fontSize={14}
            letterSpacing={0.14}
          >
            {text}
          </Text>
        </AutoLayout>
      </AutoLayout>
    </AutoLayout>
  );
};
