import { h, FunctionalComponent } from "preact";
import { useRef } from "preact/hooks";
import { emit } from "@create-figma-plugin/utilities";
import {
  CommitMessageConfirmation,
  UiCloseHandler,
} from "../../../../apps/token-tango-widget/types/state";

export type PushConfirmationProps = {
  state: CommitMessageConfirmation;
  updateState: (newState: CommitMessageConfirmation) => void;
};

export const PushConfirmation: FunctionalComponent<PushConfirmationProps> = ({
  state,
  updateState,
}) => {
  const { branchName, commitMessage } = state;
  const branchRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  return (
    <div class="container">
      <h2>Push Confirmation</h2>
      <div class="form-group">
        <label for="branchName">Branch Name:</label>
        <input
          type="text"
          ref={branchRef}
          id="branchName"
          name="branchName"
          placeholder="Enter branch name"
          value={branchName}
        />
      </div>
      <div class="form-group">
        <label for="commitMessage">Commit Message:</label>
        <textarea
          id="commitMessage"
          ref={messageRef}
          name="commitMessage"
          rows={5}
          placeholder="Enter commit message"
          value={commitMessage}
        ></textarea>
      </div>
      <div class="btn-group">
        <button
          class="btn btn-cancel"
          onClick={() => emit<UiCloseHandler>("UI_CLOSE")}
        >
          Cancel
        </button>
        <button
          class="btn btn-finish"
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
