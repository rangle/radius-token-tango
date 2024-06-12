import { typography } from "@repo/bandoneon";
import { Icon16px } from "./icon.js";
import { VariableBullet } from "./variable-bullet.js";

import { TokenNameFormatType, FormatName } from "radius-toolkit";

const { widget } = figma;
const { Text, AutoLayout, Frame, SVG } = widget;

export type NameFormatProps = {
  format: TokenNameFormatType;
  formats: ReadonlyArray<TokenNameFormatType>;
  selectFormat: (format: FormatName) => void;
};

export const NameFormat: FunctionalWidget<NameFormatProps> = ({
  formats,
  format,
  selectFormat,
}) => {
  const idx = formats.indexOf(format);
  const nextFormat = formats[(idx + 1) % formats.length] ?? format;
  return (
    <AutoLayout name="FormatGroup" spacing={8} verticalAlignItems="center">
      <AutoLayout name="FormatRow" spacing={8} verticalAlignItems="center">
        <Text name="Format:" {...typography.label}>
          Format:
        </Text>
        <VariableBullet
          icon="switch"
          name={format.segments.join(format.separator)}
          onClick={() => selectFormat(nextFormat.name as FormatName)}
        />
      </AutoLayout>
    </AutoLayout>
  );
};
