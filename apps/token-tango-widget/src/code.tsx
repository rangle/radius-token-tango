import { EmptyPage } from "./ui/pages/empty-page.js";
import { emit, on } from "@create-figma-plugin/utilities";
import {
  CommitMessageConfirmation,
  ConfirmPushHandler,
  UiCloseHandler,
  UiCommitHandler,
  UiStateHandler,
  WidgetConfiguration,
  WidgetStateHandler,
} from "../types/state.js";
import {
  RepositoryTokenLayers,
  fetchRepositoryTokenLayers,
  saveRepositoryTokenLayers,
} from "./services/load-github.services.js";
import { getTokenLayers } from "./services/load-tokens.services.js";
import { TokenLayers } from "./common/token-parser.types.js";
import { TokenCollection } from "./common/variables.utils.js";
import { TokenValidationResult } from "./common/token.utils.js";
import { LoadedPage } from "./ui/pages/loaded-page.js";
import { PageLayout } from "./ui/pages/layout.js";

import { version } from "../package.json";

const { widget } = figma;
const { AutoLayout, useSyncedState, Text, waitForTask } = widget;

export type LoadedTokens = {
  inspectedAt: string;
  collections: TokenCollection[];
  tokenLayers?: TokenLayers;
  errors: TokenValidationResult[];
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
  const [lastSynched, setLastSynched] = useSyncedState<string | null>(
    "lastSynched",
    null,
  );
  const [synchDetails, setSynchDetails] =
    useSyncedState<RepositoryTokenLayers | null>("synchDetails", null);
  const [allTokens, setAllTokens] = useSyncedState<LoadedTokens | null>(
    "allGlobalTokens",
    null,
  );

  const doSynchronize = synchRepository(
    synchConfiguration,
    setErrorMessage,
    setLastSynched,
    setSynchDetails,
  );

  const doSaveTokens = saveTokensToRepository(
    synchConfiguration,
    setErrorMessage,
  );

  const updateStatus = (error?: string) =>
    synchConfiguration
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

  return (
    <PageLayout
      synched={synchConfiguration !== null}
      error={errorMessage}
      appVersion={version}
      name={synchConfiguration ? synchConfiguration.name : ""}
      synchDetails={synchDetails}
      openConfig={openConfiguration(synchConfiguration, setSynchConfiguration)}
      synchronize={() => doSynchronize(updateStatus)}
    >
      {allTokens === null || synchDetails === null ? (
        <EmptyPage
          synchConfig={synchConfiguration}
          loadTokens={async () => {
            console.log("Loading your tokens!");
            waitForTask(
              Promise.all([
                doSynchronize(updateStatus),
                loadVariables(setAllTokens),
              ]),
            );
          }}
          openConfig={openConfiguration(
            synchConfiguration,
            setSynchConfiguration,
          )}
        />
      ) : (
        <LoadedPage
          allTokens={allTokens}
          synchDetails={synchDetails}
          reloadTokens={async () => {
            console.log(">>> RELOADING ALL VARIABLES");
            waitForTask(
              Promise.all([
                doSynchronize(updateStatus),
                loadVariables(setAllTokens),
              ]),
            );
          }}
          pushTokens={pushTokens((edits) => {
            console.log("PUSHING TO THE REPOSITORY", edits);
            console.log(synchDetails);
            waitForTask(
              doSaveTokens(synchDetails ?? null, edits, () => {
                console.log("FINISHED!!");
              }),
            );
            console.log("FINISHED PUSHING TO THE REPOSITORY");
          })}
        />
      )}
    </PageLayout>
  );
}

widget.register(Widget);

async function loadVariables(
  setAllTokens: (newValue: LoadedTokens | null) => void,
) {
  console.log(">>> LOADING VARIABLES");
  const [collections, tokenLayers, errors] = await getTokenLayers(true);
  console.log(tokenLayers);
  console.log(errors);
  setAllTokens({
    collections,
    tokenLayers,
    errors,
    inspectedAt: strNow(),
  });
}

function saveTokensToRepository(
  synchConfiguration: WidgetConfiguration | null,
  setErrorMessage: (newValue: string | null) => void,
) {
  return async (
    synchDetails: RepositoryTokenLayers | null,
    { branchName, commitMessage, version }: CommitMessageConfirmation,
    done: () => void,
  ) => {
    console.log("saving tokens...");
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
        tokenFilePath: synchConfiguration.path,
      },
      synchDetails,
      commitMessage,
      branchName,
      version,
    )
      .then(done)
      .catch((e) => {
        console.log("WHAT??", e);
        throw new Error(e);
      });
  };
}

function synchRepository(
  synchConfiguration: WidgetConfiguration | null,
  setErrorMessage: (newValue: string | null) => void,
  setLastSynched: (newValue: string | null) => void,
  setSynchDetails: (newValue: RepositoryTokenLayers | null) => void,
): (updateConfiguration: (err?: string) => void) => Promise<void> {
  return async (updateConfiguration) => {
    console.log("synchronizing...");
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
      tokenFilePath: synchConfiguration.path,
    })
      .then((details) => {
        console.log("synchronizing...DONE!");
        setLastSynched(new Date().toISOString());

        updateConfiguration(); // success!

        /// Update data from last commit of token file
        return setSynchDetails(details);
      })
      .catch((e: unknown) => {
        console.log("synchronizing...ERROR!");
        setErrorMessage("Error Synchronizing with Git repository");
        updateConfiguration("Error Synchronizing with Git repository");
        console.error(e);
      });
  };
}

function openConfiguration(
  synchConfiguration: WidgetConfiguration | null,
  setSynchConfiguration: (newValue: WidgetConfiguration | null) => void,
): () => void {
  return () =>
    waitForTask(
      new Promise((resolve) => {
        figma.showUI(__html__, {
          title: "Configure Token Export",
          width: 320,
          height: 400,
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

function pushTokens(
  setConfirmPushDialogData: (newValue: CommitMessageConfirmation) => void,
): (branch: string, message: string, version: string) => void {
  return (branchName, commitMessage, version) =>
    new Promise((resolve) => {
      figma.showUI(__html__, {
        title: "Confirm Push to Github",
        width: 320,
        height: 300,
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
