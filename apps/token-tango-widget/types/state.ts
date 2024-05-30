import { EventHandler } from "@create-figma-plugin/utilities";

export type WidgetConfiguration = {
  name: string;
  repository: string;
  accessToken: string;
  branch: string;
  path: string;
  status?: "disconnected" | "error" | "online";
  error?: string;
};

export type CommitMessageConfirmation = {
  branchName: string;
  commitMessage: string;
  version?: string;
};

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
  handler: (state: CommitMessageConfirmation | null) => void;
}

export interface UiCommitHandler extends EventHandler {
  name: "UI_COMMIT_CHANGE";
  handler: (state: CommitMessageConfirmation) => void;
}

export interface UiCloseHandler extends EventHandler {
  name: "UI_CLOSE";
  handler: () => void;
}
