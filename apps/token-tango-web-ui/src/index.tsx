import { h, Fragment, FunctionalComponent, render } from "preact";

import { useEffect, useState } from "preact/hooks";
import { emit, on } from "@create-figma-plugin/utilities";

import "@create-figma-plugin/ui/css/base.css";
import {
  CommitMessageConfirmation,
  ConfirmPushHandler,
  UiCommitHandler,
  UiStateHandler,
  WidgetConfiguration,
  WidgetStateHandler,
} from "../../../apps/token-tango-widget/types/state";

import { PushConfirmation } from "./components/push";
import { ConfigForm } from "./components/config";

const initialState: WidgetConfiguration = {
  name: "",
  repository: "",
  accessToken: "",
  branch: "",
  path: "",
};

const initialCommitState: CommitMessageConfirmation = {
  branchName: "",
  commitMessage: "",
};

export type AppRoute = "loading" | "config" | "push";

export const App: FunctionalComponent = () => {
  const [route, setRoute] = useState<AppRoute>("loading");
  const [config, setConfig] = useState<WidgetConfiguration>(initialState);
  const [commit, setCommit] =
    useState<CommitMessageConfirmation>(initialCommitState);

  // establish the initial handers for routing and updates
  useEffect(() => {
    on<WidgetStateHandler>("PLUGIN_STATE_CHANGE", (state) => {
      console.log("WEB: PLUGIN_STATE_CHANGE", state);
      setConfig(state ?? initialState);
      setRoute("config");
    });

    on<ConfirmPushHandler>("PLUGIN_CONFIRM_PUSH", (state) => {
      console.log("WEB: PLUGIN_CONFIRM_PUSH", state);
      setCommit(state ?? initialCommitState);
      setRoute("push");
    });
  }, []);

  const updateState = (newState: WidgetConfiguration) => {
    console.log("SENDING UI_STATE_CHANGE");
    emit<UiStateHandler>("UI_STATE_CHANGE", newState);
  };

  const updateCommitState = (newState: CommitMessageConfirmation) => {
    console.log("SENDING UI_STATE_CHANGE");
    emit<UiCommitHandler>("UI_COMMIT_CHANGE", newState);
  };

  return (
    <Fragment>
      {route === "config" ? (
        <ConfigForm state={config} updateState={updateState} />
      ) : route === "push" ? (
        <PushConfirmation state={commit} updateState={updateCommitState} />
      ) : (
        <div>Loading</div>
      )}
    </Fragment>
  );
};

render(<App />, document.getElementById("root")!);
