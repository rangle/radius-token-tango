import { Icon16px } from "./icon.js";
import { VariableBullet } from "./variable-bullet.js";

const { widget } = figma;
const { Text, AutoLayout, Frame, SVG } = widget;

const FORMAT = "layer.subject.type.attributes";

export const NameFormat = () => {
  return (
    <AutoLayout name="FormatGroup" spacing={8} verticalAlignItems="center">
      <AutoLayout name="FormatRow" spacing={8} verticalAlignItems="center">
        <Text
          name="Format:"
          fill="#262626"
          lineHeight="140%"
          fontFamily="Roboto"
          fontSize={12}
          letterSpacing={0.24}
        >
          Format:
        </Text>
        <VariableBullet name={FORMAT} />
      </AutoLayout>
    </AutoLayout>
  );
};
