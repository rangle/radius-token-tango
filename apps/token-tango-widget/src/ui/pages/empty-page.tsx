const { widget } = figma;
const { AutoLayout, Text, Frame, SVG } = widget;

import { URL_ACCESS_TOKEN_DOCS } from "../../constants";
import { NameFormat } from "../components/name-format";
import { MessageRibbon } from "../components/message-ribbon";
import { RefreshedContent } from "../components/refreshed-content";
import { WidgetConfiguration } from "@repo/config";

import { FormatName, formats, getFormat } from "radius-toolkit";
import { FormatDescription } from "../components/name-format";
import { Button } from "../components/button";
import { colors, typography } from "@repo/bandoneon";
import { LgButton } from "../components/lg-button";
import { RoundButton } from "../components/round-button";
import { Icon16px } from "../components/icon";
import { LibraryButton } from "../components/library-button";

type EmptyPageProps = {
  synchConfig: WidgetConfiguration | null;
  loadTokens: () => void;
  clearIcons: () => void;
  loadIcons: () => void;
  openConfig: () => void;
  withVectors: boolean;
  toggleWithVectors: () => void;
  loadedIcons: number | null;
  selectedFormat: FormatName | null;
  selectFormat: (format: FormatName) => void;
};

export const EmptyPage: FunctionalWidget<EmptyPageProps> = ({
  synchConfig,
  loadTokens,
  loadIcons,
  clearIcons,
  loadedIcons,
  openConfig,
  selectedFormat,
  selectFormat,
}) => {
  const format = getFormat(selectedFormat ?? formats[0].name) ?? formats[0];
  return (
    <AutoLayout direction="vertical" width={"fill-parent"} spacing={16}>
      <AutoLayout
        cornerRadius={12}
        padding={16}
        spacing={16}
        direction="vertical"
        horizontalAlignItems={"center"}
        fill={colors.base.fg}
        width="fill-parent"
      >
        <NameFormat {...{ format, selectFormat, formats }} />
      </AutoLayout>
      <AutoLayout
        cornerRadius={12}
        padding={16}
        spacing={16}
        direction="vertical"
        horizontalAlignItems={"center"}
        fill="#fff"
        width="fill-parent"
      >
        {synchConfig ? (
          <RefreshedContent
            name={synchConfig.name}
            status={synchConfig.status || "disconnected"}
            format={format}
            loadedIcons={loadedIcons}
            loadIcons={loadIcons}
            loadTokens={loadTokens}
            openConfig={openConfig}
            clearIcons={clearIcons}
          />
        ) : (
          <AutoLayout
            name="Frame"
            direction="vertical"
            spacing={16}
            width={"hug-contents"}
            verticalAlignItems="center"
            horizontalAlignItems="center"
          >
            <AutoLayout
              name="Frame 1000002080"
              overflow="visible"
              direction="vertical"
              spacing={16}
              verticalAlignItems="end"
              horizontalAlignItems="center"
            >
              <AutoLayout
                name="Frame 1000002080"
                overflow="visible"
                direction="vertical"
                spacing={4}
                verticalAlignItems="center"
                horizontalAlignItems="center"
              >
                <LgButton
                  icon="github"
                  onClick={openConfig}
                  label="Connect Github to continue"
                ></LgButton>
                <Text
                  name="Github Access Token"
                  verticalAlignText="center"
                  horizontalAlignText="center"
                  {...typography.small}
                  fill="#262626"
                >
                  You will need a Github Access Token.
                </Text>
                <AutoLayout spacing={6} verticalAlignItems="center">
                  <Text
                    name="Github Access Token"
                    verticalAlignText="center"
                    horizontalAlignText="center"
                    {...typography.small}
                    fill="#262626"
                  >
                    Find out how to obtain one
                  </Text>

                  <Text
                    name="Learn more about our naming convention"
                    {...typography.link}
                    fill="#000"
                    verticalAlignText="center"
                    horizontalAlignText="center"
                    textDecoration="underline"
                    onClick={() => figma.openExternal(URL_ACCESS_TOKEN_DOCS)}
                  >
                    here
                  </Text>
                </AutoLayout>
              </AutoLayout>
            </AutoLayout>
          </AutoLayout>
        )}
      </AutoLayout>
    </AutoLayout>
  );
};
