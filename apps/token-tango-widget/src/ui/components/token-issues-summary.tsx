const { widget } = figma;
const { Line, AutoLayout, Text, useSyncedState, Fragment } = widget;

import { TokenValidationResult } from "../../common/token.utils.js";

export type TokenIssuesSummaryProps = {
  collections: number;
  totalTokens: number;
  issues: TokenValidationResult[];
  lastUpdated: string;
};

export const TokenIssuesSummaryProps: FunctionalWidget<
  TokenIssuesSummaryProps & HasChildrenProps
> = ({ collections, issues, totalTokens, lastUpdated, children }) => {
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
            fill="#606060"
            lineHeight="100%"
            fontFamily="Inter"
            fontSize={24}
            fontWeight={700}
          >
            {collections}
          </Text>
          <Text
            name="Collections"
            fill="#262626"
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
            fill="#606060"
            lineHeight="100%"
            fontFamily="Inter"
            fontSize={24}
            fontWeight={700}
          >
            {totalTokens}
          </Text>
          <Text
            name="Tokens"
            fill="#262626"
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
            fill="#606060"
            lineHeight="100%"
            fontFamily="Inter"
            fontSize={24}
            fontWeight={700}
          >
            {issues.length}
          </Text>
          <Text
            name="Issues"
            fill="#262626"
            width={100}
            horizontalAlignText="center"
            lineHeight="140%"
            fontFamily="Inter"
            fontSize={12}
            letterSpacing={0.24}
          >
            Issues
          </Text>
        </AutoLayout>
      </AutoLayout>
      <AutoLayout name="LastSync" spacing={8} verticalAlignItems="center">
        {children}
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
