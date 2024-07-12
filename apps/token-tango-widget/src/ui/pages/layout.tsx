const { widget } = figma;
const { AutoLayout, Text, SVG, Frame } = widget;

import { WidgetHeader } from "../components/widget-header";
import { BottomLogo } from "../components/bottom-logo";
import { RepositoryRibbon } from "../components/repository-ribbon";
import { colors, padding, typography } from "@repo/bandoneon";
import { RepositoryTokenLayers } from "../../../types/state";
import { NameFormat } from "../components/name-format";
import { TokenNameFormatType } from "radius-toolkit";

type PageLayoutProps = {
  synched: boolean;
  name: string;
  error: string | null;
  synchDetails: RepositoryTokenLayers | null;
  appVersion: string;
  format: TokenNameFormatType;
  openConfig: () => void;
  synchronize?: () => void;
  loadVariables?: () => void;
} & HasChildrenProps;

export const PageLayout = ({
  synched,
  format,
  error,
  appVersion,
  synchDetails,
  openConfig,
  children,
}: PageLayoutProps) => {
  const synchMetadata = synchDetails && synchDetails[2];

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
      <WidgetHeader empty={synchDetails === null}>
        <NameFormat format={format} formats={[]} variant="compact" />
      </WidgetHeader>
      {error && (
        <AutoLayout
          cornerRadius={6}
          padding={6}
          spacing={6}
          direction="vertical"
          fill="#fff"
        >
          <Text fontSize={12} fill={"#ff0000"}>
            {error}
          </Text>
        </AutoLayout>
      )}
      {synchMetadata &&
        synchMetadata.lastCommits &&
        synchMetadata.lastCommits[0] && (
          <RepositoryRibbon
            name={synchMetadata.name}
            avatarUrl={synchMetadata.lastCommits[0].autor_avatar_url || ""}
            commitMessage={synchMetadata.lastCommits[0].message}
            dateTime={synchMetadata.lastCommits[0].author.date}
            userName={synchMetadata.lastCommits[0].author.name}
            version={synchMetadata.version}
            openConfig={openConfig}
            status={synched ? "online" : "disconnected"}
          />
        )}

      {children}

      <AutoLayout direction="horizontal" padding={16} width={"hug-contents"}>
        <BottomLogo version={appVersion} />
      </AutoLayout>
    </AutoLayout>
  );
};
