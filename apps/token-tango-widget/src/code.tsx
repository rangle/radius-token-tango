"use client";

import { EmptyPage } from "./ui/pages/empty-page";
import { LoadedPage } from "./ui/pages/loaded-page";
import { PageLayout } from "./ui/pages/layout";
import { version } from "../package.json";
import { getState } from "../types/state";
import {
  createRepositoryConfigurationDialogCallback,
  createIssueDialogCallback,
  createPushTokensDialogCallback,
} from "./dialogs/dialog-handlers";
import { createLogger } from "@repo/utils";
import { useAppState } from "./hooks/use-app-state";
import { isLoadedAppState } from "./types/app-state";

const log = createLogger("WIDGET:code");

const { widget } = figma;

/**
 * Main widget component that handles the routing logic and state management
 */
export function Widget() {
  console.log("rendering Widget");

  try {
    const [state, actions] = useAppState();

    console.log("Widget currentRoute", state.route);

    const openConfig = createRepositoryConfigurationDialogCallback(
      state.configuration,
      actions.setConfiguration,
    );

    const result = (
      <PageLayout
        state={state}
        actions={actions}
        appVersion={version}
        openConfig={openConfig}
      >
        {state.route === "empty" ? (
          <EmptyPage state={state} actions={actions} openConfig={openConfig} />
        ) : isLoadedAppState(state) ? (
          <LoadedPage
            state={state}
            actions={actions}
            openIssues={createIssueDialogCallback(
              getState(
                state.persistedTokens,
                state.persistedVectors,
                state.synchDetails,
                state.tokenFormatType,
                state.allErrors,
              ),
            )}
            pushTokens={createPushTokensDialogCallback(
              state.configuration,
              (pushMessage) => {
                log("debug", "PUSHING TO THE REPOSITORY", pushMessage);

                const { tokenLayers, vectors, packagejson, meta } = getState(
                  state.persistedTokens,
                  state.persistedVectors,
                  state.synchDetails,
                  state.tokenFormatType,
                  state.allErrors,
                );

                // merge them with the existing data from Github
                const newSyncDetails = [
                  { ...tokenLayers, vectors },
                  packagejson,
                  meta,
                ] as const;

                log("debug", newSyncDetails);
                actions.saveTokens(newSyncDetails, pushMessage, () => {
                  log("debug", "FINISHED!!");
                });
                log("debug", "FINISHED PUSHING TO THE REPOSITORY");
              },
            )}
          />
        ) : null}
      </PageLayout>
    );
    console.log("Widget FINAL", result);
    return result;
  } catch (e) {
    console.error("Error rendering widget:", e);
    // Return a minimal fallback UI
    return widget.h("text", { fill: "#FF0000" }, "Widget Error");
  }
}

// Wrap registration in try-catch
try {
  widget.register(Widget);
} catch (e) {
  console.error("Error registering widget:", e);
}
