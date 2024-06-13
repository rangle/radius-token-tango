const { widget } = figma;
const { AutoLayout, Text, useSyncedState } = widget;

import { NameFormat } from "../components/name-format";
import { LoadedTokens } from "../../code";
import { Icon16px } from "../components/icon";
import { TokenIssuesSummaryProps } from "../components/token-issues-summary";
import { PushPanel } from "../components/push-panel";
import { RepositoryTokenLayers } from "../../services/load-github.services";
import { diffTokenLayers } from "../../common/layer-diff.utils";
import { isTokenLayers } from "../../common/generator.utils";
import {
  TokenNameFormatType,
  formats,
  FormatValidationResult,
  TokenCollection,
  isTokenValidationResult,
} from "radius-toolkit";
import { isNotNil } from "../../common/component.utils";
import { colors } from "@repo/bandoneon";

type LoadedPageProps = {
  format: TokenNameFormatType;
  allTokens: LoadedTokens;
  errors: FormatValidationResult[];
  synchDetails: RepositoryTokenLayers;
  reloadTokens: () => void;
  pushTokens: (branch: string, message: string, version: string) => void;
};

const sum =
  <P,>(transform: (i: P) => number) =>
  (acc: number, item: P) =>
    acc + transform(item);

export const LoadedPage: FunctionalWidget<LoadedPageProps> = ({
  format,
  allTokens: { collections, inspectedAt, tokenLayers },
  errors,
  synchDetails: [previousTokenLayers, packageJson, meta],
  reloadTokens,
  pushTokens,
}) => {
  console.log("BEGIN RENDERING LOADED PAGE 1");
  const summary = getSummaryOfCollections(collections, errors);

  console.log("BEGIN RENDERING LOADED PAGE 2");

  const collectionList = renderCollectionList(collections, format, errors);

  console.log("RENDERING LOADED PAGE");

  if (!isTokenLayers(tokenLayers) || !isTokenLayers(previousTokenLayers))
    return invalidLayersFile(format, reloadTokens);

  console.log("DIFF TOKEN LAYERS");
  const [added, modified, deleted] = diffTokenLayers(
    tokenLayers,
    previousTokenLayers,
  );
  console.log("ADDED", added);
  console.log("MODIFIED", modified);
  console.log("DELETED", deleted);

  // we only want to detail errors related to tokens
  const tokenErrors = errors.filter(isTokenValidationResult);

  // separate errors in added tokens and modified tokens
  const addedErrs = tokenErrors.filter(
    (e) => added.indexOf(e.token.name) !== -1,
  );
  const modifiedErrs = tokenErrors.filter(
    (e) => modified.indexOf(e.token.name) !== -1,
  );

  return (
    <AutoLayout
      name="loadedPage"
      cornerRadius={12}
      padding={16}
      spacing={16}
      direction="vertical"
      width={"fill-parent"}
      fill="#fff"
    >
      <AutoLayout direction="horizontal" width={"fill-parent"} spacing={"auto"}>
        <NameFormat formats={formats} format={format} />
      </AutoLayout>
      <AutoLayout
        name="HorizontalPanel"
        direction="horizontal"
        width="fill-parent"
        spacing={"auto"}
      >
        <AutoLayout direction="vertical" spacing={6}>
          <TokenIssuesSummaryProps {...summary} lastUpdated={inspectedAt}>
            <Icon16px icon="refresh" onClick={reloadTokens} />
          </TokenIssuesSummaryProps>
          <PushPanel
            previousVersion={meta.version}
            diff={[added, modified, deleted]}
            errors={[addedErrs, modifiedErrs]}
            reloadTokens={reloadTokens}
            pushTokens={pushTokens}
          />
        </AutoLayout>
      </AutoLayout>
    </AutoLayout>
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
    <AutoLayout
      name="loadedPage"
      cornerRadius={12}
      padding={8}
      spacing={16}
      direction="vertical"
      width={"fill-parent"}
      fill="#fff"
      horizontalAlignItems={"center"}
    >
      <AutoLayout
        direction="horizontal"
        width={"fill-parent"}
        spacing={"auto"}
        horizontalAlignItems={"center"}
      >
        <NameFormat formats={formats} format={format} />
      </AutoLayout>
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
    </AutoLayout>
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
