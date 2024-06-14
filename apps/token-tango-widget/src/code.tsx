import { EmptyPage } from "./ui/pages/empty-page";
import { emit, on } from "@create-figma-plugin/utilities";
import {
  ConfirmPushHandler,
  IssueVisualizerHandler,
  UiCloseHandler,
  UiCommitHandler,
  UiStateHandler,
  WidgetStateHandler,
} from "../types/state";
import {
  RepositoryTokenLayers,
  fetchRepositoryTokenLayers,
  saveRepositoryTokenLayers,
} from "./services/load-github.services";
import { getTokenLayers } from "./services/load-tokens.services";
import { LoadedPage } from "./ui/pages/loaded-page";
import { PageLayout } from "./ui/pages/layout";

import { version } from "../package.json";

import { PushMessageType, WidgetConfiguration } from "@repo/config";
import {
  FormatName,
  FormatValidationResult,
  TokenCollection,
  isTokenCollection,
  TokenLayers,
  TokenNameCollection,
  TokenNameFormatType,
  formats,
  toTokenNameCollection,
} from "radius-toolkit";
import { SuccessfullyPushedDetails } from "./ui/components/success-panel";

import { createLogger } from "@repo/utils";

const log = createLogger("WIDGET:code");

const { widget } = figma;
const { AutoLayout, useSyncedState, Text, waitForTask } = widget;

export type LoadedTokens = {
  inspectedAt: string;
  collections: TokenCollection[];
  tokenLayers?: TokenLayers;
};

export const isValidConfiguration = (
  u: WidgetConfiguration | unknown,
): u is WidgetConfiguration => {
  return !!u;
};

export function Widget() {
  const [synchConfiguration, setSynchConfiguration] =
    useSyncedState<WidgetConfiguration | null>("synchedState", null);
  const [errorMessage, setErrorMessage] = useSyncedState<string | null>(
    "errorState",
    null,
  );
  const [tokenNameFormat, setTokenNameFormat] =
    useSyncedState<FormatName | null>("tokenNameFormat", null);
  const [synchDetails, setSynchDetails] =
    useSyncedState<RepositoryTokenLayers | null>("synchDetails", null);
  const [successfullyPushed, setSuccessfullyPushed] =
    useSyncedState<SuccessfullyPushedDetails | null>(
      "successfullyPushedTokenDetails",
      null,
    );

  const [persistedTokens, setPersistedTokens] = useSyncedState<string | null>(
    "persistedTokens",
    null,
  );
  const [allErrors, setAllErrors] = useSyncedState<FormatValidationResult[]>(
    "allErrors",
    [],
  );

  const format = tokenNameFormat
    ? formats.find((f) => f.name === tokenNameFormat) ?? formats[0]
    : formats[0];

  const doSynchronize = synchRepository(
    synchConfiguration,
    setErrorMessage,
    setSynchDetails,
  );

  const doSaveTokens = saveTokensToRepository(
    synchConfiguration,
    setErrorMessage,
  );

  const updateStatus = (error?: string) => {
    log("debug", ">>> UPDATING STATUS");
    setSuccessfullyPushed(null);

    return synchConfiguration
      ? error
        ? setSynchConfiguration({
            ...synchConfiguration,
            error,
            status: "error",
          })
        : setSynchConfiguration({
            ...synchConfiguration,
            error: undefined,
            status: "online",
          })
      : {};
  };

  const doLoadTokensAndSynch = async () => {
    log("debug", ">>> LOADING YOUR TOKENS");
    waitForTask(
      Promise.all([
        loadVariables(format, setPersistedTokens, setAllErrors),
        doSynchronize(updateStatus),
      ]),
    );
  };

  return (
    <PageLayout
      synched={synchConfiguration !== null}
      error={errorMessage}
      appVersion={version}
      name={synchConfiguration ? synchConfiguration.name : ""}
      synchDetails={synchDetails}
      openConfig={createRepositoryConfigurationDialogCallback(
        synchConfiguration,
        setSynchConfiguration,
      )}
      synchronize={() => doSynchronize(updateStatus)}
    >
      {persistedTokens === null || synchDetails === null ? (
        <EmptyPage
          selectedFormat={tokenNameFormat}
          selectFormat={(newFormat) => setTokenNameFormat(newFormat)}
          synchConfig={synchConfiguration}
          loadTokens={async () => {
            log("debug", "Loading your tokens!");
            waitForTask(doLoadTokensAndSynch());
          }}
          openConfig={createRepositoryConfigurationDialogCallback(
            synchConfiguration,
            setSynchConfiguration,
          )}
        />
      ) : (
        <LoadedPage
          format={format}
          allTokens={JSON.parse(persistedTokens)}
          errors={allErrors}
          successfullyPushed={successfullyPushed}
          synchDetails={synchDetails}
          openIssues={createIssueDialogCallback(
            JSON.parse(persistedTokens),
            format,
            allErrors,
          )}
          reloadTokens={async () => {
            log("debug", ">>> RELOADING ALL VARIABLES");
            waitForTask(doLoadTokensAndSynch());
          }}
          pushTokens={createPushTokensDialogCallback((edits) => {
            log("debug", "PUSHING TO THE REPOSITORY", edits);
            log("debug", synchDetails);
            waitForTask(
              doSaveTokens(synchDetails ?? null, edits, () => {
                log("debug", "FINISHED!!");
                setSuccessfullyPushed({
                  branch: edits.branchName,
                  ref: synchConfiguration?.branch ?? "",
                  repository: synchConfiguration?.repository ?? "",
                  version: edits.version ?? "",
                });
              }),
            );
            log("debug", "FINISHED PUSHING TO THE REPOSITORY");
          })}
        />
      )}
    </PageLayout>
  );
}

widget.register(Widget);

async function loadVariables(
  format: TokenNameFormatType,
  setPersistedTokens: (newValue: string | null) => void,
  setAllErrors: (newValue: FormatValidationResult[]) => void,
) {
  log("debug", ">>> LOADING VARIABLES");
  const [collections, tokenLayers, errors] = await getTokenLayers(format, true);
  log("debug", tokenLayers);
  log("debug", errors);
  log("debug", ">>> SETTING STATE VARIABLES");
  setPersistedTokens(
    JSON.stringify({ collections, tokenLayers, inspectedAt: strNow() }),
  );
  log("debug", ">>> LOADED VARIABLES");
  setAllErrors(errors);
  log("debug", ">>> LOADED ERRORS");
}

function saveTokensToRepository(
  synchConfiguration: WidgetConfiguration | null,
  setErrorMessage: (newValue: string | null) => void,
) {
  return async (
    synchDetails: RepositoryTokenLayers | null,
    { branchName, commitMessage, version }: PushMessageType,
    done: () => void,
  ) => {
    log("debug", "saving tokens...");
    if (!isValidConfiguration(synchConfiguration)) {
      console.warn("Invalid Github configuration");
      setErrorMessage("Invalid Github configuration");
      return;
    }

    if (synchDetails === null) {
      console.warn("Invalid Loaded Data");
      setErrorMessage("Invalid Loaded Data");
      return;
    }

    return await saveRepositoryTokenLayers(
      {
        credentials: {
          accessToken: synchConfiguration.accessToken,
          repoFullName: synchConfiguration?.repository,
        },
        branch: synchConfiguration.branch,
        tokenFilePath: synchConfiguration.filePath,
        createFile: synchConfiguration.createNewFile,
      },
      synchDetails,
      commitMessage,
      branchName,
      version,
    )
      .then(done)
      .catch((e) => {
        log("debug", "WHAT??", e);
        throw new Error(e);
      });
  };
}

function synchRepository(
  synchConfiguration: WidgetConfiguration | null,
  setErrorMessage: (newValue: string | null) => void,
  setSynchDetails: (newValue: RepositoryTokenLayers | null) => void,
): (updateConfiguration: (err?: string) => void) => Promise<void> {
  log("debug", ">>>>>> Update Configuration", synchConfiguration);
  return async (updateConfiguration) => {
    log("debug", "synchronizing...");
    if (!isValidConfiguration(synchConfiguration)) {
      console.warn("Invalid Github configuration");
      setErrorMessage("Invalid Github configuration");
      updateConfiguration("Invalid Github configuration");
      return;
    }

    return await fetchRepositoryTokenLayers({
      credentials: {
        accessToken: synchConfiguration.accessToken,
        repoFullName: synchConfiguration?.repository,
      },
      branch: synchConfiguration.branch,
      tokenFilePath: synchConfiguration.filePath,
      createFile: synchConfiguration.createNewFile,
    })
      .then((details) => {
        log("debug", "synchronizing...DONE!");

        updateConfiguration(); // success!

        /// Update data from last commit of token file
        return setSynchDetails(details);
      })
      .catch((e: unknown) => {
        log("debug", "synchronizing...ERROR!");
        setErrorMessage("Error Synchronizing with Git repository");
        updateConfiguration("Error Synchronizing with Git repository");
        console.error(e);
      });
  };
}

function createRepositoryConfigurationDialogCallback(
  synchConfiguration: WidgetConfiguration | null,
  setSynchConfiguration: (newValue: WidgetConfiguration | null) => void,
): () => void {
  return () =>
    waitForTask(
      new Promise((resolve) => {
        figma.showUI(__html__, {
          title: "Configure Token Export",
          width: 575,
          height: 700,
        });
        emit<WidgetStateHandler>("PLUGIN_STATE_CHANGE", synchConfiguration);
        on<UiStateHandler>("UI_STATE_CHANGE", (msg) => {
          setSynchConfiguration(msg);
          resolve("close");
        });
        on<UiCloseHandler>("UI_CLOSE", () => {
          resolve("close");
        });
      }),
    );
}

function createIssueDialogCallback(
  { collections: parsedCollections }: { collections: unknown[] },
  format: TokenNameFormatType,
  issues: FormatValidationResult[],
): () => void {
  log("debug", "BEFORE TOKENS TOKENS");
  const collections = parsedCollections.every(isTokenCollection)
    ? toTokenNameCollection(parsedCollections, format)
    : [];
  return () =>
    waitForTask(
      new Promise((resolve) => {
        figma.showUI(__html__, {
          title: "Validation Issues",
          width: 575,
          height: 700,
        });
        emit<IssueVisualizerHandler>(
          "PLUGIN_VIEW_ISSUE",
          JSON.stringify({
            collections,
            format,
            issues,
          }),
        );
        on<UiCloseHandler>("UI_CLOSE", () => {
          resolve("close");
        });
      }),
    );
}

function createPushTokensDialogCallback(
  setConfirmPushDialogData: (newValue: PushMessageType) => void,
): (branch: string, message: string, version: string) => void {
  return (branchName, commitMessage, version) =>
    new Promise((resolve) => {
      figma.showUI(__html__, {
        title: "Confirm Push to Github",
        width: 575,
        height: 600,
      });
      emit<ConfirmPushHandler>("PLUGIN_CONFIRM_PUSH", {
        branchName,
        commitMessage,
      });
      on<UiCommitHandler>("UI_COMMIT_CHANGE", (msg) => {
        setConfirmPushDialogData({ ...msg, version });
        resolve("close");
      });
      on<UiCloseHandler>("UI_CLOSE", () => {
        resolve("close");
      });
    });
}

function formatLocalDateTime(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  // Get local timezone abbreviation
  const time = d.toLocaleTimeString("en-us", { timeZoneName: "short" });

  const formattedDateTime = `${year}-${month}-${day} ${time}`;
  return formattedDateTime;
}

function strNow() {
  const d = new Date();
  return formatLocalDateTime(d);
}
