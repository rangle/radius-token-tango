import React, { Fragment, FC } from "react";
import { createRoot } from "react-dom/client";

import { useEffect, useState } from "react";
import { emit, on } from "@create-figma-plugin/utilities";

import {
  ConfirmPushHandler,
  IssueVisualizerHandler,
  State,
  UiCommitHandler,
  UiStateHandler,
  WidgetStateHandler,
  isState,
  whyIsState,
} from "../../../apps/token-tango-widget/types/state";

import { PushConfirmation } from "./components/push";
import { RepositoryConfig } from "./components/repository";
import { PushMessageType, WidgetConfiguration } from "@repo/config";

import "./index.css";
import { ValidationResult } from "./components/validation";

import { createLogger } from "@repo/utils";
import SpinningLogo from "./components/loading-icon";

const log = createLogger("WEB:index");

const initialState: WidgetConfiguration = {
  tool: "GitHub",
  name: "",
  repository: "",
  accessToken: "",
  branch: "",
  filePath: "",
  createNewFile: false,
};

const initialCommitState: PushMessageType = {
  branchName: "",
  commitMessage: "",
};

export const parseSerializedState = (serializedStateAndCollections: string) => {
  const { state: parsedState } = JSON.parse(serializedStateAndCollections);

  const state = isState(parsedState) ? parsedState : null;
  log("warn", "why", state ?? whyIsState(parsedState));
  return { state };
};

export type AppRoute =
  | "loading"
  | "config"
  | "push"
  | "repository"
  | "validation";

// Type for valid debug routes
type DebugRouteParams = {
  route?: AppRoute;
  config?: string; // Base64 encoded config
};

// Parse URL parameters for debug mode
const parseDebugParams = (): DebugRouteParams => {
  if (typeof window === "undefined") return {};

  const params = new URLSearchParams(window.location.search);
  const route = params.get("route") as AppRoute | null;
  const config = params.get("config");

  return {
    ...(route && { route }),
    ...(config && { config: decodeURIComponent(config) }),
  };
};

// Check if we're running in debug mode (browser)
const isDebugMode = (): boolean => {
  return window.name === "";
};

export const App: FC = () => {
  const [route, setRoute] = useState<AppRoute>(() => {
    const { route: debugRoute } = parseDebugParams();
    return debugRoute || "loading";
  });

  const [config, setConfig] = useState<WidgetConfiguration>(() => {
    const { config: debugConfig } = parseDebugParams();
    return debugConfig ? JSON.parse(atob(debugConfig)) : initialState;
  });
  const [commit, setCommit] = useState<PushMessageType>(initialCommitState);
  const [state, setState] = useState<State | null>(null);

  // establish the initial handers for routing and updates
  useEffect(() => {
    if (isDebugMode()) return;
    on<WidgetStateHandler>("PLUGIN_STATE_CHANGE", (state) => {
      log("warn", "PLUGIN_STATE_CHANGE", state);
      setConfig(state ?? initialState);
      setRoute("repository");
    });

    on<ConfirmPushHandler>("PLUGIN_CONFIRM_PUSH", (state) => {
      log("warn", "PLUGIN_CONFIRM_PUSH", state);
      const { branchName, commitMessage, ...configState } = state ?? {
        ...initialCommitState,
        ...initialState,
      };

      setCommit({ branchName, commitMessage });
      setConfig(configState);
      setRoute("push");
    });

    on<IssueVisualizerHandler>("PLUGIN_VIEW_ISSUE", (serializedState) => {
      log("warn", "PLUGIN_VIEW_ISSUE");
      const { state: parsedState } = JSON.parse(serializedState);
      log("warn", "PLUGIN_VIEW_ISSUE", parsedState);

      const state = isState(parsedState) ? parsedState : null;
      log("warn", "PLUGIN_VIEW_ISSUE", state);
      setRoute("validation");
      setState(state);
    });
  }, []);

  const updateState = (newState: WidgetConfiguration) => {
    log("warn", "SENDING UI_STATE_CHANGE");
    emit<UiStateHandler>("UI_STATE_CHANGE", newState);
  };

  const updateCommitState = (newState: PushMessageType) => {
    log("warn", "SENDING UI_STATE_CHANGE");
    emit<UiCommitHandler>("UI_COMMIT_CHANGE", newState);
  };

  log("warn", "ROUTE", route);
  log("debug", { state });

  return (
    <Fragment>
      {route === "config" ? (
        <RepositoryConfig state={config} updateState={updateState} />
      ) : route === "push" ? (
        <PushConfirmation
          state={{ ...config, ...commit }}
          updateState={updateCommitState}
        />
      ) : route === "repository" ? (
        <RepositoryConfig state={config} updateState={updateState} />
      ) : route === "validation" && state !== null ? (
        <ValidationResult state={state} />
      ) : (
        <SpinningLogo />
      )}
    </Fragment>
  );
};

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
} else {
  console.error("Root element not found");
}
