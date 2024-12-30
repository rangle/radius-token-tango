import {
  FormatName,
  FormatValidationResult,
  TokenNameFormatType,
} from "radius-toolkit";
import { WidgetConfiguration } from "@repo/config";
import { RepositoryTokenLayers } from "./state";
import { SuccessfullyPushedDetails } from "../ui/components/success-panel";
import { LoadedTokens } from "./widget-types";

/**
 * Base state that is common to all routes
 */
type BaseAppState = {
  // Vector state
  persistedVectors: string | null;
  loadedVectors: number | null;
  withVectors: boolean;

  // Token state
  tokenNameFormat: FormatName | null;
  allErrors: FormatValidationResult[];

  // Sync state
  configuration: WidgetConfiguration | null;
  errorMessage: string | null;
  synchDetails: RepositoryTokenLayers | null;
  successfullyPushed: SuccessfullyPushedDetails | null;

  // Format
  tokenFormatType: TokenNameFormatType;
};

/**
 * State when the app is in empty state (no tokens loaded)
 */
export type EmptyAppState = BaseAppState & {
  route: "empty";
  persistedTokens: null;
};

/**
 * State when the app has loaded tokens
 */
export type LoadedAppState = BaseAppState & {
  route: "loaded";
  persistedTokens: string;
  parsedTokens: LoadedTokens;
};

/**
 * The complete app state as a discriminated union
 */
export type AppState = EmptyAppState | LoadedAppState;

/**
 * Type guard to check if the app state is loaded
 */
export const isLoadedAppState = (state: AppState): state is LoadedAppState => {
  return state.route === "loaded";
};

/**
 * Type guard to check if the app state is empty
 */
export const isEmptyAppState = (state: AppState): state is EmptyAppState => {
  return state.route === "empty";
};
