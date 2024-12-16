import { emit, on } from "@create-figma-plugin/utilities";
import { createLogger } from "@repo/utils";
import { WidgetConfiguration } from "@repo/config";

import { PushMessageType } from "@repo/config";
import { waitForTask } from "../types/figma-types";
import {
  ConfirmPushHandler,
  IssueVisualizerHandler,
  State,
  UiCloseHandler,
  UiCommitHandler,
  UiStateHandler,
  WidgetStateHandler,
} from "../../types/state";

const log = createLogger("WIDGET:dialogs");

/**
 * Creates a callback for handling repository configuration dialog
 */
export function createRepositoryConfigurationDialogCallback(
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

/**
 * Creates a callback for handling issue visualization dialog
 */
export function createIssueDialogCallback(state: State): () => void {
  log("debug", "createIssueDialogCallback");
  log("debug", { state });
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
            state,
          }),
        );
        on<UiCloseHandler>("UI_CLOSE", () => {
          resolve("close");
        });
      }),
    );
}

/**
 * Creates a callback for handling token push confirmation dialog
 */
export function createPushTokensDialogCallback(
  synchConfiguration: WidgetConfiguration | null,
  setConfirmPushDialogData: (newValue: PushMessageType) => void,
): (branch: string, message: string, version: string) => void {
  return (branchName, commitMessage, version) =>
    new Promise((resolve) => {
      figma.showUI(__html__, {
        title: "Confirm Push to Github",
        width: 575,
        height: 630,
      });
      if (!synchConfiguration || synchConfiguration.error) {
        log("error", "Invalid Github configuration", synchConfiguration?.error);
        throw new Error("Invalid Github configuration");
      }
      emit<ConfirmPushHandler>("PLUGIN_CONFIRM_PUSH", {
        ...synchConfiguration,
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
