const { widget } = figma;
const { AutoLayout, Text } = widget;

import { NameFormat } from "../components/name-format";
import { TokenIssuesSummary } from "../components/token-issues-summary";
import { PushPanel } from "../components/push-panel";
import { isTokenLayers } from "../../common/generator.utils";
import { isTokenValidationResult, diffTokenLayers } from "radius-toolkit";
import { borderRadius, colors } from "@repo/bandoneon";
import { SuccessPanel } from "../components/success-panel";
import { createLogger } from "@repo/utils";
import { Fragment } from "preact";
import { LoadedAppState } from "../../types/app-state";
import { AppStateActions } from "../../hooks/use-app-state";

const log = createLogger("pages:loaded");

type LoadedPageProps = {
  state: LoadedAppState;
  actions: Pick<
    AppStateActions,
    "loadTokens" | "loadIcons" | "clearIcons" | "saveTokens"
  >;
  openIssues: () => void;
  pushTokens: (branch: string, message: string, version: string) => void;
};

const sum =
  <P,>(transform: (i: P) => number) =>
  (acc: number, item: P) =>
    acc + transform(item);

/**
 * Page shown when tokens are loaded
 */
export const LoadedPage: FunctionalWidget<LoadedPageProps> = ({
  state,
  actions,
  openIssues,
  pushTokens,
}) => {
  log("debug", "BEGIN RENDERING LOADED PAGE 1", state.successfullyPushed);

  const { collections, inspectedAt, tokenLayers } = state.parsedTokens;
  const [previousTokenLayers, packageJson, meta] = state.synchDetails || [];

  const summary = getSummaryOfCollections(collections, state.allErrors);

  log("debug", "BEGIN RENDERING LOADED PAGE 2");

  const collectionList = renderCollectionList(
    collections,
    state.tokenFormatType,
    state.allErrors,
  );

  log("debug", "RENDERING LOADED PAGE");

  if (!isTokenLayers(tokenLayers) || !isTokenLayers(previousTokenLayers))
    return invalidLayersFile(state.tokenFormatType, actions.loadTokens);

  log("debug", "DIFF TOKEN LAYERS");
  const [added, modified, deleted] = diffTokenLayers(
    tokenLayers,
    previousTokenLayers,
  );
  log("debug", "ADDED", added);
  log("debug", "MODIFIED", modified);
  log("debug", "DELETED", deleted);

  // we only want to detail errors related to tokens
  const tokenIssues = state.allErrors.filter(isTokenValidationResult);

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
        loadedIcons={state.loadedVectors}
        openIssues={openIssues}
        loadIcons={actions.loadIcons}
        clearIcons={actions.clearIcons}
        refreshTokens={actions.loadTokens}
      />
      <AutoLayout
        name="PublishSummaryPanel"
        overflow="visible"
        direction="vertical"
        width="fill-parent"
        padding={8}
        fill={
          state.successfullyPushed
            ? colors.success.muted
            : colors.repository.muted
        }
        cornerRadius={borderRadius.base}
      >
        {state.successfullyPushed ? (
          <SuccessPanel details={state.successfullyPushed} />
        ) : (
          <PushPanel
            previousVersion={meta?.version || "0.0.0"}
            diff={[added, modified, deleted]}
            issues={[addedErrs, modifiedErrs]}
            reloadTokens={actions.loadTokens}
            pushTokens={pushTokens}
            openIssues={openIssues}
          />
        )}
      </AutoLayout>
    </Fragment>
  );
};

const renderCollectionList = (
  collections: LoadedAppState["parsedTokens"]["collections"],
  format: LoadedAppState["tokenFormatType"],
  errors: LoadedAppState["allErrors"],
) => {
  return collections.map(({ name, modes }) => {
    const [mode] = modes;
    const variables = mode?.variables ?? [];
    const variableNames = variables.map(({ name }) => name);
    const segmentNames = format.segments;

    const variablesAsSegments = variables.map(({ name }) =>
      name.split(format.separator),
    );

    const segmentsBySegmentName = segmentNames.reduce<Record<string, string[]>>(
      (acc, segmentName, idx) => {
        const uniqueSegments = new Set(
          variablesAsSegments
            .map((segments) => segments[idx])
            .filter((s): s is string => s !== undefined),
        );
        return {
          ...acc,
          [segmentName]: Array.from(uniqueSegments),
        };
      },
      {},
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
  format: LoadedAppState["tokenFormatType"],
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
  collections: LoadedAppState["parsedTokens"]["collections"],
  errors: LoadedAppState["allErrors"],
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
