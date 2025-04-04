const { widget } = figma;
const { AutoLayout, Text, useSyncedState } = widget;

import { NameFormat } from "../components/name-format";
import { LoadedTokens } from "../../code";
import { Icon16px } from "../components/icon";
import {
  TokenIssuesSummary,
  TokenIssuesSummaryProps,
} from "../components/token-issues-summary";
import { PushPanel } from "../components/push-panel";
import { isTokenLayers } from "../../common/generator.utils";
import {
  TokenNameFormatType,
  formats,
  FormatValidationResult,
  TokenCollection,
  isTokenValidationResult,
  diffTokenLayers,
} from "radius-toolkit";
import { isNotNil } from "radius-toolkit";
import { borderRadius, colors } from "@repo/bandoneon";
import {
  SuccessPanel,
  SuccessfullyPushedDetails,
} from "../components/success-panel";

import { createLogger } from "@repo/utils";
import { RepositoryTokenLayers } from "../../../types/state";
import { Fragment } from "preact";

const log = createLogger("pages:loaded");

type LoadedPageProps = {
  format: TokenNameFormatType;
  allTokens: LoadedTokens;
  issues: FormatValidationResult[];
  synchDetails: RepositoryTokenLayers;
  successfullyPushed: SuccessfullyPushedDetails | null;
  loadedIcons: number | null;
  loadIcons: () => void;
  clearIcons: () => void;
  reloadTokens: () => void;
  openIssues: () => void;
  pushTokens: (branch: string, message: string, version: string, skipVersionUpdate: boolean) => void;
};

const sum =
  <P,>(transform: (i: P) => number) =>
  (acc: number, item: P) =>
    acc + transform(item);

export const LoadedPage: FunctionalWidget<LoadedPageProps> = ({
  format,
  allTokens: { collections, inspectedAt, tokenLayers },
  issues,
  synchDetails: [previousTokenLayers, packageJson, meta],
  successfullyPushed,
  loadedIcons,
  loadIcons,
  clearIcons,
  openIssues,
  reloadTokens,
  pushTokens,
}) => {
  log("debug", "BEGIN RENDERING LOADED PAGE 1", successfullyPushed);

  const summary = getSummaryOfCollections(collections, issues);

  log("debug", "BEGIN RENDERING LOADED PAGE 2");

  const collectionList = renderCollectionList(collections, format, issues);

  log("debug", "RENDERING LOADED PAGE");

  if (!isTokenLayers(tokenLayers) || !isTokenLayers(previousTokenLayers))
    return invalidLayersFile(format, reloadTokens);

  log("debug", "DIFF TOKEN LAYERS");
  const [added, modified, deleted] = diffTokenLayers(
    tokenLayers,
    previousTokenLayers,
  );
  log("debug", "ADDED", added);
  log("debug", "MODIFIED", modified);
  log("debug", "DELETED", deleted);

  // we only want to detail errors related to tokens
  const tokenIssues = issues.filter(isTokenValidationResult);

  // separate errors in added tokens and modified tokens
  const addedErrs = tokenIssues.filter(
    (e) => added.indexOf(e.token.name) !== -1,
  );
  const modifiedErrs = tokenIssues.filter(
    (e) => modified.indexOf(e.token.name) !== -1,
  );

  return (
    <Fragment>
      <TokenIssuesSummary
        {...summary}
        lastUpdated={inspectedAt}
        loadedIcons={loadedIcons}
        openIssues={openIssues}
        loadIcons={loadIcons}
        clearIcons={clearIcons}
        refreshTokens={reloadTokens}
      />
      <AutoLayout
        name="PublishSummaryPanel"
        overflow="visible"
        direction="vertical"
        width="fill-parent"
        padding={8}
        fill={
          successfullyPushed ? colors.success.muted : colors.repository.muted
        }
        cornerRadius={borderRadius.base}
      >
        {successfullyPushed ? (
          <SuccessPanel details={successfullyPushed} />
        ) : (
          <PushPanel
            previousVersion={meta.version}
            diff={[added, modified, deleted]}
            issues={[addedErrs, modifiedErrs]}
            reloadTokens={reloadTokens}
            pushTokens={pushTokens}
            openIssues={openIssues}
          />
        )}
      </AutoLayout>
    </Fragment>
  );
};

const renderCollectionList = (
  collections: LoadedTokens["collections"],
  format: TokenNameFormatType,
  errors: FormatValidationResult[],
) => {
  return collections.map(({ name, modes }) => {
    const [mode] = modes;
    const variables = mode?.variables ?? [];
    const variableNames = variables.map(({ name }) => name);
    const segmentNames = format.segments;

    const variablesAsSegments = variables.map(({ name }) =>
      name.split(format.separator),
    );

    const segmentsBySegmentName = segmentNames.reduce(
      (acc, segmentName, idx) => {
        const uniqueSegments = new Set(
          variablesAsSegments.map((segments) => segments[idx]),
        );
        return {
          ...acc,
          [segmentName]: Array.from(uniqueSegments).filter(isNotNil),
        };
      },
      {} as Record<string, string[]>,
    );

    return {
      name,
      modeNames: modes.map(({ name }) => name),
      segmentsBySegmentName,
      totalTokens: variableNames.length,
      totalAliases: variables.filter(({ alias }) => alias).length,
      issues: errors.filter(
        (e) => isTokenValidationResult(e) && e.token.name === name,
      ),
    };
  });
};
function invalidLayersFile(
  format: TokenNameFormatType,
  reloadTokens: () => void,
): FigmaDeclarativeNode {
  return (
    <Fragment>
      <AutoLayout
        width={"fill-parent"}
        overflow="visible"
        direction="vertical"
        spacing={10}
        padding={10}
        horizontalAlignItems="center"
      >
        <Text verticalAlignText="center" horizontalAlignText="center">
          Token Layers File has the wrong format
        </Text>
      </AutoLayout>
      <AutoLayout
        name="ReloadButtonFrame"
        fill={colors.active.bg}
        cornerRadius={69}
        overflow="visible"
        direction="vertical"
        spacing={10}
        horizontalAlignItems="center"
        padding={{
          vertical: 8,
          horizontal: 24,
        }}
        height={37}
        onClick={reloadTokens}
      >
        <AutoLayout
          name="RealoadButtonClickable"
          overflow="visible"
          spacing={8}
        >
          <Text
            name="Button Label"
            fill={colors.active.fg}
            verticalAlignText="center"
            horizontalAlignText="center"
            lineHeight="150%"
            fontFamily="Inter"
            fontSize={14}
            fontWeight={700}
          >
            Let's try loading your tokens again
          </Text>
        </AutoLayout>
      </AutoLayout>
    </Fragment>
  );
}

function getSummaryOfCollections(
  collections: TokenCollection[],
  errors: FormatValidationResult[],
) {
  return {
    collections: collections.length,
    totalTokens: collections.reduce(
      sum(({ modes: [mode] }) => mode?.variables.length ?? 0),
      0,
    ),
    issues: errors,
  };
}
