import { colors } from "@repo/bandoneon";
import { IconProps } from "./icon.js";
import { StatusButton } from "./status-button.js";

const { widget } = figma;
const { Text, AutoLayout, SVG } = widget;

export type SmallRepositoryRibbonProps = {
  name: string;
  status: "online" | "disconnected" | "error";
  error?: string;
} & BaseProps &
  TextChildren;

export const statusChoices: Record<
  SmallRepositoryRibbonProps["status"],
  Pick<IconProps, "icon" | "color">
> = {
  online: { color: "#00B012", icon: "check" },
  disconnected: { color: "#7A7A7A", icon: "refresh" },
  error: { color: "#b00000", icon: "warning" },
};

export const SmallRepositoryRibbon: FunctionalWidget<
  SmallRepositoryRibbonProps
> = ({ name, status, error, ...props }) => {
  const { icon, color } = statusChoices[status];
  return (
    <AutoLayout
      name="SmallRepositoryRibbon"
      fill={colors.library.bg}
      stroke="#484848"
      cornerRadius={8}
      direction="vertical"
      spacing={"auto"}
      padding={6}
      horizontalAlignItems="center"
      {...props}
    >
      <AutoLayout
        name="RepositoryHeader"
        overflow="visible"
        spacing="auto"
        width={"hug-contents"}
        minWidth={270}
        verticalAlignItems="center"
      >
        <AutoLayout
          name="RepositoryHeader"
          overflow="visible"
          spacing={8}
          verticalAlignItems="center"
        >
          <AutoLayout
            name="RepositoryTitle"
            overflow="visible"
            width={"hug-contents"}
            spacing={8}
            verticalAlignItems="center"
          >
            <SVG
              name="Vector"
              height={22}
              width={22}
              src="<svg width='23' height='23' viewBox='0 0 23 23' fill='none' xmlns='http://www.w3.org/2000/svg'>
  <path d='M11.0514 0.191406C4.94919 0.191406 0 5.26479 0 11.5223C0 16.5286 3.16622 20.7757 7.55825 22.2743C8.10991 22.3792 8.28856 22.0279 8.28856 21.7295V19.62C5.21443 20.3056 4.57437 18.283 4.57437 18.283C4.07152 16.9733 3.34673 16.6249 3.34673 16.6249C2.34382 15.9215 3.42317 15.9366 3.42317 15.9366C4.53293 16.0159 5.11681 17.1047 5.11681 17.1047C6.10222 18.8364 7.70191 18.3359 8.33277 18.0461C8.4313 17.3142 8.71772 16.8138 9.03453 16.5314C6.5802 16.2435 3.99969 15.2718 3.99969 10.9312C3.99969 9.69328 4.43162 8.68294 5.13799 7.88978C5.02379 7.60368 4.64529 6.45076 5.24574 4.89088C5.24574 4.89088 6.17406 4.58684 8.28581 6.0523C9.16715 5.80112 10.112 5.67554 11.0514 5.67081C11.9908 5.67554 12.9366 5.80112 13.8198 6.0523C15.9297 4.58684 16.8562 4.89088 16.8562 4.89088C17.4576 6.4517 17.079 7.60462 16.9648 7.88978C17.674 8.68294 18.1021 9.69422 18.1021 10.9312C18.1021 15.2832 15.5171 16.2415 13.0563 16.522C13.4523 16.8732 13.8143 17.5625 13.8143 18.6202V21.7295C13.8143 22.0307 13.9911 22.3848 14.552 22.2733C18.9403 20.7729 22.1029 16.5267 22.1029 11.5223C22.1029 5.26479 17.1546 0.191406 11.0514 0.191406Z' fill='white'/>
  </svg>
  "
            />
            <AutoLayout
              name="TextHeader"
              overflow="visible"
              width={"hug-contents"}
              maxWidth={350}
              spacing={8}
              verticalAlignItems="center"
            >
              <Text
                name="Repository:"
                fill="#DADADA"
                verticalAlignText="center"
                fontFamily="Roboto Mono"
                fontSize={14}
              >
                Repository:
              </Text>
              <Text
                name="Frontend-monorepo"
                fill="#DADADA"
                verticalAlignText="center"
                fontFamily="Roboto Mono"
                fontSize={14}
                truncate={true}
              >
                {name}
              </Text>
            </AutoLayout>
          </AutoLayout>
          <StatusButton
            variant={status === "online" ? "success" : "default"}
            icon={icon}
            color={color}
            label={status}
          />
        </AutoLayout>
      </AutoLayout>
    </AutoLayout>
  );
};
