import { colors, typography } from "@repo/bandoneon";
import { Icon16px, IconProps } from "./icon.js";

const { widget } = figma;
const { Text, AutoLayout, SVG } = widget;

export type VersionBumpProps = {
  from: string;
  to: string;
} & BaseProps &
  TextChildren;

export const VersionBump: FunctionalWidget<VersionBumpProps> = ({
  from,
  to,
}) => {
  return (
    <AutoLayout
      name="VersionBump"
      overflow="visible"
      spacing={8}
      verticalAlignItems="center"
    >
      <Text name="Versioning from:" {...typography.small} fill={colors.black}>
        Versioning from:
      </Text>
      <AutoLayout
        name="VersionBumpPill"
        fill={colors.white}
        stroke={colors.black}
        strokeWidth={2}
        cornerRadius={999}
        overflow="visible"
        spacing={8}
        padding={{
          vertical: 8,
          horizontal: 16,
        }}
        verticalAlignItems="center"
      >
        <Text
          name="previous-version"
          {...typography.code}
          fill={colors.black}
          verticalAlignText="center"
        >
          {from}
        </Text>
      </AutoLayout>
      <SVG
        name="Arrow 5"
        width={20}
        src="<svg width='20' viewBox='0 0 20 0' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path d='M20.7071 0.707107C21.0976 0.316582 21.0976 -0.316582 20.7071 -0.707107L14.3431 -7.07107C13.9526 -7.46159 13.3195 -7.46159 12.9289 -7.07107C12.5384 -6.68054 12.5384 -6.04738 12.9289 -5.65685L18.5858 0L12.9289 5.65685C12.5384 6.04738 12.5384 6.68054 12.9289 7.07107C13.3195 7.46159 13.9526 7.46159 14.3431 7.07107L20.7071 0.707107ZM0 1H20V-1H0V1Z' fill='black'/>
      </svg>
      "
      />
      <AutoLayout
        name="Frame 1000002101"
        fill="#333"
        cornerRadius={999}
        overflow="visible"
        spacing={8}
        padding={{
          vertical: 8,
          horizontal: 16,
        }}
        verticalAlignItems="center"
      >
        <AutoLayout
          name="Frame 1000002084"
          overflow="visible"
          spacing={4}
          verticalAlignItems="center"
        >
          <AutoLayout
            name="Frame 1000002007"
            overflow="visible"
            spacing={8}
            verticalAlignItems="center"
          >
            <Text
              name="next-version"
              fill="#FFF"
              verticalAlignText="center"
              fontFamily="Roboto Mono"
              fontSize={12}
            >
              {to}
            </Text>
          </AutoLayout>
        </AutoLayout>
      </AutoLayout>
    </AutoLayout>
  );
};
