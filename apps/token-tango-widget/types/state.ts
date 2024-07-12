import { EventHandler } from "@create-figma-plugin/utilities";
import { PushMessageType, WidgetConfiguration } from "@repo/config";
import {
  GithubFileDetails,
  LastCommit,
  PackageJSON,
  isPackageJSON,
} from "@repo/utils";
import {
  FormatValidationResult,
  TokenLayers,
  TokenNameFormatType,
  isString,
  isTokenCollection,
  isVectorOutput,
} from "radius-toolkit";
import { isTokenLayers } from "../src/common/generator.utils";
import { version } from "preact/compat";

export interface WidgetStateHandler extends EventHandler {
  name: "PLUGIN_STATE_CHANGE";
  handler: (state: WidgetConfiguration | null) => void;
}

export interface UiStateHandler extends EventHandler {
  name: "UI_STATE_CHANGE";
  handler: (state: WidgetConfiguration) => void;
}

export interface ConfirmPushHandler extends EventHandler {
  name: "PLUGIN_CONFIRM_PUSH";
  handler: (state: (PushMessageType & WidgetConfiguration) | null) => void;
}

export interface UiCommitHandler extends EventHandler {
  name: "UI_COMMIT_CHANGE";
  handler: (state: PushMessageType) => void;
}

export interface IssueVisualizerHandler extends EventHandler {
  name: "PLUGIN_VIEW_ISSUE";
  handler: (serializedState: string) => void;
}

export interface UiCloseHandler extends EventHandler {
  name: "UI_CLOSE";
  handler: () => void;
}

export type RepositoryTokenLayers = readonly [
  TokenLayers,
  PackageJSON | undefined,
  {
    name: string;
    version: string;
    lastCommits: Array<LastCommit>;
    packageFileDetails: GithubFileDetails | undefined;
  },
];

export const getState = (
  persistedTokens: string | null,
  persistedIcons: string | null,
  syncDetails: RepositoryTokenLayers | null,
  format: TokenNameFormatType,
  issues: FormatValidationResult[],
) => {
  if (!persistedTokens || !syncDetails || !syncDetails)
    throw new Error("Invalid state");
  // get the new token layers
  const { collections, tokenLayers, inspectedAt } = JSON.parse(persistedTokens);
  const vectors = persistedIcons ? JSON.parse(persistedIcons) : undefined;
  const [oldTokenLayers, packagejson, meta] = syncDetails;

  return {
    collections:
      Array.isArray(collections) && collections.every(isTokenCollection)
        ? collections
        : [],
    tokenLayers: isTokenLayers(tokenLayers)
      ? tokenLayers
      : ({ layers: [], order: [] } as TokenLayers),
    inspectedAt: isString(inspectedAt) ? inspectedAt : undefined,
    vectors:
      Array.isArray(vectors) && vectors.every(isVectorOutput)
        ? vectors
        : undefined,
    oldTokenLayers: isTokenLayers(oldTokenLayers) ? oldTokenLayers : undefined,
    packagejson: isPackageJSON(packagejson) ? packagejson : undefined,
    meta,
    format,
    issues,
  };
};

export type State = ReturnType<typeof getState>;

export const serializeState = (state: State) =>
  JSON.stringify({
    collections: state.collections,
    tokenLayers: state.tokenLayers,
    inspectedAt: state.inspectedAt,
    vectors: state.vectors,
    oldTokenLayers: state.oldTokenLayers,
    version: state.packagejson?.version,
    meta: state.meta,
    format: state.format,
    issues: state.issues,
  });

export const isState = (u: unknown): u is State =>
  !!u &&
  typeof u === "object" &&
  "collections" in u &&
  "tokenLayers" in u &&
  "inspectedAt" in u &&
  "oldTokenLayers" in u &&
  "meta" in u &&
  "format" in u &&
  "issues" in u;

export const whyIsState = (u: unknown) => {
  console.log(!!u);
  if (!u) return;
  console.log(typeof u === "object");
  if (typeof u !== "object") return;
  console.log("collections" in u);
  console.log("tokenLayers" in u);
  console.log("inspectedAt" in u);
  console.log("oldTokenLayers" in u);
  console.log("meta" in u);
  console.log("format" in u);
  console.log("issues" in u);
};

export const deserializeState = (serializedState: string): State => {
  const parsedState = JSON.parse(serializedState);
  if (!isState(parsedState)) throw new Error("Invalid state");
  return parsedState;
};
