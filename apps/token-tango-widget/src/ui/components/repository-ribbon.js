import { Button } from "./button.js";
import { CommitRibbon } from "./commit-ribbon.js";
import { Icon16px } from "./icon.js";
import { StatusButton, statusChoices } from "./short-repository-ribbon.js";
const { widget } = figma;
const { Text, AutoLayout, Image, useSyncedState } = widget;
export const statusText = {
    disconnected: "Refresh",
    error: "Error",
    online: "Synced",
};
export const RepositoryRibbon = ({ name, avatarUrl, userName, commitMessage, version, dateTime, status, error, openConfig, ...props }) => {
    const { icon, color } = statusChoices[status];
    return (<AutoLayout name="RepositoryRibbon" fill="#333" stroke="#484848" cornerRadius={8} direction="vertical" spacing={8} padding={8} width={"fill-parent"} horizontalAlignItems="center" {...props}>
      <AutoLayout name="RepositoryHeader" overflow="visible" spacing="auto" width={"fill-parent"} verticalAlignItems="center">
        <AutoLayout name="RepositoryTitle" overflow="visible" spacing={8} width={191.676} verticalAlignItems="center">
          <Icon16px icon="github" size={22} color="#fff"/>
          <Text name="RepoName" fill="#DADADA" verticalAlignText="center" fontFamily="Roboto Mono" fontSize={12}>
            {name}
          </Text>
        </AutoLayout>
        <AutoLayout name="ConfigureHeader" overflow="visible" spacing={4} verticalAlignItems="center">
          <Button icon="gear" onClick={() => openConfig()}>
            Settings
          </Button>
          <StatusButton icon={icon} color={color}>
            <Text name="date" fill="#FFF" horizontalAlignText="center" lineHeight="140%" fontFamily="Inter" fontSize={12} letterSpacing={0.24} fontWeight={500}>
              {statusText[status]}
            </Text>
          </StatusButton>
        </AutoLayout>
      </AutoLayout>
      <AutoLayout name="LibraryHeader" overflow="visible" direction="vertical" spacing={8} width={"fill-parent"}>
        <AutoLayout name="LibraryContent" fill="#424242" cornerRadius={8} overflow="visible" spacing={8} padding={8} width="fill-parent" horizontalAlignItems="center">
          <AutoLayout name="LibraryName" overflow="visible" spacing={12} width="fill-parent" horizontalAlignItems="center" verticalAlignItems="center">
            <Text name="package" fill="#DADADA" width="fill-parent" verticalAlignText="center" fontFamily="Roboto Mono" fontSize={12}>
              {name}
            </Text>
            <Text name="version" fill="#FFF" verticalAlignText="center" fontFamily="Roboto Mono" fontSize={13}>
              {version}
            </Text>
          </AutoLayout>
        </AutoLayout>
      </AutoLayout>
      <CommitRibbon {...{ avatarUrl, commitMessage, dateTime, userName, name, version }}/>
    </AutoLayout>);
};
