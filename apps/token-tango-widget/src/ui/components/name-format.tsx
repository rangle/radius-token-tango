import { colors, typography } from "@repo/bandoneon";
import { Icon16px } from "./icon.js";
import { VariableBullet } from "./variable-bullet.js";

import {
  TokenNameFormatType,
  FormatName,
  TokenNamePortableFormatType,
} from "radius-toolkit";
import { URL_TOKEN_FORMAT_DOCS } from "../../constants.js";

const { widget } = figma;
const { Text, AutoLayout, Frame, SVG } = widget;

export type NameFormatProps = {
  variant?: "default" | "compact";
  format: TokenNamePortableFormatType;
  formats: ReadonlyArray<TokenNamePortableFormatType>;
  selectFormat?: (format: FormatName) => void;
};

export const NameFormat: FunctionalWidget<NameFormatProps> = ({
  variant,
  formats,
  format,
  selectFormat,
}) => {
  console.log("NameFormat", format);
  const idx = formats.indexOf(format);
  const nextFormat = formats[(idx + 1) % formats.length] ?? format;
  console.log("NameFormat", nextFormat);
  return variant === "compact" ? (
    <AutoLayout name="FormatGroup" spacing={8} verticalAlignItems="center">
      <AutoLayout name="FormatRow" spacing={8} verticalAlignItems="center">
        <Text name="Format:" {...typography.buttonLabel} fill={colors.data.fg}>
          Token Format:
        </Text>
        <VariableBullet
          key={`format-bullet-${format.name}-compact`}
          icon={selectFormat ? "switch" : "variables"}
          name={format.segments.join(format.separator)}
          variant={variant}
        />
      </AutoLayout>
    </AutoLayout>
  ) : (
    <FormatDescription
      format={format}
      cycleFormat={() => selectFormat?.(nextFormat.name as FormatName)}
    />
  );
};

export function FormatDescription({
  format,
  cycleFormat,
}: Pick<NameFormatProps, "format"> & { cycleFormat: () => void }) {
  return (
    <AutoLayout
      name="FormatDescription"
      overflow="visible"
      direction="vertical"
      horizontalAlignItems={"center"}
      spacing={8}
      padding={8}
    >
      <AutoLayout
        name="Internal format"
        overflow="visible"
        direction="vertical"
        spacing={8}
        horizontalAlignItems="center"
      >
        <AutoLayout name="Frame" height={26} horizontalAlignItems="center">
          <AutoLayout
            name="FormatGroup"
            spacing={8}
            verticalAlignItems="center"
          >
            <Text
              name="Format:"
              {...typography.buttonLabel}
              fill={colors.data.fg}
            >
              Token Format:
            </Text>
            <VariableBullet
              key={`format-bullet-${format.name}-default`}
              name={format.segments.join(format.separator)}
              variant={"compact"}
            />
          </AutoLayout>
        </AutoLayout>
      </AutoLayout>
      <AutoLayout
        name="Internal format"
        overflow="visible"
        direction="vertical"
        spacing={8}
        horizontalAlignItems="center"
      >
        <AutoLayout
          name="Button"
          fill="#000"
          cornerRadius={69}
          overflow="visible"
          spacing={4}
          padding={{
            top: 4,
            right: 8,
            bottom: 4,
            left: 4,
          }}
          horizontalAlignItems="center"
          verticalAlignItems="center"
        >
          <Frame name="circle-check" width={16} height={16}>
            <SVG
              name="Subtract"
              height={16}
              width={16}
              src="<svg width='16' height='17' viewBox='0 0 16 17' fill='none' xmlns='http://www.w3.org/2000/svg'>
<path fill-rule='evenodd' clip-rule='evenodd' d='M13.6569 14.1769C12.1566 15.6772 10.1217 16.52 8 16.52C5.87827 16.52 3.84344 15.6772 2.34315 14.1769C0.842855 12.6766 0 10.6418 0 8.52002C0 6.39829 0.842855 4.36346 2.34315 2.86317C3.84344 1.36287 5.87827 0.52002 8 0.52002C10.1217 0.52002 12.1566 1.36287 13.6569 2.86317C15.1571 4.36346 16 6.39829 16 8.52002C16 10.6418 15.1571 12.6766 13.6569 14.1769ZM10.8294 7.42812C10.685 6.99012 10.4488 6.57825 10.1206 6.22664H10.1225C8.95063 4.97092 7.05125 4.97092 5.87937 6.22664L6.95 7.37387L6.5 7.85607H3.5V4.64142L3.95 4.15923L5.02813 5.31851C6.66875 3.5605 9.3275 3.5605 10.9681 5.31851C11.4275 5.80874 11.7575 6.38537 11.96 7.00017L10.8294 7.42812ZM5.8775 10.7734C7.04938 12.0291 8.94875 12.0291 10.1206 10.7734V10.7713L9.05 9.62412L9.5 9.14192H12.5V12.3566L12.05 12.8388L10.9681 11.6815C9.32938 13.4395 6.67063 13.4395 5.03 11.6815C4.5725 11.1913 4.24062 10.6146 4.03813 9.99782L5.16875 9.57188C5.31313 10.0099 5.54938 10.4218 5.8775 10.7734Z' fill='white'/>
</svg>
"
            />
          </Frame>
          <Text
            name="Button Label"
            fill="#FFF"
            verticalAlignText="center"
            horizontalAlignText="center"
            lineHeight="150%"
            fontFamily="Inter"
            fontSize={12}
            fontWeight={700}
            onClick={cycleFormat}
          >
            Change format
          </Text>
        </AutoLayout>
      </AutoLayout>
      <AutoLayout direction="horizontal">
        <AutoLayout spacing={8} direction="horizontal">
          <AutoLayout
            name="LearnMoreText"
            overflow="visible"
            verticalAlignItems="center"
            padding={0}
            spacing={0}
          >
            <Text
              name="Learn more left"
              fill="#000"
              verticalAlignText="center"
              horizontalAlignText="center"
              lineHeight="140%"
              fontFamily="Inter"
              fontSize={12}
            >
              Learn about “
            </Text>
            <Text
              name="FormatName"
              fill="#000"
              verticalAlignText="center"
              horizontalAlignText="center"
              lineHeight="140%"
              fontFamily="Inter"
              fontSize={12}
              fontWeight={700}
            >
              {format.description}
            </Text>
            <Text
              name="Learn more right"
              fill="#000"
              verticalAlignText="center"
              horizontalAlignText="center"
              lineHeight="140%"
              fontFamily="Inter"
              fontSize={12}
            >
              ” format
            </Text>
          </AutoLayout>

          <Text
            name="Learn more about our naming convention"
            {...typography.link}
            fill="#000"
            verticalAlignText="center"
            horizontalAlignText="center"
            textDecoration="underline"
            onClick={() =>
              figma.openExternal(
                `${URL_TOKEN_FORMAT_DOCS}${format.name}/README.md`,
              )
            }
          >
            here -&gt;
          </Text>
        </AutoLayout>
      </AutoLayout>
    </AutoLayout>
  );
}
