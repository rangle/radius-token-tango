import { colors, typography } from "@repo/bandoneon";
import {
  PersistenceRibbon,
  PersistenceRibbonProps,
} from "./persistence-ribbon";
import { Button } from "./button";

const { widget } = figma;
const { Text, AutoLayout } = widget;

export type RefreshedContentProps = {
  name: string;
  lastRefreshed?: string;
  onRefresh?: () => void;
  onClose?: () => void;
  loadedIcons?: number;
  loadIcons?: () => void;
  clearIcons?: () => void;
  loadTokens?: () => void;
  openConfig?: () => void;
} & PersistenceRibbonProps;

/**
 * Displays the current connection status and available actions
 */
export const RefreshedContent: FunctionalWidget<RefreshedContentProps> = ({
  name,
  lastRefreshed,
  onRefresh,
  onClose,
  status,
  persistenceType,
  loadedIcons,
  loadIcons,
  clearIcons,
  loadTokens,
  openConfig,
  ...props
}) => {
  const isConnected = status === "connected" || status === "complete";
  console.log(">>>>>>>>>>>>>>>>>>>>>>>> REFRESHED CONTENT", {
    name,
    status,
    persistenceType,
    isConnected,
  });
  return (
    <AutoLayout
      name="RefreshedContent"
      overflow="visible"
      direction="vertical"
      spacing={8}
      width={"hug-contents"}
      {...props}
    >
      <AutoLayout
        name="Header"
        overflow="visible"
        spacing={8}
        width={"hug-contents"}
        verticalAlignItems="center"
      >
        <PersistenceRibbon
          name={name}
          status={status}
          persistenceType={persistenceType}
          onConfig={openConfig}
          {...props}
        />
        {onClose && (
          <Button
            name="CloseButton"
            onClick={onClose}
            icon="close"
            variant="ghost"
          />
        )}
      </AutoLayout>
      {lastRefreshed && (
        <AutoLayout
          name="LastRefreshed"
          overflow="visible"
          spacing={8}
          width={"hug-contents"}
          verticalAlignItems="center"
        >
          <Text
            name="LastRefreshed"
            fill={colors.text.secondary}
            {...typography.buttonSm}
          >
            Last refreshed: {lastRefreshed}
          </Text>
          {onRefresh && (
            <Button
              name="RefreshButton"
              onClick={onRefresh}
              icon="refresh"
              variant="ghost"
              state={status !== "connected" ? "disabled" : "default"}
            />
          )}
        </AutoLayout>
      )}
      <AutoLayout
        name="Actions"
        overflow="visible"
        direction="vertical"
        spacing={8}
        width={"hug-contents"}
      >
        {loadTokens && (
          <Button
            name="LoadTokensButton"
            onClick={isConnected ? loadTokens : undefined}
            icon="radius"
            variant="ghost"
            state={!isConnected ? "disabled" : "default"}
          >
            Load tokens
          </Button>
        )}
        {loadedIcons ? (
          <Button
            name="ClearIconsButton"
            onClick={clearIcons}
            icon="star"
            variant="ghost"
          >
            {`Loaded vectors (${loadedIcons})`}
          </Button>
        ) : (
          <Button
            name="LoadIconsButton"
            onClick={loadIcons}
            icon="star"
            variant="ghost"
          >
            Select your vectors
          </Button>
        )}
      </AutoLayout>
    </AutoLayout>
  );
};
