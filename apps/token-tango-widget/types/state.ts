import { EventHandler } from "@create-figma-plugin/utilities";
import { PushMessageType, WidgetConfiguration } from "@repo/config";
import {
  FormatValidationResult,
  TokenNameCollection,
  TokenNameFormatType,
} from "radius-toolkit";

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
  handler: (state: PushMessageType | null) => void;
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
