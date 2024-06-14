import React, { FC } from "react";
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

const log = createLogger("WEB:push");

export type PushConfirmationProps = {
  state: PushMessageType & WidgetConfiguration;
  updateState: (newState: PushMessageType) => void;
};

export const PushConfirmation: FC<PushConfirmationProps> = ({
  state,
  updateState,
}) => {
  const onSubmit = ({ branchName, commitMessage }: PushMessageType) => {
    log("debug", ">>>>>>>>>>>>>>>>>>>>>>>>>", branchName, commitMessage);
    return updateState({
      branchName,
      commitMessage,
    });
  };

  const { register, handleSubmit } = useForm<PushMessageSchema>({
    resolver: zodResolver(pushMessageSchema),
    defaultValues: state,
    mode: "onBlur",
  });

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
              {...register("branchName")}
            />
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
            <Button type="submit">Confirm and Push</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
