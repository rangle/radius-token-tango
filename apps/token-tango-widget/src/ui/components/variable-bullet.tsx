const { widget } = figma;
const { Text, AutoLayout, Frame, SVG } = widget;
import { TokenValidationResult } from "../../common/token.utils.js";
import { Icon16px, IconProps } from "./icon.js";
import { active, colors as colorTokens, typography } from "@repo/bandoneon";

export type VariableBulletProps = {
  name: string;
  colors?: Array<string>;
  issues?: TokenValidationResult["errors"];
  onClick?: () => void;
  icon?: IconProps["icon"];
} & BaseProps &
  AutoLayoutProps &
  TextChildren;

export const VariableBullet: FunctionalWidget<VariableBulletProps> = ({
  name,
  colors = [],
  issues = [],
  onClick,
  icon,
  children,
  ...props
}) => {
  const { base } = colorTokens;
  const segments = name.split(/[/.]/);
  const iconSelection = icon || ("variables" as const);
  const errorSegments = issues.flatMap(({ segments }) => segments);
  return (
    <AutoLayout
      name="FormatBullet"
      stroke={active.bg}
      cornerRadius={16}
      height={24}
      verticalAlignItems="center"
      width={"hug-contents"}
      {...props}
    >
      <AutoLayout
        name="Spacer"
        fill={active.bg}
        overflow="visible"
        spacing={10}
        padding={{
          vertical: 4,
          horizontal: 8,
        }}
        width={4}
        verticalAlignItems="center"
      />
      <AutoLayout
        name="TokenType"
        fill={active.bg}
        overflow="visible"
        spacing={4}
        padding={4}
        verticalAlignItems="center"
        onClick={onClick}
      >
        <Icon16px
          icon={iconSelection}
          size={11}
          color={issues.length > 0 ? "#F00" : "#FFF"}
        />
      </AutoLayout>
      {segments.map((segment, idx) => (
        <>
          <AutoLayout
            name="Layer"
            stroke="#EFEFEF"
            overflow="visible"
            spacing={4}
            padding={4}
            height="fill-parent"
            verticalAlignItems="center"
          >
            <Text
              name="layer"
              verticalAlignText="center"
              {...typography.monotype}
              {...(errorSegments.includes(segment) ? { fill: "#FF0000" } : {})}
            >
              {segment}
            </Text>
          </AutoLayout>
          {idx < segments.length - 1 && (
            <AutoLayout
              name="Dot"
              fill="#FFF"
              overflow="visible"
              spacing={4}
              padding={{
                vertical: 4,
                horizontal: 0,
              }}
              height="fill-parent"
              verticalAlignItems="center"
            >
              <Text name="." verticalAlignText="center" {...typography.code}>
                .
              </Text>
            </AutoLayout>
          )}
        </>
      ))}
      <AutoLayout
        name="Spacer"
        overflow="visible"
        spacing={4}
        padding={{
          vertical: 4,
          horizontal: 0,
        }}
        height={32}
        verticalAlignItems="center"
      />
    </AutoLayout>
  );
};
