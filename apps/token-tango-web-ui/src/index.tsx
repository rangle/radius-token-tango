import React, { Fragment, FC } from "react";
import { render } from "react-dom";

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
import { radiusLayerSubjectTypeFormat } from "radius-toolkit";

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

const defaultFormat = radiusLayerSubjectTypeFormat;

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

export const App: FC = () => {
  const [route, setRoute] = useState<AppRoute>("loading");
  const [config, setConfig] = useState<WidgetConfiguration>(initialState);
  const [commit, setCommit] = useState<PushMessageType>(initialCommitState);
  const [state, setState] = useState<State | null>(null);

  // establish the initial handers for routing and updates
  useEffect(() => {
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

    // const hash = window.location.hash.substring(1);
    // if (hash === "config") {
    //   setRoute("config");
    // } else if (hash === "push") {
    //   setRoute("push");
    // } else if (hash === "repository") {
    //   setRoute("repository");
    // } else if (hash === "validation") {
    //   const state = isState(mockState) ? mockState : null;
    //   log("warn", "MOCK", state);
    //   setRoute("validation");
    //   setState(state);
    // }
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

render(<App />, document.getElementById("root")!);
