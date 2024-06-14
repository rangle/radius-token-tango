import React, { Fragment, FC } from "react";
import { render } from "react-dom";

import { useEffect, useState } from "react";
import { emit, on } from "@create-figma-plugin/utilities";

import {
  ConfirmPushHandler,
  IssueVisualizerHandler,
  UiCommitHandler,
  UiStateHandler,
  WidgetStateHandler,
} from "../../../apps/token-tango-widget/types/state";

import { PushConfirmation } from "./components/push";
import { RepositoryConfig } from "./components/repository";
import { PushMessageType, WidgetConfiguration } from "@repo/config";

import "./index.css";
import { ValidationResult } from "./components/validation";
import {
  FormatValidationResult,
  TokenNameCollection,
  TokenNameFormatType,
  isFormatValidationResult,
  isGlobalValidationResult,
  isTokenNameCollection,
  isTokenNameFormatType,
  isTokenValidationResult,
} from "radius-toolkit";
import { createLogger } from "@repo/utils";

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
  const [issues, setIssues] = useState<FormatValidationResult[]>([]);
  const [format, setFormat] = useState<TokenNameFormatType | null>(null);
  const [collections, setCollections] = useState<TokenNameCollection[]>([]);

  // establish the initial handers for routing and updates
  useEffect(() => {
    on<WidgetStateHandler>("PLUGIN_STATE_CHANGE", (state) => {
      log("debug", "PLUGIN_STATE_CHANGE", state);
      setConfig(state ?? initialState);
      setRoute("repository");
    });

    on<ConfirmPushHandler>("PLUGIN_CONFIRM_PUSH", (state) => {
      log("debug", "PLUGIN_CONFIRM_PUSH", state);
      setCommit(state ?? initialCommitState);
      setRoute("push");
    });

    on<IssueVisualizerHandler>("PLUGIN_VIEW_ISSUE", (serializedState) => {
      const state = JSON.parse(serializedState);
      const issues =
        Array.isArray(state.issues) &&
        state.issues.every(isFormatValidationResult)
          ? state.issues
          : [];
      const format = isTokenNameFormatType(state.format) && state.format;
      const collections =
        Array.isArray(state.collections) &&
        state.collections.every(isTokenNameCollection)
          ? state.collections
          : [];

      log("debug", "PLUGIN_VIEW_ISSUE", issues, format, collections);
      setRoute("validation");
      setIssues(issues);
      setFormat(format);
      setCollections(collections);
    });

    const hash = window.location.hash.substring(1);
    if (hash === "config") {
      setRoute("config");
    } else if (hash === "push") {
      setRoute("push");
    } else if (hash === "repository") {
      setRoute("repository");
    } else if (hash === "validation") {
      setRoute("validation");
    }
  }, []);

  const updateState = (newState: WidgetConfiguration) => {
    log("debug", "SENDING UI_STATE_CHANGE");
    emit<UiStateHandler>("UI_STATE_CHANGE", newState);
  };

  const updateCommitState = (newState: PushMessageType) => {
    log("debug", "SENDING UI_STATE_CHANGE");
    emit<UiCommitHandler>("UI_COMMIT_CHANGE", newState);
  };

  log("debug", "ROUTE", route);

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
      ) : route === "validation" ? (
        <ValidationResult {...{ collections, format, issues }} />
      ) : (
        <div>Loading</div>
      )}
    </Fragment>
  );
};

render(<App />, document.getElementById("root")!);
