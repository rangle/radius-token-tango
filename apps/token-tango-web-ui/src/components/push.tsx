import React, { FC, useEffect, useState } from "react";
import { emit } from "@create-figma-plugin/utilities";
import { UiCloseHandler } from "../../../../apps/token-tango-widget/types/state";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  PushMessageSchema,
  PushMessageType,
  WidgetConfiguration,
  pushMessageSchema,
} from "@repo/config";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { createLogger } from "@repo/utils";
import {
  getBranchNames,
  testBranchAlreadyExists,
} from "../services/repository.services";
import { FieldDescription } from "./field-description";

const log = createLogger("WEB:push");

export type PushConfirmationProps = {
  state: PushMessageType & WidgetConfiguration;
  updateState: (newState: PushMessageType) => void;
};

export const PushConfirmation: FC<PushConfirmationProps> = ({
  state,
  updateState,
}) => {
  const [branchStatus, setBranchStatus] = useState<
    "exists" | "not-exists" | "error" | undefined
  >(undefined);

  const [branches, setBranches] = useState<string[]>([]);

  const onSubmit = ({ branchName, commitMessage }: PushMessageType) => {
    log("debug", ">>>>>>>>>>>>>>>>>>>>>>>>>", branchName, commitMessage);
    return updateState({
      branchName,
      commitMessage,
    });
  };

  const { register, handleSubmit, formState, watch } =
    useForm<PushMessageSchema>({
      resolver: zodResolver(pushMessageSchema),
      defaultValues: state,
      mode: "onBlur",
    });

  const handleCheckIfPushable = async (branch: string) => {
    const result = testBranchAlreadyExists(branches, branch);
    log("warn", "TEST BRANCH", result, branches);
    setBranchStatus(result.status);
  };

  watch(({ branchName }) => {
    if (branchName) {
      handleCheckIfPushable(branchName);
    } else {
      setBranchStatus(undefined);
    }
  });

  // initial loading of branch names
  useEffect(() => {
    if (state.tool === "GitHub") {
      getBranchNames({
        repository: state.repository,
        accessToken: state.accessToken,
        branch: state.branch,
      }).then((branches) => {
        setBranches(branches);
      });
    }
  }, [state]);

  // initial validation of the value of the form field
  useEffect(() => {
    handleCheckIfPushable(state.branchName);
  }, [branches]);

  return (
    <Card className="w-full max-w-xl">
      <CardHeader>
        <CardTitle>Confirm Branch and Commit</CardTitle>
        <CardDescription>
          Review and adjust the branch and commit message before pushing to the
          repository.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid gap-1">
            <Label htmlFor="branch">Branch Name</Label>
            <Input
              id="branch"
              type="text"
              placeholder="Enter branch name"
              className={branchStatus === "exists" ? "border-red-800" : ""}
              {...register("branchName")}
            />
            {branchStatus === "exists" ? (
              <span className="text-red-800 text-xs text-medium p-2">
                This branch already exists in the repository. Choose a new
                branch name.
              </span>
            ) : branchStatus === "error" ? (
              <span className="text-red-800 text-xs text-medium p-2">
                There was an error connecting to the repository
              </span>
            ) : (
              <FieldDescription
                error={formState.errors.branchName}
                text={
                  "Name of the new branch these changes will be pushed into"
                }
              />
            )}
          </div>
          <div className="grid gap-1">
            <Label htmlFor="commit-message">Commit Message</Label>
            <Textarea
              id="commit-message"
              placeholder="Enter commit message"
              rows={14}
              {...register("commitMessage")}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline">Cancel</Button>
            <Button type="submit" disabled={branchStatus !== "not-exists"}>
              Confirm and Push
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
