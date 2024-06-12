import { typography } from "@repo/bandoneon";
import { Icon16px } from "./icon.js";
import { VariableBullet } from "./variable-bullet.js";

import { } from 'radius-toolkit';

const { widget } = figma;
const { Text, AutoLayout, Frame, SVG } = widget;

const FORMAT = "layer.subject.type.attributes";

export type NameFormatProps = {
  formats: 
};



export const NameFormat = () => {
  return (
    <AutoLayout name="FormatGroup" spacing={8} verticalAlignItems="center">
      <AutoLayout name="FormatRow" spacing={8} verticalAlignItems="center">
        <Text name="Format:" {...typography.label}>
          Format:
        </Text>
        <VariableBullet name={FORMAT} />
      </AutoLayout>
    </AutoLayout>
  );
};
