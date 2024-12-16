import { createLogger } from "@repo/utils";
import { WidgetConfiguration, PushMessageType } from "@repo/config";
import { RepositoryTokenLayers } from "../../types/state";
import { SuccessfullyPushedDetails } from "../ui/components/success-panel";
import { fetchRepositoryTokenLayers, saveRepositoryTokenLayers } from "../services/load-github.services";
import { isValidConfiguration } from "../types/widget-types";
import { useSyncedState } from "../types/figma-types";

const log = createLogger("WIDGET:sync");

type SyncState = {
  configuration: WidgetConfiguration | null;
  errorMessage: string | null;
  synchDetails: RepositoryTokenLayers | null;
  successfullyPushed: SuccessfullyPushedDetails | null;
};

type SyncActions = {
  synchronize: () => Promise<void>;
  saveTokens: (
    synchDetails: RepositoryTokenLayers,
    pushMessage: PushMessageType,
    onSuccess: () => void
  ) => Promise<void>;
  setConfiguration: (config: WidgetConfiguration | null) => void;
  updateStatus: (error?: string) => void;
};

export const useSyncManagement = (): [SyncState, SyncActions] => {
  const [configuration, setConfiguration] = useSyncedState<WidgetConfiguration | null>(
    "synchedState",
    null,
  );
  const [errorMessage, setErrorMessage] = useSyncedState<string | null>(
    "errorState",
    null,
  );
  const [synchDetails, setSynchDetails] = useSyncedState<RepositoryTokenLayers | null>(
    "synchDetails",
    null,
  );
  const [successfullyPushed, setSuccessfullyPushed] = useSyncedState<SuccessfullyPushedDetails | null>(
    "successfullyPushedTokenDetails",
    null,
  );

  const updateStatus = (error?: string) => {
    log("debug", ">>> UPDATING STATUS");
    setSuccessfullyPushed(null);

    if (!configuration) return;

    error
      ? setConfiguration({
          ...configuration,
          error,
          status: "error",
        })
      : setConfiguration({
          ...configuration,
          error: undefined,
          status: "online",
        });
  };

  const synchronize = async () => {
    log("debug", "synchronizing...");
    if (!isValidConfiguration(configuration)) {
      console.warn("Invalid Github configuration");
      setErrorMessage("Invalid Github configuration");
      updateStatus("Invalid Github configuration");
      return;
    }

    try {
      const details = await fetchRepositoryTokenLayers({
        credentials: {
          accessToken: configuration.accessToken,
          repoFullName: configuration.repository,
        },
        branch: configuration.branch,
        tokenFilePath: configuration.filePath,
        createFile: configuration.createNewFile,
      });

      log("debug", "synchronizing...DONE!");
      updateStatus(); // success!
      setSynchDetails(details);
    } catch (e: unknown) {
      log("debug", "synchronizing...ERROR!");
      setErrorMessage("Error Synchronizing with Git repository");
      updateStatus("Error Synchronizing with Git repository");
      console.error(e);
    }
  };

  const saveTokens = async (
    synchDetails: RepositoryTokenLayers,
    { branchName, commitMessage, version }: PushMessageType,
    onSuccess: () => void,
  ) => {
    log("debug", "saving tokens...");
    if (!isValidConfiguration(configuration)) {
      console.warn("Invalid Github configuration");
      setErrorMessage("Invalid Github configuration");
      return;
    }

    try {
      const result = await saveRepositoryTokenLayers(
        {
          credentials: {
            accessToken: configuration.accessToken,
            repoFullName: configuration.repository,
          },
          branch: configuration.branch,
          tokenFilePath: configuration.filePath,
          createFile: configuration.createNewFile,
        },
        synchDetails,
        commitMessage,
        branchName,
        version,
      );
      
      setSuccessfullyPushed({
        branch: branchName,
        ref: configuration.branch,
        repository: configuration.repository,
        version: version || synchDetails[1]?.version || '0.0.0'
      });
      
      onSuccess();
    } catch (e) {
      log("debug", "WHAT??", e);
      setErrorMessage(String(e));
      throw new Error(String(e));
    }
  };

  return [
    { configuration, errorMessage, synchDetails, successfullyPushed },
    { synchronize, saveTokens, setConfiguration, updateStatus }
  ];
}; 