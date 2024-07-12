const { widget } = figma;
const { Text, AutoLayout, Frame, SVG } = widget;
import { TokenValidationResult } from "radius-toolkit";
import { Icon16px, IconProps } from "./icon.js";
import { active, colors as colorTokens, typography } from "@repo/bandoneon";

export type VariableBulletProps = {
  name: string;
  colors?: Array<string>;
  issues?: TokenValidationResult[];
  separator?: string;
  variant?: "default" | "compact";
  icon?: IconProps["icon"];
} & BaseProps &
  AutoLayoutProps &
  TextChildren;

export const VariableBullet: FunctionalWidget<VariableBulletProps> = ({
  name,
  colors = [],
  issues = [],
  separator = ".",
  variant = "default",
  icon,
  children,
  ...props
}) => {
  const segments = name.split(".");
  const iconSelection = icon || ("variables" as const);
  const errorSegments = issues.flatMap(
    ({ offendingSegments }) => offendingSegments,
  );
  return (
    <AutoLayout
      name="FormatBullet"
      cornerRadius={16}
      height={24}
      verticalAlignItems="center"
      width={"hug-contents"}
      {...props}
    >
      <AutoLayout
        name="Spacer"
        overflow="visible"
        spacing={10}
        padding={{
          vertical: 4,
          horizontal: 8,
        }}
        width={4}
        verticalAlignItems="center"
      />
      {variant !== "compact" && (
        <AutoLayout
          name="TokenType"
          overflow="visible"
          spacing={4}
          padding={4}
          verticalAlignItems="center"
        >
          <Icon16px
            icon={iconSelection}
            size={11}
            color={issues.length > 0 ? "#F00" : "#FFF"}
          />
        </AutoLayout>
      )}
      {segments.map((segment, idx) => (
        <>
          <AutoLayout
            name="Layer"
            overflow="visible"
            spacing={4}
            padding={0}
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
              overflow="visible"
              spacing={4}
              padding={{
                vertical: 2,
                horizontal: 0,
              }}
              height="fill-parent"
              verticalAlignItems="center"
            >
              <Text
                name="separator"
                verticalAlignText="center"
                {...typography.code}
              >
                {separator}
              </Text>
            </AutoLayout>
          )}
        </>
      ))}
      {variant !== "compact" && (
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
      )}
    </AutoLayout>
  );
};
