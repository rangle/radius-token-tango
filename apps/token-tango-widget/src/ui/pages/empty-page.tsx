const { widget } = figma;
const { AutoLayout, Text, Frame, SVG } = widget;

import { URL_ACCESS_TOKEN_DOCS } from "../../constants";
import { NameFormat } from "../components/name-format";
import { RefreshedContent } from "../components/refreshed-content";
import {
  FormatName,
  formats,
  getFormat,
  toTokenNameFormatType,
} from "radius-toolkit";
import { LgButton } from "../components/lg-button";
import { colors, typography } from "@repo/bandoneon";
import { EmptyAppState } from "../../types/app-state";
import { AppStateActions } from "../../hooks/use-app-state";
import { extractPersistenceMetadata } from "../components/persistence-ribbon";

type EmptyPageProps = {
  state: EmptyAppState;
  actions: Pick<
    AppStateActions,
    | "loadTokens"
    | "loadIcons"
    | "clearIcons"
    | "setTokenNameFormat"
    | "setConfiguration"
  >;
  openConfig: () => void;
};

/**
 * Page shown when no tokens are loaded
 */
export const EmptyPage: FunctionalWidget<EmptyPageProps> = ({
  state,
  actions,
  openConfig,
}) => {
  const format =
    getFormat(state.tokenNameFormat ?? formats[0].name) ?? formats[0];
  const formatType = toTokenNameFormatType(format);

  const configuration = state.configuration;

  const metadata = configuration
    ? extractPersistenceMetadata(state)
    : undefined;

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
        <NameFormat
          format={format}
          selectFormat={actions.setTokenNameFormat}
          formats={formats}
        />
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
        {configuration ? (
          <RefreshedContent
            name={configuration.name}
            status={configuration.status || "disconnected"}
            persistenceType={
              configuration.tool === "GitHub"
                ? "repository"
                : configuration.tool === "File Download"
                  ? "file-download"
                  : "rest-server"
            }
            metadata={metadata}
            loadedIcons={state.loadedVectors ?? undefined}
            loadIcons={actions.loadIcons}
            loadTokens={actions.loadTokens}
            openConfig={openConfig}
            clearIcons={actions.clearIcons}
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
