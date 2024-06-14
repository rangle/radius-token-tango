import { WidgetConfiguration } from "@repo/config";
import { Icon16px, IconProps } from "./icon";
import { RoundButton } from "./round-button";
import { TokenChangeBar } from "./token-change-bar";
import { VersionBump } from "./version-bump";
import { WarningBadge } from "./warning-badge";
import { colors } from "@repo/bandoneon";

const { widget } = figma;
const { SVG, Text, AutoLayout } = widget;

export type SuccessfullyPushedDetails = {
  branch: string;
  ref: string;
  repository: string;
  version: string;
};

export type SuccessPanelProps = {
  details: SuccessfullyPushedDetails;
  reloadTokens: () => void;
} & BaseProps &
  TextChildren;

export const createNewPRUrl = (repository: string, branch: string) =>
  `https://github.com/${repository}/pull/new/${branch}`;

export const SuccessPanel: FunctionalWidget<SuccessPanelProps> = ({
  details: { branch, ref, repository },
  reloadTokens,
}) => {
  return (
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
        spacing={16}
        verticalAlignItems="center"
        horizontalAlignItems="center"
      >
        <AutoLayout
          name="Frame 1000002083"
          strokeWidth={1.474}
          overflow="visible"
          spacing={14.735}
          horizontalAlignItems="center"
          verticalAlignItems="center"
        >
          <AutoLayout
            name="Frame 1000002105"
            fill="#00B012"
            cornerRadius={9233.1904296875}
            strokeWidth={0.923}
            overflow="visible"
            spacing={4}
            padding={{
              top: 3.694,
              right: 12,
              bottom: 3.694,
              left: 6,
            }}
            height={22}
            horizontalAlignItems="end"
            verticalAlignItems="center"
          >
            <Icon16px name="Vector" icon="check" color="#FFF" size={24} />
            <Text
              name="date"
              fill="#FFF"
              horizontalAlignText="center"
              lineHeight="140%"
              fontFamily="Inter"
              fontSize={14}
              letterSpacing={0.24}
            >
              pushed to branch:
            </Text>
            <Text
              name="date"
              fill="#FFF"
              horizontalAlignText="center"
              lineHeight="140%"
              fontFamily="Roboto Mono"
              letterSpacing={0.24}
              fontSize={16}
              fontWeight={700}
            >
              {branch}
            </Text>
          </AutoLayout>
        </AutoLayout>
        <AutoLayout
          name="Frame 1000002122"
          overflow="visible"
          spacing={4}
          horizontalAlignItems="center"
          verticalAlignItems="center"
          onClick={() => figma.openExternal(createNewPRUrl(repository, branch))}
        >
          <SVG
            name="Vector"
            height={22}
            width={22}
            src="<svg width='23' height='23' viewBox='0 0 23 23' fill='none' xmlns='http://www.w3.org/2000/svg'>
  <path d='M11.4999 0.468628C5.39768 0.468628 0.448486 5.54201 0.448486 11.7995C0.448486 16.8058 3.61471 21.0529 8.00674 22.5515C8.55839 22.6564 8.73704 22.3051 8.73704 22.0067V19.8973C5.66292 20.5829 5.02286 18.5603 5.02286 18.5603C4.52 17.2506 3.79522 16.9021 3.79522 16.9021C2.7923 16.1987 3.87166 16.2138 3.87166 16.2138C4.98141 16.2931 5.56529 17.3819 5.56529 17.3819C6.5507 19.1136 8.1504 18.6131 8.78126 18.3233C8.87979 17.5915 9.16621 17.091 9.48301 16.8087C7.02869 16.5207 4.44818 15.549 4.44818 11.2084C4.44818 9.9705 4.88011 8.96016 5.58648 8.167C5.47228 7.8809 5.09377 6.72798 5.69423 5.1681C5.69423 5.1681 6.62255 4.86406 8.73429 6.32952C9.61563 6.07835 10.5605 5.95276 11.4999 5.94803C12.4393 5.95276 13.3851 6.07835 14.2683 6.32952C16.3782 4.86406 17.3047 5.1681 17.3047 5.1681C17.9061 6.72892 17.5275 7.88184 17.4133 8.167C18.1224 8.96016 18.5506 9.97144 18.5506 11.2084C18.5506 15.5604 15.9656 16.5188 13.5048 16.7992C13.9008 17.1505 14.2628 17.8398 14.2628 18.8974V22.0067C14.2628 22.3079 14.4396 22.662 15.0004 22.5505C19.3888 21.0502 22.5514 16.8039 22.5514 11.7995C22.5514 5.54201 17.6031 0.468628 11.4999 0.468628Z' fill='#262626'/>
  </svg>
  "
          />
          <Text
            name="Create a Pull Request"
            fill="#262626"
            verticalAlignText="center"
            horizontalAlignText="center"
            lineHeight="150%"
            fontFamily="Inter"
            fontSize={20}
            fontWeight={700}
            textDecoration="underline"
          >
            Create a Pull Request
          </Text>
        </AutoLayout>
        <AutoLayout
          spacing={6}
          padding={8}
          direction="vertical"
          horizontalAlignItems={"center"}
        >
          <AutoLayout spacing={4}>
            <Text
              name="PRapprovedOne"
              fill="#262626"
              lineHeight="150%"
              fontFamily="Inter"
              fontSize={13}
            >
              PR needs to be approved and merged to
            </Text>
            <Text
              name="PRapprovedTwo"
              fill="#262626"
              lineHeight="150%"
              fontFamily="Roboto Mono"
              fontWeight={700}
              fontSize={13}
            >
              {ref}
            </Text>
          </AutoLayout>
          <AutoLayout>
            <Text
              name="PRapprovedThree"
              fill="#262626"
              lineHeight="150%"
              fontFamily="Inter"
              fontSize={13}
            >
              before its changes can be reflected as your current version
            </Text>
          </AutoLayout>
        </AutoLayout>
      </AutoLayout>
      <AutoLayout
        name="Frame 1000002007"
        fill={colors.active.bg}
        cornerRadius={69}
        overflow="visible"
        spacing={8}
        padding={{
          vertical: 8,
          horizontal: 24,
        }}
        height={37}
        horizontalAlignItems="center"
        verticalAlignItems="center"
        onClick={() => {
          reloadTokens();
        }}
      >
        <RoundButton
          name="CheckAgainButton"
          icon="refresh"
          onClick={() => reloadTokens()}
        >
          Reload your tokens
        </RoundButton>
      </AutoLayout>
    </AutoLayout>
  );
};
