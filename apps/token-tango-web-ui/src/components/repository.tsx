import React, { FC, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { useForm } from "react-hook-form";

import { UiCloseHandler } from "../../../../apps/token-tango-widget/types/state";

import { WidgetConfiguration, FormSchema, formSchema } from "@repo/config";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  testFileExists,
  testRepositoryConnection,
} from "../services/repository.services";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";

import { createLogger } from "@repo/utils";
import { FieldDescription } from "./field-description";
import { CustomSelect } from "./custom-select";
import {
  TriangleAlertIcon,
  InfoAlertIcon,
  GithubIcon,
  CheckIcon,
  FileAddIcon,
  FileSearchIcon,
} from "./custom-icons";

const log = createLogger("WEB:repository");

export type RepositoryConfigProps = {
  state: WidgetConfiguration;
  updateState: (newState: WidgetConfiguration) => void;
};

export const RepositoryConfig: FC<RepositoryConfigProps> = ({
  state,
  updateState,
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);
  const [fileStatus, setFileStatus] = useState<
    "none" | "found" | "not-found" | "error" | "create-new"
  >("none");
  const [branches, setBranches] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState,
    getValues,
    setValue,
    watch,
    clearErrors,
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: state,
    mode: "onBlur",
  });

  const onSubmit = (values: FormSchema) => {
    log("debug", ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", values);
    updateState(values);
  };

  const handleTestConnection = () => {
    const { accessToken, repository } = getValues();
    testRepositoryConnection({
      repository,
      accessToken,
    }).then((response) => {
      if (response.status === "online") {
        setIsConnected(true);
        setIsSaveDisabled(false);
        setError(null);
        const orderedBranches = response.branches.sort((a, b) =>
          a.name === "main"
            ? -1
            : b.name === "main"
              ? 1
              : a.protected
                ? -1
                : b.protected
                  ? 1
                  : 0
        );
        setBranches(response.branches.map((b) => b.name));
      } else {
        setIsConnected(false);
        setIsSaveDisabled(true);
        setBranches([]);
        setError(
          "Connection test failed. Please check your credentials and try again."
        );
        console.error(response.error);
      }
    });
  };
  const handleSave = () => {
    try {
      if (Math.random() > 0.5) {
        throw new Error();
      }
      setError(null);
    } catch (err) {
      setError("Failed to save configuration. Please try again later.");
    }
  };

  const handleCheckFile = async () => {
    try {
      const { status, file } = await testFileExists({
        repository: getValues("repository"),
        accessToken: getValues("accessToken"),
        branch: getValues("branch"),
        filePath: getValues("filePath"),
      });
      if (status === "found") {
        setFileStatus("found");
      } else {
        setFileStatus("not-found");
      }
      setError(null);
    } catch (err) {
      setFileStatus("error");
      setError(
        "Failed to check file. Please check the file path and try again."
      );
    }
  };

  const branch = register("branch");
  const filePath = register("filePath");

  const watchAccessToken = watch("accessToken");

  useEffect(() => {
    if (watchAccessToken && watchAccessToken.length === 40) {
      clearErrors("accessToken");
    }
  }, [watchAccessToken]);

  return (
    <Card>
      <CardContent className="sm:max-w-[550px] bg-slate-50">
        <form
          onSubmit={handleSubmit(onSubmit, (errors) => {
            console.error("ERROR!!", errors);
          })}
        >
          <CardHeader>
            <CardTitle>Configure Repository Access</CardTitle>
          </CardHeader>
          {error ? (
            <Alert variant="destructive" className="mb-2">
              <TriangleAlertIcon className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <Alert className="mb-2">
              <InfoAlertIcon className="h-4 w-4" />
              <AlertTitle>Configure your Codebase</AlertTitle>
              <AlertDescription>
                Select your tool and enter credentials to access your token
                files
              </AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-[120px_1fr] items-center gap-2">
              <Label htmlFor="tool">Tool</Label>
              <CustomSelect
                value="GitHub"
                options={[
                  { name: "GitHub", value: "GitHub", icon: <GithubIcon /> },
                ]}
                {...register("tool")}
              />
            </div>
            <div className="grid grid-cols-[120px_1fr] items-center gap-2">
              <Label htmlFor="name">Name</Label>
              <div className="relative">
                <Input
                  id="name"
                  placeholder="My GitHub Connection"
                  {...register("name")}
                />
                <FieldDescription
                  error={formState.errors.name}
                  text={"What are you calling this project"}
                  className="col-span-2"
                />
              </div>
            </div>
            <div className="grid grid-cols-[120px_1fr] items-center gap-2">
              <Label htmlFor="repository">Repository</Label>
              <div className="relative">
                <Input
                  id="repository"
                  placeholder="user/repository-name"
                  {...register("repository")}
                />
                <FieldDescription
                  error={formState.errors.repository}
                  text={"Name of the repository in Github"}
                />
              </div>
            </div>
            <div className="grid grid-cols-[120px_1fr] items-center gap-2">
              <Label htmlFor="token">Access Token</Label>
              <div className="relative">
                <div className="flex items-center gap-2">
                  <Input
                    id="token"
                    type="password"
                    placeholder="ghp_..."
                    autoComplete="off"
                    {...register("accessToken")}
                  />
                  <Button
                    variant="secondary"
                    disabled={
                      formState.errors.accessToken !== undefined ||
                      getValues("accessToken") === "" ||
                      formState.errors.repository !== undefined ||
                      getValues("repository") === ""
                    }
                    onClick={handleTestConnection}
                    className={
                      error && error.includes("credentials")
                        ? "bg-red-500"
                        : isConnected
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-neutral-200"
                    }
                  >
                    {error && error.includes("credentials") ? (
                      <TriangleAlertIcon />
                    ) : isConnected ? (
                      <CheckIcon />
                    ) : (
                      "validate"
                    )}
                  </Button>
                </div>
                <FieldDescription
                  error={formState.errors.accessToken}
                  text={
                    <>
                      Get a Github Access Token{" "}
                      <a
                        href="https://github.com/settings/tokens"
                        className="underline text-blue-500"
                      >
                        here
                      </a>
                    </>
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-[120px_1fr] items-center gap-2">
              <Label htmlFor="branch">Branch</Label>
              <div className="relative">
                <Select
                  disabled={!isConnected}
                  defaultValue={getValues("branch")}
                  onValueChange={(value) => {
                    log("debug", "CHANGE", value);
                    setValue("branch", value);
                  }}
                >
                  <SelectTrigger className="w-[100%]">
                    <SelectValue
                      placeholder={
                        branches.length
                          ? "select a branch"
                          : "-- connect to get list of branches -- "
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((branch) => (
                      <SelectItem value={branch}>{branch}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldDescription
                  error={formState.errors.branch}
                  text={"Branch to read the file from (usually 'main')"}
                />
              </div>
            </div>
            <div className="grid grid-cols-[120px_1fr] items-center gap-2">
              <Label htmlFor="path">File Path</Label>
              <div className="relative">
                <div className="relative flex items-center gap-2">
                  <Input
                    id="path"
                    placeholder="path/to/tokens-file.json"
                    {...filePath}
                    disabled={!isConnected}
                  />
                  <Button
                    variant="secondary"
                    onClick={handleCheckFile}
                    className={`p-2 ${fileStatus === "found" ? "bg-green-500 hover:bg-green-600" : fileStatus === "error" ? "bg-red-500 hover:bg-red-600" : fileStatus === "not-found" ? "bg-yellow-500 hover:bg-yellow-500" : ""}`}
                    type="button"
                    aria-label="Check if file path exists"
                    disabled={
                      !isConnected ||
                      formState.errors.filePath !== undefined ||
                      getValues("filePath") === ""
                    }
                  >
                    {fileStatus === "create-new" ? (
                      <FileAddIcon />
                    ) : (
                      <FileSearchIcon />
                    )}
                  </Button>
                </div>
                {fileStatus === "found" ? (
                  <span className="text-green-800 text-xs text-medium p-2">
                    File exists in repository
                  </span>
                ) : fileStatus === "not-found" ? (
                  <span className="text-yellow-800 text-xs text-medium p-2">
                    File does not exist. Check option below to create a new file
                  </span>
                ) : (
                  <FieldDescription
                    error={formState.errors.filePath}
                    text={"Path to save/read the tokens JSON file"}
                  />
                )}
              </div>
            </div>
          </div>

          <CardFooter className="justify-between sm:justify-between">
            {fileStatus === "not-found" || fileStatus === "create-new" ? (
              <div className="inline-flex items-center p-4 space-x-2">
                <Checkbox
                  id="create-new-file"
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setFileStatus("create-new");
                      setValue("createNewFile", true);
                    } else {
                      setFileStatus("not-found");
                      setValue("createNewFile", false);
                    }
                  }}
                />
                <label
                  htmlFor="create-new-file"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Create new token file on Export
                </label>
              </div>
            ) : (
              <div />
            )}

            <div className="inline-flex items-center p-4">
              <Button variant="ghost" onClick={() => setError(null)}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  isSaveDisabled ||
                  fileStatus === "error" ||
                  fileStatus === "not-found" ||
                  fileStatus === "none"
                }
              >
                Save Configuration
              </Button>
            </div>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};
