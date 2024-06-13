import { typography } from "@repo/bandoneon";
import { Icon16px } from "./icon.js";
import { VariableBullet } from "./variable-bullet.js";

import { TokenNameFormatType, FormatName } from "radius-toolkit";
import { URL_TOKEN_FORMAT_DOCS } from "../../constants.js";

const { widget } = figma;
const { Text, AutoLayout, Frame, SVG } = widget;

export type NameFormatProps = {
  format: TokenNameFormatType;
  formats: ReadonlyArray<TokenNameFormatType>;
  selectFormat?: (format: FormatName) => void;
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
          icon={selectFormat ? "switch" : "variables"}
          name={format.segments.join(format.separator)}
          onClick={
            selectFormat
              ? () => selectFormat(nextFormat.name as FormatName)
              : undefined
          }
        />
      </AutoLayout>
    </AutoLayout>
  );
};

export function FormatDescription({ format }: Pick<NameFormatProps, "format">) {
  return (
    <Text
      name="Learn more about our naming convention"
      fill="#262626"
      width={348}
      verticalAlignText="center"
      horizontalAlignText="center"
      {...typography.small}
      textDecoration="underline"
      onClick={() =>
        figma.openExternal(`${URL_TOKEN_FORMAT_DOCS}${format.name}/README.md`)
      }
    >
      About the {format.description} naming convention
    </Text>
  );
}
