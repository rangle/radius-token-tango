const { widget } = figma;
const { Line, AutoLayout, Text, useSyncedState, Fragment } = widget;

import { colors } from "@repo/bandoneon";
import { FormatValidationResult, TokenValidationResult } from "radius-toolkit";
import { Icon16px } from "./icon";
import { Button } from "./button";
import { RoundButton } from "./round-button";
import { ErrorPill } from "./error-pill";
import { LgButton } from "./lg-button";

export type TokenIssuesSummaryProps = {
  collections: number;
  totalTokens: number;
  issues: FormatValidationResult[];
  lastUpdated: string;
  loadedIcons: number | null;
  openIssues: () => void;
};

export const TokenIssuesSummaryProps: FunctionalWidget<
  TokenIssuesSummaryProps & HasChildrenProps
> = ({
  collections,
  issues,
  totalTokens,
  lastUpdated,
  loadedIcons,
  openIssues,
}) => {
  const warnings = issues.filter(({ isWarning }) => isWarning);
  const errors = issues.filter(({ isWarning }) => !isWarning);
  return (
    <AutoLayout
      name="Summary"
      overflow="visible"
      direction="vertical"
      spacing={14}
      verticalAlignItems="center"
      horizontalAlignItems="center"
    >
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
            fill={colors.data.fg}
            width={100}
            horizontalAlignText="center"
            lineHeight="140%"
            fontFamily="Inter"
            fontSize={12}
            letterSpacing={0.24}
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
            fill={colors.data.fg}
            width={100}
            horizontalAlignText="center"
            lineHeight="140%"
            fontFamily="Inter"
            fontSize={12}
            letterSpacing={0.24}
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
              fill={colors.data.info}
              width={"hug-contents"}
              horizontalAlignText="center"
              lineHeight="140%"
              fontFamily="Inter"
              fontSize={12}
              letterSpacing={0.24}
            >
              Vectors
            </Text>
          </AutoLayout>
        </AutoLayout>
      </AutoLayout>
      <AutoLayout name="ManageTokens" overflow="visible" spacing={8}>
        <LgButton
          icon="tune"
          onClick={openIssues}
          color={colors.active.bg}
          label="Manage Libraries"
        >
          {errors.length ? (
            <ErrorPill>{errors.length} Errors</ErrorPill>
          ) : (
            <Text></Text>
          )}
          {warnings.length ? (
            <ErrorPill level="warning">{warnings.length} Warnings</ErrorPill>
          ) : (
            <Text></Text>
          )}
        </LgButton>
      </AutoLayout>
      <AutoLayout name="LastSync" spacing={8} verticalAlignItems="center">
        <Text
          name="Last sync"
          fill="#767676"
          lineHeight="140%"
          fontFamily="Inter"
          fontSize={12}
          letterSpacing={0.24}
        >
          Last sync
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
            fill="#767676"
            fontFamily="Roboto Mono"
            fontSize={12}
          >
            {lastUpdated}
          </Text>
        </AutoLayout>
      </AutoLayout>
    </AutoLayout>
  );
};
