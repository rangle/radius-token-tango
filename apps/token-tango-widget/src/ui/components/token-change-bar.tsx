import {
  FormatValidationResult,
  isTokenValidationResult,
} from "radius-toolkit";
import { BulletLabel, BulletLabelProps } from "./bullet-label";
import { ErrorPill } from "./error-pill";
import { Icon16px, IconProps } from "./icon";
import { VariableBullet } from "./variable-bullet";

const { widget } = figma;
const { Text, AutoLayout, useSyncedState } = widget;

export type TokenChangeType = "new" | "modified" | "deleted";

export type TokenChangeBarProps = {
  changeType: TokenChangeType;
  variant: "default" | "start" | "end";
  tokensChanged: string[];
  issues: FormatValidationResult[];
} & BaseProps &
  TextChildren;

const propMap: Record<
  TokenChangeType,
  Pick<BulletLabelProps, "color"> & { text: string }
> = {
  new: { color: "green", text: "New" },
  modified: { color: "amber", text: "Modified" },
  deleted: { color: "red", text: "Deleted" },
};

const cornerRadii: Record<
  TokenChangeBarProps["variant"],
  WidgetJSX.CornerRadius
> = {
  default: {
    topLeft: 0,
    topRight: 0,
    bottomRight: 0,
    bottomLeft: 0,
  },
  start: {
    topLeft: 8,
    topRight: 8,
    bottomRight: 0,
    bottomLeft: 0,
  },
  end: {
    topLeft: 0,
    topRight: 0,
    bottomRight: 8,
    bottomLeft: 8,
  },
};

export const TokenChangeBar: FunctionalWidget<TokenChangeBarProps> = ({
  changeType,
  variant = "default",
  tokensChanged,
  issues,
  children,
  ...props
}) => {
  const [open, setOpen] = useSyncedState<boolean>(
    `${changeType}BarOpen`,
    false,
  );
  const { color, text } = propMap[changeType];
  return (
    <AutoLayout
      name="TokenChangeBar"
      overflow="visible"
      direction="vertical"
      minWidth={276}
      width={"fill-parent"}
      {...props}
    >
      <AutoLayout
        name="AccordionItem"
        fill="#FFF"
        stroke="#E3E3E3"
        strokeAlign="outside"
        overflow="visible"
        spacing="auto"
        padding={10}
        width="fill-parent"
        verticalAlignItems="center"
        cornerRadius={
          variant === "end" && open ? undefined : cornerRadii[variant]
        }
      >
        <BulletLabel color={color}>
          {tokensChanged.length} {text}
        </BulletLabel>
        <AutoLayout
          name="AccordionHandle"
          overflow="visible"
          spacing={4}
          horizontalAlignItems="end"
          verticalAlignItems="center"
          onClick={tokensChanged.length > 0 ? () => setOpen(!open) : undefined}
        >
          {issues.length > 0 ? (
            <ErrorPill name="IssueBadge">{issues.length} issues</ErrorPill>
          ) : (
            <></>
          )}
          <Icon16px
            name="expand_more"
            icon={open ? "chevron-up" : "chevron-down"}
            color={tokensChanged.length > 0 ? "#000" : "#bbb"}
          />
        </AutoLayout>
      </AutoLayout>
      {open ? (
        <AutoLayout
          fill="#FFF"
          stroke="#E3E3E3"
          strokeAlign="outside"
          overflow="visible"
          spacing="auto"
          padding={10}
          direction="vertical"
          width="fill-parent"
        >
          {tokensChanged.map((token) => (
            <VariableBullet
              name={token}
              width={"fill-parent"}
              issues={issues
                .filter(isTokenValidationResult)
                .filter(({ token: { name } }) => name === token)}
            />
          ))}
        </AutoLayout>
      ) : (
        <></>
      )}
    </AutoLayout>
  );
};
