import React, { Fragment, FC } from "react";
import { render } from "react-dom";

import { useEffect, useState } from "react";
import { emit, on } from "@create-figma-plugin/utilities";

import {
  ConfirmPushHandler,
  UiCommitHandler,
  UiStateHandler,
  WidgetStateHandler,
} from "../../../apps/token-tango-widget/types/state";

import { PushConfirmation } from "./components/push";
import { RepositoryConfig } from "./components/repository";
import { PushMessageType, WidgetConfiguration } from "@repo/config";

import "./index.css";
import { ValidationResult } from "./components/validation";

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

  // establish the initial handers for routing and updates
  useEffect(() => {
    on<WidgetStateHandler>("PLUGIN_STATE_CHANGE", (state) => {
      console.log("WEB: PLUGIN_STATE_CHANGE", state);
      setConfig(state ?? initialState);
      setRoute("repository");
    });

    on<ConfirmPushHandler>("PLUGIN_CONFIRM_PUSH", (state) => {
      console.log("WEB: PLUGIN_CONFIRM_PUSH", state);
      setCommit(state ?? initialCommitState);
      setRoute("push");
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
    console.log("SENDING UI_STATE_CHANGE");
    emit<UiStateHandler>("UI_STATE_CHANGE", newState);
  };

  const updateCommitState = (newState: PushMessageType) => {
    console.log("SENDING UI_STATE_CHANGE");
    emit<UiCommitHandler>("UI_COMMIT_CHANGE", newState);
  };

  console.log("ROUTE", route);

  return (
    <Fragment>
      {route === "config" ? (
        <RepositoryConfig state={config} updateState={updateState} />
      ) : route === "push" ? (
        <PushConfirmation state={commit} updateState={updateCommitState} />
      ) : route === "repository" ? (
        <RepositoryConfig state={config} updateState={updateState} />
      ) : route === "validation" ? (
        <ValidationResult />
      ) : (
        <div>Loading</div>
      )}
    </Fragment>
  );
};

render(<App />, document.getElementById("root")!);
