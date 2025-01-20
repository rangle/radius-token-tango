const { widget } = figma;
const { AutoLayout, Text, SVG, Frame } = widget;

import { WidgetHeader } from "../components/widget-header";
import { BottomLogo } from "../components/bottom-logo";
import { PersistenceRibbon } from "../components/persistence-ribbon";
import { colors, padding, typography } from "@repo/bandoneon";
import { NameFormat } from "../components/name-format";
import { AppState } from "../../types/app-state";
import { AppStateActions } from "../../hooks/use-app-state";

type PageLayoutProps = {
  state: AppState;
  actions: Pick<AppStateActions, "synchronize" | "setConfiguration">;
  appVersion: string;
  openConfig: () => void;
} & HasChildrenProps;

/**
 * Main layout component that wraps all pages
 */
export const PageLayout = ({
  state,
  actions,
  appVersion,
  openConfig,
  children,
}: PageLayoutProps) => {
  console.log("PageLayout", state.synchDetails);
  const synchMetadata = state.synchDetails && state.synchDetails[2];

  return (
    <AutoLayout
      name="WidgetFrame"
      effect={{
        type: "drop-shadow",
        color: "#00000040",
        offset: {
          x: 0,
          y: 13,
        },
        blur: 29.6,
        showShadowBehindNode: false,
      }}
      fill={colors.base.bg}
      stroke={colors.base.fg}
      cornerRadius={16}
      direction="vertical"
      spacing={16}
      padding={padding.base}
    >
      <WidgetHeader empty={state.synchDetails === null}>
        <NameFormat
          format={state.tokenFormatType}
          formats={[]}
          variant="compact"
        />
      </WidgetHeader>
      {state.errorMessage && (
        <AutoLayout
          cornerRadius={6}
          padding={6}
          spacing={6}
          direction="vertical"
          fill="#fff"
        >
          <Text fontSize={12} fill={"#ff0000"}>
            {state.errorMessage}
          </Text>
        </AutoLayout>
      )}
      {synchMetadata &&
        synchMetadata.lastCommits &&
        synchMetadata.lastCommits[0] &&
        synchMetadata.lastCommits[0].author && (
          <PersistenceRibbon
            name={synchMetadata.name}
            status={state.configuration !== null ? "connected" : "disconnected"}
            persistenceType="repository"
            variant="detailed"
            metadata={{
              repository: {
                version: synchMetadata.version,
                lastCommit: {
                  message: synchMetadata.lastCommits[0].message,
                  author: {
                    name: synchMetadata.lastCommits[0].author.name,
                    avatar_url: synchMetadata.lastCommits[0].author.avatar_url,
                    date: synchMetadata.lastCommits[0].author.date,
                  },
                },
              },
            }}
            onConfig={openConfig}
          />
        )}

      {children}

      <AutoLayout direction="horizontal" padding={16} width={"hug-contents"}>
        <BottomLogo version={appVersion} />
      </AutoLayout>
    </AutoLayout>
  );
};
