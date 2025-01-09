import React, { FC, useEffect, useState } from "react";
import { emit } from "@create-figma-plugin/utilities";
import { FieldErrors } from "react-hook-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { useForm } from "react-hook-form";

import { UiCloseHandler } from "../../../../apps/token-tango-widget/types/state";

import {
  WidgetConfiguration,
  RepositoryFormSchema,
  formSchema,
} from "@repo/config";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  testFileExists,
  testRepositoryConnection,
  validateAccessToken,
} from "../services/repository.services";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

import { createLogger } from "@repo/utils";
import { FieldDescription } from "./field-description";
import { CustomSelect } from "./custom-select";
import {
  TriangleAlertIcon,
  InfoAlertIcon,
  GithubIcon,
  ServerIcon,
  CheckIcon,
  FileAddIcon,
  FileSearchIcon,
} from "./custom-icons";
import { Combobox } from "@/components/ui/combobox";

const log = createLogger("WEB:repository");

export type RepositoryConfigProps = {
  state: WidgetConfiguration;
  updateState: (newState: WidgetConfiguration) => void;
};

type GithubConfig = Extract<RepositoryFormSchema, { tool: "GitHub" }>;
type FileDownloadConfig = Extract<
  RepositoryFormSchema,
  { tool: "File Download" }
>;
type RestServerConfig = Extract<RepositoryFormSchema, { tool: "REST Server" }>;

const isGithubConfig = (config: RepositoryFormSchema): config is GithubConfig =>
  config.tool === "GitHub";

const isRestServerConfig = (
  config: RepositoryFormSchema
): config is RestServerConfig => config.tool === "REST Server";

export const RepositoryConfig: FC<RepositoryConfigProps> = ({
  state,
  updateState,
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isSaveDisabled, setIsSaveDisabled] = useState(false);
  const [fileStatus, setFileStatus] = useState<
    "none" | "found" | "not-found" | "error" | "create-new"
  >("none");
  const [branch, setBranch] = useState<string | null>(null);
  const [branches, setBranches] = useState<string[]>([]);
  const [repositories, setRepositories] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
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

  const onSubmit = (values: RepositoryFormSchema) => {
    if (isGithubConfig(values)) {
      updateState({
        ...values,
        status: isConnected ? "online" : "disconnected",
        ...(error ? { error } : {}),
      });
    } else {
      updateState(values);
    }
  };

  const handleValidateToken = async () => {
    const values = getValues();
    if (!isGithubConfig(values)) return;

    const response = await validateAccessToken(values.accessToken);
    if (response.status === "online" && response.repositories) {
      setIsConnected(true);
      setError(null);
      const repositoryNames = response.repositories.map(
        (r: { full_name: string }) => r.full_name
      );
      setRepositories(repositoryNames);
      console.log(">> repositoryNames", repositoryNames);
    } else {
      setIsConnected(false);
      setIsSaveDisabled(true);
      setRepositories([]);
      setError(
        "Access token validation failed. Please check your credentials and try again."
      );
      console.error(response.error);
    }
  };

  const handleTestConnection = () => {
    const values = getValues();
    if (!isGithubConfig(values)) return;

    testRepositoryConnection({
      repository: values.repository,
      accessToken: values.accessToken,
    }).then((response) => {
      if (response.status === "online" && response.branches) {
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
        const branchNames = orderedBranches.map((b) => b.name);
        setBranches(branchNames);
        if (branchNames.includes("main")) {
          setValue("branch", "main", { shouldValidate: true });
          setBranch("main");
        }
      } else {
        setIsSaveDisabled(true);
        setBranches([]);
        setError(
          "Repository connection failed. Please check the repository name and try again."
        );
        console.error(response.error);
      }
    });
  };

  const handleCheckFile = async () => {
    const values = getValues();
    if (!isGithubConfig(values)) return;

    try {
      const { status, file } = await testFileExists({
        repository: values.repository,
        accessToken: values.accessToken,
        branch: values.branch,
        filePath: values.filePath,
      });
      if (status === "found") {
        setFileStatus("found");
        setIsSaveDisabled(false);
      } else {
        setFileStatus("not-found");
        setIsSaveDisabled(true);
      }
      setError(null);
    } catch (err) {
      setFileStatus("error");
      setError(
        "Failed to check file. Please check the file path and try again."
      );
    }
  };

  const filePath = register("filePath", {
    onChange: () => {
      setFileStatus("none");
      trigger("filePath");
    },
  });

  const watchAccessToken = watch("accessToken");
  const watchRepository = watch("repository");
  const watchFilePath = watch("filePath");
  const watchName = watch("name");
  const watchUrl = watch("url");

  useEffect(() => {
    if (watchAccessToken && watchAccessToken.length === 40) {
      clearErrors("accessToken");
    }
  }, [watchAccessToken]);

  useEffect(() => {
    if (watchRepository && repositories.includes(watchRepository)) {
      clearErrors("repository");
    }
  }, [watchRepository]);

  useEffect(() => {
    if (
      branches.length > 0 &&
      !getValues("branch") &&
      branches.includes("main")
    ) {
      console.log(">> pre-selected main");
      setValue("branch", "main");
      setBranch("main");
    } else {
      setBranch(getValues("branch"));
      console.log(">> no pre-selected main", getValues("branch"));
    }
  }, [branches]);

  const selectedTool = watch("tool");

  useEffect(() => {
    setIsConnected(false);
    setIsSaveDisabled(false);
    setFileStatus("none");
    setBranch(null);
    setBranches([]);
    setRepositories([]);
    setError(null);

    const currentValues = getValues();
    const newValues = {
      tool: currentValues.tool,
      name: currentValues.name,
      ...(currentValues.tool === "GitHub" && {
        repository: "",
        accessToken: "",
        filePath: "",
        branch: "main",
        createNewFile: false,
      }),
      ...(currentValues.tool === "REST Server" && {
        url: "",
        headers: [],
      }),
    };
    reset(newValues as RepositoryFormSchema);
  }, [selectedTool]);

  useEffect(() => {
    console.log(">> selectedTool", selectedTool);
    if (selectedTool === "GitHub") {
      setIsSaveDisabled(
        !isConnected ||
          fileStatus === "error" ||
          (fileStatus === "not-found" && !getValues("createNewFile")) ||
          fileStatus === "none"
      );
    } else if (selectedTool === "File Download") {
      const values = getValues();
      setIsSaveDisabled(!values.name);
    } else if (selectedTool === "REST Server") {
      const values = getValues();
      if (isRestServerConfig(values)) {
        setIsSaveDisabled(
          !values.name ||
            !values.url ||
            errors["url" as keyof RepositoryFormSchema] !== undefined
        );
      }
    }
  }, [selectedTool, isConnected, fileStatus, errors, watchName, watchUrl]);

  const values = getValues();

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
              <Alert variant="destructive" className="mb-2">
                <TriangleAlertIcon className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : (
              <Alert className="mb-2">
                <InfoAlertIcon className="h-4 w-4" />
                <AlertTitle>Configure your Token Source</AlertTitle>
                <AlertDescription>
                  Select your tool and configure how to access your token files
                </AlertDescription>
              </Alert>
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
                      e.target.value as
                        | "GitHub"
                        | "File Download"
                        | "REST Server"
                    );
                  }}
                />
              </div>

              {selectedTool === "GitHub" && (
                <>
                  <div className="grid grid-cols-[120px_1fr] items-center gap-2">
                    <Label htmlFor="token">Access Token</Label>
                    <div className="relative">
                      <div className="flex items-center gap-2">
                        <Input
                          id="token"
                          type="password"
                          placeholder="ghp_... or github_pat_..."
                          autoComplete="off"
                          {...register("accessToken")}
                        />
                        <Button
                          variant="secondary"
                          disabled={
                            !isGithubConfig(values) || !values.accessToken
                          }
                          onClick={(e) => {
                            e.preventDefault();
                            handleValidateToken();
                          }}
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
                        error={
                          errors["accessToken" as keyof RepositoryFormSchema]
                        }
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
                    <Label htmlFor="repository">Repository</Label>
                    <div className="relative">
                      <div className="flex items-center gap-2">
                        <Combobox
                          options={repositories}
                          value={
                            isGithubConfig(values) ? values.repository : ""
                          }
                          onValueChange={(value) => {
                            setValue("repository", value);
                            handleTestConnection();
                          }}
                          placeholder="Select a repository..."
                          disabled={!isConnected}
                          className="flex-1"
                        />
                      </div>
                      <FieldDescription
                        error={
                          errors["repository" as keyof RepositoryFormSchema]
                        }
                        text={"Name of the repository in Github"}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-[120px_1fr] items-center gap-2">
                    <Label htmlFor="name">Name</Label>
                    <div className="relative">
                      <Input
                        id="name"
                        placeholder="My Token Source"
                        {...register("name")}
                        disabled={!isConnected || repositories.length === 0}
                      />
                      <FieldDescription
                        error={errors.name}
                        text={"What are you calling this project"}
                        className="col-span-2"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-[120px_1fr] items-center gap-2">
                    <Label htmlFor="branch">Branch</Label>
                    <div className="relative">
                      <Select
                        disabled={!branches.length}
                        defaultValue={branch || undefined}
                        onValueChange={(value) => {
                          setValue("branch", value);
                          setBranch(value);
                        }}
                        value={branch || undefined}
                      >
                        <SelectTrigger className="w-[100%]">
                          <SelectValue
                            placeholder={
                              branches.length
                                ? `select a branch (${branch})`
                                : "-- select a repository first --"
                            }
                            defaultValue={branch || undefined}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {branches.map((branchName) => (
                            <SelectItem key={branchName} value={branchName}>
                              {branchName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FieldDescription
                        error={errors["branch" as keyof RepositoryFormSchema]}
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
                          onChange={(e) => {
                            filePath.onChange(e);
                            setValue("filePath", e.target.value);
                          }}
                          onBlur={filePath.onBlur}
                          disabled={!branches.length}
                        />
                        <Button
                          variant="secondary"
                          onClick={handleCheckFile}
                          className={`p-2 ${fileStatus === "found" ? "bg-green-500 hover:bg-green-600" : fileStatus === "error" ? "bg-red-500 hover:bg-red-600" : fileStatus === "not-found" || fileStatus === "create-new" ? "bg-yellow-500 hover:bg-yellow-500" : ""}`}
                          type="button"
                          aria-label="Check if file path exists"
                          disabled={
                            !isConnected ||
                            !isGithubConfig(values) ||
                            !values.filePath ||
                            errors["filePath" as keyof RepositoryFormSchema] !==
                              undefined
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
                          File does not exist. Check option below to create a
                          new file
                        </span>
                      ) : (
                        <FieldDescription
                          error={
                            errors["filePath" as keyof RepositoryFormSchema]
                          }
                          text={"Path to save/read the tokens JSON file"}
                        />
                      )}
                    </div>
                  </div>
                </>
              )}

              {selectedTool === "File Download" && (
                <>
                  <div className="grid grid-cols-[120px_1fr] items-center gap-2">
                    <Label htmlFor="name">Name</Label>
                    <div className="relative">
                      <Input
                        id="name"
                        placeholder="My Token Source"
                        {...register("name")}
                      />
                      <FieldDescription
                        error={errors.name}
                        text={"What are you calling this project"}
                        className="col-span-2"
                      />
                    </div>
                  </div>
                  <Alert className="mt-auto">
                    <InfoAlertIcon className="h-4 w-4" />
                    <AlertTitle>File Download</AlertTitle>
                    <AlertDescription>
                      Use this option when you want to manually upload and
                      download token files. This is useful when you want to
                      manage your tokens locally or have a custom workflow.
                      You'll be able to export and import token files directly
                      from your computer.
                    </AlertDescription>
                  </Alert>
                </>
              )}

              {selectedTool === "REST Server" && (
                <>
                  <div className="grid grid-cols-[120px_1fr] items-center gap-2">
                    <Label htmlFor="name">Name</Label>
                    <div className="relative">
                      <Input
                        id="name"
                        placeholder="My Token Source"
                        {...register("name")}
                      />
                      <FieldDescription
                        error={errors.name}
                        text={"What are you calling this project"}
                        className="col-span-2"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-[120px_1fr] items-center gap-2">
                    <Label htmlFor="url">URL</Label>
                    <div className="relative">
                      <Input
                        id="url"
                        placeholder="https://api.example.com/tokens"
                        {...register("url")}
                      />
                      <FieldDescription
                        error={errors["url" as keyof RepositoryFormSchema]}
                        text={"The URL to fetch tokens from"}
                      />
                    </div>
                  </div>

                  <Alert className="mt-auto">
                    <InfoAlertIcon className="h-4 w-4" />
                    <AlertTitle>REST Server</AlertTitle>
                    <AlertDescription>
                      Connect to a REST API endpoint to fetch and update your
                      tokens. This is ideal for teams that want to integrate
                      with their existing infrastructure or need real-time
                      synchronization with a backend service.
                    </AlertDescription>
                  </Alert>
                </>
              )}
            </div>
          </div>

          <CardFooter className="flex-none justify-between sm:justify-between border-t">
            {selectedTool === "GitHub" &&
              (fileStatus === "not-found" || fileStatus === "create-new") && (
                <div className="inline-flex items-center p-4 space-x-2">
                  <Checkbox
                    id="create-new-file"
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFileStatus("create-new");
                        setValue("createNewFile", true);
                        setIsSaveDisabled(false);
                      } else {
                        setFileStatus("not-found");
                        setValue("createNewFile", false);
                        setIsSaveDisabled(true);
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
              )}

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
