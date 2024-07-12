import { WidgetConfiguration } from "@repo/config";
import { Icon16px, IconProps } from "./icon";
import { RoundButton } from "./round-button";
import { TokenChangeBar } from "./token-change-bar";
import { VersionBump } from "./version-bump";
import { WarningBadge } from "./warning-badge";
import { colors } from "@repo/bandoneon";
import { LgButton } from "./lg-button";

const { widget } = figma;
const { SVG, Text, AutoLayout, Frame } = widget;

export type SuccessfullyPushedDetails = {
  branch: string;
  ref: string;
  repository: string;
  version: string;
};

export type SuccessPanelProps = {
  details: SuccessfullyPushedDetails;
} & BaseProps &
  TextChildren;

export const createNewPRUrl = (repository: string, branch: string) =>
  `https://github.com/${repository}/pull/new/${branch}`;

export const SuccessPanel: FunctionalWidget<SuccessPanelProps> = ({
  details: { branch, ref, repository },
}) => {
  return (
    <AutoLayout
      name="SuccessPanel"
      overflow="visible"
      direction="vertical"
      spacing={16}
      padding={24}
      width={530}
      verticalAlignItems="end"
      horizontalAlignItems="center"
    >
      <AutoLayout
        name="PushSuccess"
        fill="#FFF9"
        cornerRadius={69}
        overflow="visible"
        spacing={8}
        padding={{
          vertical: 0,
          horizontal: 16,
        }}
        height={36}
        horizontalAlignItems="center"
        verticalAlignItems="center"
      >
        <AutoLayout
          name="LabelGroup"
          overflow="visible"
          spacing={8}
          verticalAlignItems="center"
        >
          <Frame name="circle-check" width={16} height={16}>
            <SVG
              name="Primary"
              x={{
                type: "center",
                offset: 0,
              }}
              y={{
                type: "center",
                offset: 0,
              }}
              height={16}
              width={16}
              src="<svg width='16' height='17' viewBox='0 0 16 17' fill='none' xmlns='http://www.w3.org/2000/svg'>
<path d='M8 16.6951C10.1217 16.6951 12.1566 15.8522 13.6569 14.3519C15.1571 12.8516 16 10.8168 16 8.69507C16 6.57334 15.1571 4.53851 13.6569 3.03821C12.1566 1.53792 10.1217 0.695068 8 0.695068C5.87827 0.695068 3.84344 1.53792 2.34315 3.03821C0.842855 4.53851 0 6.57334 0 8.69507C0 10.8168 0.842855 12.8516 2.34315 14.3519C3.84344 15.8522 5.87827 16.6951 8 16.6951ZM11.5312 7.22632L7.53125 11.2263C7.2375 11.5201 6.7625 11.5201 6.47188 11.2263L4.47188 9.22632C4.17813 8.93257 4.17813 8.45757 4.47188 8.16694C4.76563 7.87632 5.24062 7.87319 5.53125 8.16694L7 9.63569L10.4688 6.16382C10.7625 5.87007 11.2375 5.87007 11.5281 6.16382C11.8187 6.45757 11.8219 6.93257 11.5281 7.22319L11.5312 7.22632Z' fill='#00B012'/>
</svg>
"
            />
          </Frame>
          <Text
            name="Button Label"
            fill="#00B012"
            verticalAlignText="center"
            horizontalAlignText="center"
            lineHeight="150%"
            fontFamily="Inter"
            fontSize={14}
            fontWeight={700}
          >
            Pushed
          </Text>
        </AutoLayout>
      </AutoLayout>
      <AutoLayout
        name="SuccessfullyPushed"
        overflow="visible"
        direction="vertical"
        spacing={16}
        width={528}
        horizontalAlignItems="center"
      >
        <AutoLayout
          name="BranchNameMessage"
          overflow="visible"
          direction="vertical"
          spacing={4}
          horizontalAlignItems="center"
        >
          <AutoLayout
            name="BranchName"
            overflow="visible"
            spacing={4}
            horizontalAlignItems="center"
          >
            <Text
              name="Create a Pull Request"
              fill="#262626"
              lineHeight="140%"
              fontFamily="Inter"
              fontSize={14}
              fontWeight={700}
            >
              New branch:
            </Text>
          </AutoLayout>
          <AutoLayout
            name="Frame 1000002145"
            fill="#333"
            cornerRadius={4}
            overflow="visible"
            spacing={10}
            padding={{
              vertical: 4,
              horizontal: 8,
            }}
            horizontalAlignItems="center"
            verticalAlignItems="center"
          >
            <Text
              name="Create a Pull Request"
              fill="#FFF"
              verticalAlignText="center"
              fontFamily="Roboto Mono"
              fontSize={12}
            >
              {branch}
            </Text>
          </AutoLayout>
        </AutoLayout>
        <LgButton
          icon="github"
          label="Create a Pull Request"
          onClick={() => figma.openExternal(createNewPRUrl(repository, branch))}
        />

        <AutoLayout
          name="Frame 1000002146"
          overflow="visible"
          direction="vertical"
          spacing={8}
          width={363}
          horizontalAlignItems="center"
        >
          <Text
            name="PRapprovedOne"
            fill="#262626"
            width="fill-parent"
            horizontalAlignText="center"
            lineHeight="140%"
            fontFamily="Inter"
            fontSize={12}
            letterSpacing={0.24}
          >
            Changes will be reflected in your current version once a PR from
            this branch is merged into:
          </Text>
          <AutoLayout
            name="Frame 1000002145"
            fill="#333"
            cornerRadius={4}
            overflow="visible"
            spacing={10}
            padding={{
              vertical: 4,
              horizontal: 8,
            }}
            horizontalAlignItems="center"
            verticalAlignItems="center"
          >
            <Text
              name="Create a Pull Request"
              fill="#FFF"
              verticalAlignText="center"
              fontFamily="Roboto Mono"
              fontSize={12}
            >
              {ref}
            </Text>
          </AutoLayout>
        </AutoLayout>
      </AutoLayout>
    </AutoLayout>
  );
};
