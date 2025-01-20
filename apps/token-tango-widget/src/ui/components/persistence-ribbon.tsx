import { colors } from "@repo/bandoneon";
import { Icon16px, IconType } from "./icon";
import { StatusButton } from "./status-button.js";
import { Button } from "./button.js";
import {
  PersistenceStatus,
  PersistenceType,
  persistenceTypeLabels,
  statusStateColors,
  statusStateIcons,
} from "@repo/utils/src/persistence";
import { PersistenceMetadata } from "../../types/persistence-metadata";
import { WidgetConfiguration } from "@repo/config";
import { WidgetState } from "../../types/widget-types";

const { widget } = figma;
const { Text, AutoLayout, SVG, Image } = widget;

export type PersistenceRibbonProps = {
  name: string;
  persistenceType: PersistenceType;
  status: PersistenceStatus["state"];
  error?: string;
  variant?: "compact" | "detailed";
  metadata?: Partial<PersistenceMetadata>;
  onConfig?: () => void;
} & BaseProps &
  TextChildren;

const persistenceTypeIcons: Record<PersistenceType, IconType> = {
  repository: "github",
  "rest-server": "server",
  "file-download": "fileAdd",
};

/**
 * Renders a ribbon showing persistence information with two variants:
 * - compact: shows only the basic info (name, type, status)
 * - detailed: shows all available metadata for the persistence type
 */
export const PersistenceRibbon: FunctionalWidget<PersistenceRibbonProps> = ({
  name,
  persistenceType,
  status,
  error,
  variant = "compact",
  metadata,
  onConfig,
  ...props
}) => {
  console.log(">>>>>>>>>>>>>>>>>>>>>>>> PERSISTENCE RIBBON", {
    name,
    persistenceType,
    status,
    metadata,
    variant,
    error,
  });
  const icon = statusStateIcons[status];
  const color = statusStateColors[status];
  const typeLabel = persistenceTypeLabels[persistenceType];
  const isSuccess = status === "connected" || status === "complete";
  console.log(">>> ICON DATA", status, icon, color);
  return (
    <AutoLayout
      name="PersistenceRibbon"
      fill={colors.library.bg}
      stroke="#484848"
      cornerRadius={8}
      direction="vertical"
      spacing={variant === "detailed" ? 8 : "auto"}
      padding={variant === "detailed" ? 8 : 6}
      width={variant === "detailed" ? "fill-parent" : "hug-contents"}
      horizontalAlignItems="center"
      {...props}
    >
      <AutoLayout
        name="Header"
        overflow="visible"
        spacing="auto"
        width={variant === "detailed" ? "fill-parent" : "hug-contents"}
        minWidth={270}
        verticalAlignItems="center"
      >
        <AutoLayout
          name="HeaderContent"
          overflow="visible"
          spacing={8}
          verticalAlignItems="center"
          width={variant === "detailed" ? 191.676 : "hug-contents"}
        >
          <Icon16px
            icon={persistenceTypeIcons[persistenceType]}
            color={colors.repository.fg}
          />

          <Text
            name="Type"
            fill="#DADADA"
            verticalAlignText="center"
            fontFamily="Roboto Mono"
            fontSize={14}
          >
            {typeLabel}:
          </Text>
          <Text
            name="Name"
            fill="#DADADA"
            verticalAlignText="center"
            fontFamily="Roboto Mono"
            fontSize={14}
            truncate={true}
          >
            {name}
          </Text>
        </AutoLayout>
        <AutoLayout
          name="ConfigureHeader"
          overflow="visible"
          spacing={4}
          verticalAlignItems="center"
        >
          {onConfig && (
            <StatusButton
              icon="gear"
              color="#434343"
              onClick={onConfig}
              label="Settings"
            />
          )}
          <StatusButton
            variant={isSuccess ? "success" : "default"}
            icon={icon}
            color={color}
            label={status}
          />
        </AutoLayout>
      </AutoLayout>

      {variant === "detailed" && metadata && (
        <>
          {persistenceType === "repository" && metadata.repository && (
            <>
              <AutoLayout
                name="LibraryHeader"
                overflow="visible"
                direction="vertical"
                spacing={8}
                width={"fill-parent"}
              >
                <AutoLayout
                  name="LibraryContent"
                  fill="#424242"
                  cornerRadius={8}
                  overflow="visible"
                  spacing={8}
                  padding={8}
                  width="fill-parent"
                  horizontalAlignItems="center"
                >
                  <AutoLayout
                    name="LibraryName"
                    overflow="visible"
                    spacing={12}
                    width="fill-parent"
                    horizontalAlignItems="center"
                    verticalAlignItems="center"
                  >
                    <Text
                      name="package"
                      fill="#ffffff"
                      width="fill-parent"
                      verticalAlignText="center"
                      fontFamily="Roboto Mono"
                      fontSize={12}
                    >
                      {name}
                    </Text>
                    {metadata.repository.version && (
                      <Text
                        name="version"
                        fill="#ffffff"
                        verticalAlignText="center"
                        fontFamily="Roboto Mono"
                        fontSize={13}
                      >
                        {metadata.repository.version}
                      </Text>
                    )}
                  </AutoLayout>
                </AutoLayout>
              </AutoLayout>

              {metadata.repository.lastCommit && (
                <AutoLayout
                  name="CommitInfo"
                  fill="#424242"
                  cornerRadius={8}
                  overflow="visible"
                  spacing={8}
                  padding={8}
                  width="fill-parent"
                >
                  <AutoLayout
                    name="CommitHeader"
                    overflow="visible"
                    spacing={8}
                    width="fill-parent"
                  >
                    {metadata.repository.lastCommit.author?.avatar_url && (
                      <AutoLayout
                        name="Avatar"
                        cornerRadius={69}
                        width={32}
                        height={32}
                        overflow="hidden"
                      >
                        <Image
                          name="AvatarImage"
                          src={metadata.repository.lastCommit.author.avatar_url}
                          width={32}
                          height={32}
                        />
                      </AutoLayout>
                    )}
                    <AutoLayout
                      name="CommitDetails"
                      overflow="visible"
                      direction="vertical"
                      spacing={4}
                      width="fill-parent"
                    >
                      <Text
                        name="CommitMessage"
                        fill="#ffffff"
                        width="fill-parent"
                        fontFamily="Inter"
                        fontSize={12}
                      >
                        {metadata.repository.lastCommit.message}
                      </Text>
                      <Text
                        name="CommitAuthor"
                        fill="#969696"
                        fontFamily="Inter"
                        fontSize={12}
                      >
                        {metadata.repository.lastCommit.author.name} •{" "}
                        {metadata.repository.lastCommit.author.date}
                      </Text>
                    </AutoLayout>
                  </AutoLayout>
                </AutoLayout>
              )}
            </>
          )}

          {persistenceType === "rest-server" &&
            metadata["rest-server"]?.lastSync && (
              <>
                <Text
                  name="LastSync"
                  fill={colors.text.secondary}
                  fontFamily="Inter"
                  fontSize={12}
                >
                  Last synced: {metadata["rest-server"].lastSync}
                </Text>
                {metadata["rest-server"].version && (
                  <Text
                    name="Version"
                    fill={colors.text.secondary}
                    fontFamily="Inter"
                    fontSize={12}
                  >
                    Version: {metadata["rest-server"].version}
                  </Text>
                )}
              </>
            )}

          {persistenceType === "file-download" &&
            metadata["file-download"]?.lastModified && (
              <>
                <Text
                  name="LastModified"
                  fill={colors.text.secondary}
                  fontFamily="Inter"
                  fontSize={12}
                >
                  Last modified: {metadata["file-download"].lastModified}
                </Text>
              </>
            )}
        </>
      )}
    </AutoLayout>
  );
};

/**
 * Extracts the appropriate metadata from a widget configuration based on its persistence type
 */
export const extractPersistenceMetadata = (
  state: WidgetState,
): Partial<PersistenceMetadata> => {
  const metadata = state.synchDetails?.[2];
  switch (state.configuration?.tool) {
    case "GitHub":
      return {
        repository: {
          version: metadata?.version,
          lastCommit: metadata?.lastCommits[0],
        },
      };
    case "REST Server":
      return {
        "rest-server": {
          version: metadata?.version,
          lastSync: undefined, // TODO: implement last sync
        },
      };
    case "File Download":
      return {
        "file-download": {
          lastModified: undefined, // TODO: implement last modified
        },
      };
    default:
      return {};
  }
};
