const { widget } = figma;
const { AutoLayout, Text, useSyncedState } = widget;

import { NameFormat } from "../components/name-format";
import { LoadedTokens } from "../../code";
import { Icon16px } from "../components/icon";
import { TokenIssuesSummaryProps } from "../components/token-issues-summary";
import { TokenValidationResult } from "../../common/token.utils";
import { PushPanel } from "../components/push-panel";
import { RepositoryTokenLayers } from "../../services/load-github.services";
import { diffTokenLayers } from "../../common/layer-diff.utils";
import { isTokenLayers } from "../../common/generator.utils";

type LoadedPageProps = {
  allTokens: LoadedTokens;
  synchDetails: RepositoryTokenLayers;
  reloadTokens: () => void;
  pushTokens: (branch: string, message: string, version: string) => void;
};

const sum =
  <P,>(transform: (i: P) => number) =>
  (acc: number, item: P) =>
    acc + transform(item);

export const LoadedPage = ({
  allTokens: { collections, errors, inspectedAt, tokenLayers },
  synchDetails: [previousTokenLayers, packageJson, meta],
  reloadTokens,
  pushTokens,
}: LoadedPageProps) => {
  const summary = {
    collections: collections.length,
    totalTokens: collections.reduce(
      sum(({ modes: [mode] }) => mode.variables.length),
      0,
    ),
    issues: errors,
  };

  const collectionList = collections.map(({ name, modes }) => {
    const [{ variables }] = modes;
    const variableNames = variables.map(({ name }) => name);
    const { layer, segment } = variableNames.reduce(
      (acc, name) => {
        const [layerName, segmentName] = name.split("/");
        if (acc.layer[layerName] && acc.segment[segmentName]) return acc;
        const { layer, segment } = acc;
        return {
          layer: layer[layerName]
            ? layer
            : { ...layer, [layerName]: layerName },
          segment: segment[segmentName]
            ? segment
            : { ...segment, [segmentName]: segmentName },
        };
      },
      { layer: {}, segment: {} } as Record<string, Record<string, string>>,
    );
    return {
      name,
      modeNames: modes.map(({ name }) => name),
      layerNames: Object.keys(layer),
      subjectNames: Object.keys(segment),
      totalTokens: variableNames.length,
      totalAliases: variables.filter(({ alias }) => alias).length,
      issues: errors.filter((e) => e.collection === name),
    };
  });

  if (!isTokenLayers(tokenLayers) || !isTokenLayers(previousTokenLayers))
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
        <AutoLayout
          direction="horizontal"
          width={"fill-parent"}
          spacing={"auto"}
        >
          <NameFormat />
        </AutoLayout>
        <AutoLayout>
          <Text>Token Layer File has the wrong format</Text>
        </AutoLayout>
      </AutoLayout>
    );

  const [added, modified, deleted] = diffTokenLayers(
    tokenLayers,
    previousTokenLayers,
  );

  const addedErrs = errors.filter(
    (e) => added.indexOf(e.variable.name.replaceAll("/", ".")) !== -1,
  );
  const modifiedErrs = errors.filter(
    (e) => modified.indexOf(e.variable.name.replaceAll("/", ".")) !== -1,
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
        <NameFormat />
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
