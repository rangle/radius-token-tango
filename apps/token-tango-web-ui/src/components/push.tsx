import React, { FC } from "react";
import { useRef } from "react";
import { emit } from "@create-figma-plugin/utilities";
import {
  CommitMessageConfirmation,
  UiCloseHandler,
} from "../../../../apps/token-tango-widget/types/state";

export type PushConfirmationProps = {
  state: CommitMessageConfirmation;
  updateState: (newState: CommitMessageConfirmation) => void;
};

export const PushConfirmation: FC<PushConfirmationProps> = ({
  state,
  updateState,
}) => {
  const { branchName, commitMessage } = state;
  const branchRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  return (
    <div className="container p-4">
      <h2>Push Confirmation</h2>
      <div className="form-group">
        <label htmlFor="branchName">Branch Name:</label>
        <input
          type="text"
          ref={branchRef}
          id="branchName"
          name="branchName"
          placeholder="Enter branch name"
          value={branchName}
        />
      </div>
      <div className="form-group">
        <label htmlFor="commitMessage">Commit Message:</label>
        <textarea
          id="commitMessage"
          ref={messageRef}
          name="commitMessage"
          rows={5}
          placeholder="Enter commit message"
          value={commitMessage}
        ></textarea>
      </div>
      <div className="btn-group">
        <button
          className={"p-4 bg-cyan-300"}
          onClick={() => emit<UiCloseHandler>("UI_CLOSE")}
        >
          Cancel
        </button>
        <button
          className="btn btn-finish"
          onClick={() =>
            updateState({
              branchName: branchRef.current?.value ?? branchName,
              commitMessage: messageRef.current?.value ?? commitMessage,
            })
          }
        >
          Finish
        </button>
      </div>
    </div>
  );
};
