import { TokenNameFormatType } from "radius-toolkit";
import { Button } from "./button";
import { Icon16px } from "./icon";
import { FormatDescription, NameFormat } from "./name-format";
import { RoundButton } from "./round-button";
import {
  SmallRepositoryRibbon,
  SmallRepositoryRibbonProps,
} from "./short-repository-ribbon";

const { widget } = figma;
const { Text, AutoLayout, Frame } = widget;

export type RefreshedContentProps = {
  loadTokens: () => void;
  openConfig: () => void;
  format: TokenNameFormatType;
} & SmallRepositoryRibbonProps;

export const RefreshedContent: FunctionalWidget<RefreshedContentProps> = ({
  name,
  status,
  format,
  loadTokens,
  openConfig,
}) => {
  return (
    <AutoLayout
      name="ContentContainer"
      overflow="visible"
      direction="vertical"
      spacing={8}
      width="fill-parent"
      verticalAlignItems="center"
      horizontalAlignItems="center"
    >
      <AutoLayout
        name="ContentContainerInternal"
        overflow="visible"
        direction="vertical"
        spacing={24}
        width="fill-parent"
        verticalAlignItems="center"
        horizontalAlignItems="center"
      >
        <FormatDescription {...{ format }} />
        <AutoLayout
          name="Frame1000002081"
          overflow="visible"
          direction="vertical"
          spacing={16}
          verticalAlignItems="end"
          horizontalAlignItems="center"
        >
          <AutoLayout
            name="Frame 1000002079"
            overflow="visible"
            direction="vertical"
            spacing={8}
            height={60}
            verticalAlignItems="center"
            horizontalAlignItems="center"
            onClick={openConfig}
          >
            <SmallRepositoryRibbon name={name} status={status} />
            <Text
              name="Change repository"
              fill="#262626"
              verticalAlignText="center"
              horizontalAlignText="center"
              lineHeight="150%"
              fontFamily="Inter"
              fontSize={14}
              fontWeight={700}
              textDecoration="underline"
            >
              Change repository settings
            </Text>
          </AutoLayout>
          <AutoLayout
            name="Frame 1000002007"
            fill="#000"
            cornerRadius={69}
            overflow="visible"
            spacing={8}
            padding={{
              vertical: 8,
              horizontal: 24,
            }}
            height={37}
            horizontalAlignItems="center"
            verticalAlignItems="center"
          >
            <AutoLayout
              name="Frame 1000002032"
              overflow="visible"
              spacing={8}
              verticalAlignItems="center"
              onClick={() => {
                loadTokens();
              }}
            >
              <Text
                name="Button Label"
                fill="#FFF"
                verticalAlignText="center"
                horizontalAlignText="center"
                lineHeight="150%"
                fontFamily="Inter"
                fontSize={14}
                fontWeight={700}
              >
                Let's load your tokens
              </Text>
            </AutoLayout>
          </AutoLayout>
        </AutoLayout>
      </AutoLayout>
    </AutoLayout>
  );
};
