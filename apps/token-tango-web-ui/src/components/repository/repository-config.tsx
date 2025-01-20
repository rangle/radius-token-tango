"use client";

import React, { FC, useState } from "react";
import { emit } from "@create-figma-plugin/utilities";
import { useForm, FieldError } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import {
  WidgetConfiguration,
  RepositoryFormSchema,
  formSchema,
} from "@repo/config";
import { createLogger } from "@repo/utils";

import { GithubForm } from "./github/github-form";
import { FileDownloadForm } from "./file-download/file-download-form";
import { RestServerForm } from "./rest-server/rest-server-form";
import { ErrorAlert } from "./common/error-alert";
import { InfoAlert } from "./common/info-alert";
import { CustomSelect } from "../custom-select";
import { GithubIcon, FileAddIcon, ServerIcon } from "./common/custom-icons";

import { createGithubFormProps } from "./github/github-form.utils";
import { createFileDownloadFormProps } from "./file-download/file-download-form.utils";
import { createRestServerFormProps } from "./rest-server/rest-server-form.utils";
import { RepositoryConfigProps } from "./types";

import { UiCloseHandler } from "../../../../token-tango-widget/types/state";

const log = createLogger("WEB:repository");

export const RepositoryConfig: FC<RepositoryConfigProps> = ({
  state,
  updateState,
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isSaveDisabled, setIsSaveDisabled] = useState(false);
  const [error, setError] = useState<string | null>(null);

  console.log("$$$$ INITIAL STATE", state);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    watch,
    clearErrors,
    reset,
    trigger,
  } = useForm<RepositoryFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: state,
    mode: "onChange",
  });

  console.log("$$$$ FORM STATE", getValues());

  const onSubmit = (values: RepositoryFormSchema) => {
    if (values.tool === "GitHub") {
      updateState({
        ...values,
        status: isConnected ? "connected" : "disconnected",
        ...(error ? { error } : {}),
      });
    } else {
      updateState(values);
    }
  };

  const selectedTool = watch("tool");

  const formProps = {
    errors: errors as Record<string, FieldError | undefined>,
    register,
    getValues,
    setValue,
    clearErrors,
    trigger,
    isSaveDisabled,
    setIsSaveDisabled: (disabled: boolean) => setIsSaveDisabled(disabled),
  };

  const githubProps = createGithubFormProps({
    ...formProps,
    isConnected,
    setIsConnected,
    error,
    setError: (newError: string | null) => setError(newError),
  });

  const fileDownloadProps = createFileDownloadFormProps(formProps);
  const restServerProps = createRestServerFormProps(formProps);

  return (
    <Card>
      <CardContent className="sm:max-w-[550px] bg-slate-50">
        <form
          onSubmit={handleSubmit(onSubmit, (errors) => {
            console.error("ERROR!!", errors);
          })}
          className="h-full flex flex-col"
        >
          <div className="flex-none">
            <CardHeader>
              <CardTitle>Configure Token Source</CardTitle>
            </CardHeader>
            {error ? (
              <ErrorAlert description={error} />
            ) : (
              <InfoAlert
                title="Configure your Token Source"
                description="Select your tool and configure how to access your token files"
              />
            )}
          </div>

          <div className="flex-1">
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-[120px_1fr] items-center gap-2">
                <Label htmlFor="tool">Tool</Label>
                <CustomSelect
                  value={selectedTool}
                  options={[
                    { name: "GitHub", value: "GitHub", icon: <GithubIcon /> },
                    {
                      name: "File Download",
                      value: "File Download",
                      icon: <FileAddIcon />,
                    },
                    {
                      name: "REST Server",
                      value: "REST Server",
                      icon: <ServerIcon />,
                    },
                  ]}
                  {...register("tool")}
                  onChange={(e) => {
                    console.log(">> Tool onChange", e.target.value);
                    setValue(
                      "tool",
                      e.target.value as RepositoryFormSchema["tool"]
                    );
                  }}
                />
              </div>

              {selectedTool === "GitHub" && githubProps && (
                <GithubForm {...githubProps} />
              )}
              {selectedTool === "File Download" && fileDownloadProps && (
                <FileDownloadForm {...fileDownloadProps} />
              )}
              {selectedTool === "REST Server" && restServerProps && (
                <RestServerForm {...restServerProps} />
              )}
            </div>
          </div>

          <CardFooter className="flex-none justify-between sm:justify-between border-t">
            <div className="inline-flex items-center p-4">
              <Button
                variant="ghost"
                onClick={() => {
                  setError(null);
                  emit<UiCloseHandler>("UI_CLOSE");
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSaveDisabled}>
                Save Configuration
              </Button>
            </div>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};
