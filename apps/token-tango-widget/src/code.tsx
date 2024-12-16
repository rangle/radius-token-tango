"use client";

import { EmptyPage } from "./ui/pages/empty-page";
import { LoadedPage } from "./ui/pages/loaded-page";
import { PageLayout } from "./ui/pages/layout";
import { version } from "../package.json";
import { formats } from "radius-toolkit";
import { getState } from "../types/state";
import { useTokenManagement } from "./hooks/use-token-management";
import { useVectorManagement } from "./hooks/use-vector-management";
import { useSyncManagement } from "./hooks/use-sync-management";
import { createRepositoryConfigurationDialogCallback, createIssueDialogCallback, createPushTokensDialogCallback } from "./dialogs/dialog-handlers";
import { createLogger } from "@repo/utils";
import { LoadedTokens } from "./types/widget-types";

const log = createLogger("WIDGET:code");

const { widget } = figma;
const { waitForTask } = widget;

export function Widget() {
  const [tokenState, tokenActions] = useTokenManagement();
  const [vectorState, vectorActions] = useVectorManagement();
  const [syncState, syncActions] = useSyncManagement();

  const format = tokenState.tokenNameFormat
    ? formats.find((f) => f.name === tokenState.tokenNameFormat) ?? formats[0]
    : formats[0];

  const doLoadTokensAndSynch = async () => {
    log("debug", ">>> LOADING YOUR TOKENS");
    waitForTask(
      Promise.all([
        tokenActions.loadTokens(format),
        syncActions.synchronize(),
      ]),
    );
  };

  return (
    <PageLayout
      synched={syncState.configuration !== null}
      error={syncState.errorMessage}
      appVersion={version}
      format={format}
      name={syncState.configuration ? syncState.configuration.name : ""}
      synchDetails={syncState.synchDetails}
      openConfig={createRepositoryConfigurationDialogCallback(
        syncState.configuration,
        syncActions.setConfiguration,
      )}
      synchronize={() => syncActions.synchronize()}
    >
      {tokenState.persistedTokens === null || syncState.synchDetails === null ? (
        <EmptyPage
          selectedFormat={tokenState.tokenNameFormat}
          selectFormat={(newFormat) => tokenActions.setTokenNameFormat(newFormat)}
          synchConfig={syncState.configuration}
          loadedIcons={vectorState.loadedVectors}
          loadIcons={() => {
            log("debug", "Loading your icons!");
            waitForTask(vectorActions.loadVectors());
          }}
          withVectors={vectorState.withVectors}
          toggleWithVectors={vectorActions.toggleVectors}
          clearIcons={vectorActions.clearVectors}
          loadTokens={async () => {
            log("debug", "Loading your tokens!");
            waitForTask(doLoadTokensAndSynch());
          }}
          openConfig={createRepositoryConfigurationDialogCallback(
            syncState.configuration,
            syncActions.setConfiguration,
          )}
        />
      ) : (
        <LoadedPage
          format={format}
          allTokens={JSON.parse(tokenState.persistedTokens) as LoadedTokens}
          issues={tokenState.allErrors}
          successfullyPushed={syncState.successfullyPushed}
          synchDetails={syncState.synchDetails}
          loadedIcons={vectorState.loadedVectors}
          loadIcons={vectorActions.loadVectors}
          clearIcons={vectorActions.clearVectors}
          openIssues={createIssueDialogCallback(
            getState(
              tokenState.persistedTokens,
              vectorState.persistedVectors,
              syncState.synchDetails,
              format,
              tokenState.allErrors,
            ),
          )}
          reloadTokens={async () => {
            log("debug", ">>> RELOADING ALL VARIABLES");
            waitForTask(doLoadTokensAndSynch());
          }}
          pushTokens={createPushTokensDialogCallback(
            syncState.configuration,
            (pushMessage) => {
              log("debug", "PUSHING TO THE REPOSITORY", pushMessage);

              const { tokenLayers, vectors, packagejson, meta } = getState(
                tokenState.persistedTokens,
                vectorState.persistedVectors,
                syncState.synchDetails,
                format,
                tokenState.allErrors,
              );

              // merge them with the existing data from Github
              const newSyncDetails = [
                { ...tokenLayers, vectors },
                packagejson,
                meta,
              ] as const;
              
              log("debug", newSyncDetails);
              waitForTask(
                syncActions.saveTokens(newSyncDetails, pushMessage, () => {
                  log("debug", "FINISHED!!");
                }),
              );
              log("debug", "FINISHED PUSHING TO THE REPOSITORY");
            },
          )}
        />
      )}
    </PageLayout>
  );
}

widget.register(Widget);
