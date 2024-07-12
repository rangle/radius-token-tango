const { widget } = figma;
const { Line, AutoLayout, Text, useSyncedState, Fragment } = widget;

import { colors, typography } from "@repo/bandoneon";
import { FormatValidationResult, TokenValidationResult } from "radius-toolkit";
import { Icon16px } from "./icon";
import { Button } from "./button";
import { RoundButton } from "./round-button";
import { LgButton } from "./lg-button";
import { LibraryButton } from "./library-button";
import { IssuePill } from "./IssuePill";

export type TokenIssuesSummaryProps = {
  collections: number;
  totalTokens: number;
  issues: FormatValidationResult[];
  lastUpdated: string;
  loadedIcons: number | null;
  openIssues: () => void;
  loadIcons: () => void;
  clearIcons: () => void;
  refreshTokens: () => void;
};

export const TokenIssuesSummary: FunctionalWidget<
  TokenIssuesSummaryProps & HasChildrenProps
> = ({
  collections,
  issues,
  totalTokens,
  lastUpdated,
  loadedIcons,
  openIssues,
  loadIcons,
  clearIcons,
  refreshTokens,
}) => {
  const warnings = issues.filter(({ isWarning }) => isWarning);
  const errors = issues.filter(({ isWarning }) => !isWarning);
  return (
    <AutoLayout
      name="LocalSummary"
      fill="#FFF"
      stroke="#E0E0E0"
      cornerRadius={16}
      overflow="visible"
      direction="vertical"
      spacing={14}
      padding={{
        top: 16,
        right: 0,
        bottom: 24,
        left: 0,
      }}
      width={544}
      verticalAlignItems="center"
      horizontalAlignItems="center"
    >
      <AutoLayout
        name="LocalSummaryHeader"
        overflow="visible"
        spacing="auto"
        padding={{
          vertical: 0,
          horizontal: 16,
        }}
        width="fill-parent"
        verticalAlignItems="center"
      >
        <Text
          name="Tokens to publish:"
          fill="#000"
          lineHeight="140%"
          fontFamily="Inter"
          fontSize={18}
          fontWeight={700}
        >
          Local:
        </Text>
        <AutoLayout name="LastSync" spacing={8} verticalAlignItems="center">
          <Text
            name="Last sync"
            fill="#262626"
            lineHeight="140%"
            fontFamily="Inter"
            fontSize={14}
            fontWeight={700}
          >
            Last sync:
          </Text>
          <AutoLayout
            name="Layer"
            overflow="visible"
            spacing={4}
            padding={{
              vertical: 8,
              horizontal: 0,
            }}
          >
            <Text
              name="11/11/2011- 9:01am"
              fill="#000"
              lineHeight="140%"
              fontFamily="Inter"
              fontSize={12}
            >
              {lastUpdated}
            </Text>
          </AutoLayout>
        </AutoLayout>
      </AutoLayout>
      <AutoLayout
        name="SummaryContent"
        overflow="visible"
        horizontalAlignItems="center"
        verticalAlignItems="center"
      >
        <AutoLayout
          name="SummaryItem"
          cornerRadius={4}
          overflow="visible"
          direction="vertical"
          spacing={8}
          padding={8}
          horizontalAlignItems="center"
        >
          <Text
            name="5"
            fill={colors.data.info}
            lineHeight="100%"
            fontFamily="Inter"
            fontSize={24}
            fontWeight={700}
          >
            {collections}
          </Text>
          <Text
            name="Collections"
            width={100}
            horizontalAlignText="center"
            {...typography.small}
            fill={colors.data.fg}
          >
            Collections
          </Text>
        </AutoLayout>
        <Line name="Divider" stroke="#D9D9D9" length={48} rotation={-90} />
        <AutoLayout
          name="SummaryItem"
          cornerRadius={4}
          overflow="visible"
          direction="vertical"
          spacing={8}
          padding={8}
          horizontalAlignItems="center"
        >
          <Text
            name="31"
            fill={colors.data.info}
            lineHeight="100%"
            fontFamily="Inter"
            fontSize={24}
            fontWeight={700}
          >
            {totalTokens}
          </Text>
          <Text
            name="Tokens"
            width={100}
            horizontalAlignText="center"
            {...typography.small}
            fill={colors.data.fg}
          >
            Tokens
          </Text>
        </AutoLayout>
        <Line name="Divider" stroke="#D9D9D9" length={48} rotation={-90} />
        <AutoLayout
          name="SummaryItem"
          cornerRadius={4}
          overflow="visible"
          direction="vertical"
          spacing={8}
          padding={8}
          horizontalAlignItems="center"
        >
          <Text
            name="28"
            fill={colors.data.fg}
            lineHeight="100%"
            fontFamily="Inter"
            fontSize={24}
            fontWeight={700}
          >
            {loadedIcons ?? 0}
          </Text>
          <AutoLayout width={100} horizontalAlignItems={"center"} spacing={8}>
            <Text
              name="Issues"
              width={"hug-contents"}
              horizontalAlignText="center"
              {...typography.small}
              fill={colors.data.info}
            >
              Vectors
            </Text>
          </AutoLayout>
        </AutoLayout>
      </AutoLayout>
      <AutoLayout
        name="LocalSummaryActions"
        overflow="visible"
        direction="vertical"
        spacing={16}
        width={544}
        horizontalAlignItems="center"
      >
        <LgButton
          icon="tune"
          onClick={openIssues}
          color={colors.active.bg}
          label="Manage Library"
          padding={{
            vertical: 16,
            right: 16,
            left: 32,
          }}
        >
          <IssuePill issues={errors} />
          <IssuePill issues={warnings} />
        </LgButton>
        <AutoLayout
          name="Frame 1000002140"
          overflow="visible"
          spacing={8}
          width="fill-parent"
          horizontalAlignItems="center"
        >
          {loadedIcons ? (
            <LibraryButton
              icon="star"
              onClick={clearIcons}
              label={`Loaded vectors`}
              count={loadedIcons}
              state="loaded"
            ></LibraryButton>
          ) : (
            <LibraryButton
              icon="star"
              onClick={loadIcons}
              label="Select your Vectors"
            ></LibraryButton>
          )}
          <LibraryButton
            name="CheckAgainButton"
            icon="refresh"
            label="Refresh tokens"
            onClick={() => refreshTokens()}
          ></LibraryButton>
        </AutoLayout>
      </AutoLayout>
    </AutoLayout>
  );
};
