import { useTokenManagement } from "./use-token-management";
import { useVectorManagement } from "./use-vector-management";
import { useSyncManagement } from "./use-sync-management";
import { useRouting } from "./use-routing";
import { getFormat, toTokenNameFormatType } from "radius-toolkit";
import { AppState, EmptyAppState, LoadedAppState } from "../types/app-state";
import { createLogger } from "@repo/utils";
import { waitForTask } from "../types/figma-types";
import { LoadedTokens } from "../types/widget-types";

const log = createLogger("WIDGET:app-state");

/**
 * Actions that can be performed on the app state
 */
export type AppStateActions = {
  loadTokens: () => Promise<void>;
  loadIcons: () => Promise<void>;
  clearIcons: () => void;
  toggleVectors: () => void;
  setTokenNameFormat: (format: string) => void;
  synchronize: () => Promise<void>;
  saveTokens: (
    synchDetails: Parameters<
      ReturnType<typeof useSyncManagement>[1]["saveTokens"]
    >[0],
    pushMessage: Parameters<
      ReturnType<typeof useSyncManagement>[1]["saveTokens"]
    >[1],
    onSuccess: Parameters<
      ReturnType<typeof useSyncManagement>[1]["saveTokens"]
    >[2],
  ) => Promise<void>;
  setConfiguration: (
    config: Parameters<
      ReturnType<typeof useSyncManagement>[1]["setConfiguration"]
    >[0],
  ) => void;
};

/**
 * Hook that combines all the state management hooks into one
 */
export const useAppState = (): [AppState, AppStateActions] => {
  const { currentRoute } = useRouting();
  const [tokenState, tokenActions] = useTokenManagement();
  const [vectorState, vectorActions] = useVectorManagement();
  const [syncState, syncActions] = useSyncManagement();

  const format = getFormat(tokenState.tokenNameFormat ?? "radius-simple");
  if (!format) {
    throw new Error("Invalid token name format");
  }
  const tokenFormatType = toTokenNameFormatType(format);

  // Combine all the state into one object
  const baseState = {
    // Vector state
    persistedVectors: vectorState.persistedVectors,
    loadedVectors: vectorState.loadedVectors,
    withVectors: vectorState.withVectors,

    // Token state
    tokenNameFormat: tokenState.tokenNameFormat,
    allErrors: tokenState.allErrors,

    // Sync state
    configuration: syncState.configuration,
    errorMessage: syncState.errorMessage,
    synchDetails: syncState.synchDetails,
    successfullyPushed: syncState.successfullyPushed,

    // Format
    tokenFormatType,
  };

  // Create the state based on the current route
  const state: AppState =
    currentRoute === "empty" || !tokenState.persistedTokens
      ? ({
          ...baseState,
          route: "empty",
          persistedTokens: null,
        } as EmptyAppState)
      : ({
          ...baseState,
          route: "loaded",
          persistedTokens: tokenState.persistedTokens,
          parsedTokens: JSON.parse(tokenState.persistedTokens) as LoadedTokens,
        } as LoadedAppState);

  // Combine all actions into one object
  const actions: AppStateActions = {
    loadTokens: async () => {
      log("debug", ">>> LOADING YOUR TOKENS");
      waitForTask(
        Promise.all([
          tokenActions.loadTokens(tokenFormatType),
          syncActions.synchronize(),
        ]),
      );
    },
    loadIcons: async () => {
      log("debug", "Loading your icons!");
      waitForTask(vectorActions.loadVectors());
    },
    clearIcons: vectorActions.clearVectors,
    toggleVectors: vectorActions.toggleVectors,
    setTokenNameFormat: tokenActions.setTokenNameFormat,
    synchronize: syncActions.synchronize,
    saveTokens: syncActions.saveTokens,
    setConfiguration: syncActions.setConfiguration,
  };

  return [state, actions];
};
