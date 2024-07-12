import { TokenNameFormatType } from "radius-toolkit";
import { Button } from "./button";
import { Icon16px } from "./icon";
import { FormatDescription, NameFormat } from "./name-format";
import { RoundButton } from "./round-button";
import {
  SmallRepositoryRibbon,
  SmallRepositoryRibbonProps,
} from "./short-repository-ribbon";
import { colors } from "@repo/bandoneon";
import { LibraryButton } from "./library-button";

const { widget } = figma;
const { Text, AutoLayout, Frame } = widget;

export type RefreshedContentProps = {
  loadedIcons: number | null;
  loadTokens: () => void;
  loadIcons: () => void;
  clearIcons: () => void;
  openConfig: () => void;
  format: TokenNameFormatType;
} & SmallRepositoryRibbonProps;

export const RefreshedContent: FunctionalWidget<RefreshedContentProps> = ({
  name,
  status,
  loadTokens,
  loadedIcons,
  clearIcons,
  loadIcons,
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
        </AutoLayout>
        <InitialActionButtonBar
          {...{ status, loadedIcons, loadIcons, loadTokens, clearIcons }}
        />
      </AutoLayout>
    </AutoLayout>
  );
};

export type InitialActionButtonBarProps = {
  status: SmallRepositoryRibbonProps["status"];
  loadedIcons: number | null;
  loadIcons: () => void;
  clearIcons: () => void;
  loadTokens: () => void;
};

export const InitialActionButtonBar: FunctionalWidget<
  InitialActionButtonBarProps
> = ({ status, loadedIcons, clearIcons, loadIcons, loadTokens }) => {
  return (
    <AutoLayout spacing={4}>
      {loadedIcons ? (
        <LibraryButton
          icon="star"
          onClick={clearIcons}
          label={`Loaded vectors`}
          count={loadedIcons}
          state="loaded"
        ></LibraryButton>
      ) : (
        <LibraryButton
          icon="star"
          onClick={loadIcons}
          label="Load selected vectors"
        ></LibraryButton>
      )}
      <LibraryButton
        icon="variables"
        state={status !== "online" ? "inactive" : "default"}
        label="Let's load your tokens"
        onClick={status === "online" ? loadTokens : undefined}
      ></LibraryButton>
    </AutoLayout>
  );
};
