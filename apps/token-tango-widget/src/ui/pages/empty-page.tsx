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
import { colors } from "@repo/bandoneon";
import { LgButton } from "../components/lg-button";
import { RoundButton } from "../components/round-button";

type EmptyPageProps = {
  synchConfig: WidgetConfiguration | null;
  loadTokens: () => void;
  loadIcons: () => void;
  openConfig: () => void;
  loadedIcons: number | null;
  selectedFormat: FormatName | null;
  selectFormat: (format: FormatName) => void;
};

export const EmptyPage: FunctionalWidget<EmptyPageProps> = ({
  synchConfig,
  loadTokens,
  loadIcons,
  loadedIcons,
  openConfig,
  selectedFormat,
  selectFormat,
}) => {
  const format = getFormat(selectedFormat ?? formats[0].name) ?? formats[0];
  return (
    <AutoLayout
      cornerRadius={12}
      padding={16}
      spacing={16}
      direction="vertical"
      horizontalAlignItems={"center"}
      fill="#fff"
      width="fill-parent"
    >
      <NameFormat {...{ format, selectFormat, formats }} />
      {synchConfig ? (
        <RefreshedContent
          name={synchConfig.name}
          status={synchConfig.status || "disconnected"}
          format={format}
          loadedIcons={loadedIcons}
          loadIcons={loadIcons}
          loadTokens={loadTokens}
          openConfig={openConfig}
        />
      ) : (
        <AutoLayout
          name="Frame"
          direction="vertical"
          spacing={16}
          width={406}
          verticalAlignItems="center"
          horizontalAlignItems="center"
        >
          <FormatDescription {...{ format }} />
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
                fill="#262626"
                verticalAlignText="center"
                horizontalAlignText="center"
                lineHeight="150%"
                fontFamily="Inter"
                fontSize={13}
              >
                You will need a Github Access Token.
              </Text>
              <AutoLayout spacing={6} verticalAlignItems="center">
                <Text
                  name="Github Access Token"
                  fill="#262626"
                  verticalAlignText="center"
                  horizontalAlignText="center"
                  lineHeight="150%"
                  fontFamily="Inter"
                  fontSize={13}
                >
                  Find out how to obtain one
                </Text>
                <Text
                  name="Github Access Token"
                  fill="#0000ff"
                  verticalAlignText="center"
                  horizontalAlignText="center"
                  lineHeight="150%"
                  fontFamily="Inter"
                  fontSize={13}
                  textDecoration="underline"
                  onClick={() => figma.openExternal(URL_ACCESS_TOKEN_DOCS)}
                >
                  here
                </Text>
              </AutoLayout>
            </AutoLayout>
          </AutoLayout>
          <RoundButton
            icon="variables"
            fill={colors.disabled.bg}
            color={colors.disabled.fg}
          >
            Let's load your tokens
          </RoundButton>
        </AutoLayout>
      )}
    </AutoLayout>
  );
};
