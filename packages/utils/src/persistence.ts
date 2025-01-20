/**
 * Defines the different approaches for persisting tokens
 */
export type PersistenceType = "repository" | "rest-server" | "file-download";

/**
 * Status for Remote Repository persistence
 */
export type RepositoryStatus = {
  type: "repository";
  state: "connected" | "disconnected" | "error";
  error?: string;
};

/**
 * Status for REST Server persistence
 */
export type RestServerStatus = {
  type: "rest-server";
  state: "connected" | "unreachable" | "error";
  error?: string;
};

/**
 * Status for File Download persistence
 */
export type FileDownloadStatus = {
  type: "file-download";
  state: "ready" | "processing" | "complete";
  error?: string;
};

/**
 * Union type for all persistence statuses
 */
export type PersistenceStatus =
  | RepositoryStatus
  | RestServerStatus
  | FileDownloadStatus;

/**
 * Maps persistence type to display text
 */
export const persistenceTypeLabels: Record<PersistenceType, string> = {
  repository: "Remote Repository",
  "rest-server": "REST Server",
  "file-download": "File Download",
};

/**
 * Maps status states to display colors
 */
export const statusStateColors: Record<PersistenceStatus["state"], string> = {
  connected: "#00B012",
  disconnected: "#7A7A7A",
  error: "#b00000",
  unreachable: "#7A7A7A",
  ready: "#00B012",
  processing: "#FFA500",
  complete: "#00B012",
};

/**
 * Maps status states to icons from the available icon set
 */
export const statusStateIcons: Record<
  PersistenceStatus["state"],
  "check" | "refresh" | "alert"
> = {
  connected: "check",
  disconnected: "refresh",
  error: "alert",
  unreachable: "refresh",
  ready: "check",
  processing: "refresh",
  complete: "check",
};
