"use client";

import React, { FC, useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Combobox } from "@/components/ui/combobox";
import { FieldDescription } from "../common/field-description";
import {
  TriangleAlertIcon,
  CheckIcon,
  FileAddIcon,
  FileSearchIcon,
} from "../common/custom-icons";
import {
  FileStatus,
  GithubFormProps,
  GithubFormData,
} from "./github-form.utils";
import {
  validateAccessToken,
  testRepositoryConnection,
  testFileExists,
} from "../../../services/repository.services";

export const GithubForm: FC<GithubFormProps> = ({
  errors,
  register,
  isConnected,
  setIsConnected,
  isSaveDisabled,
  setIsSaveDisabled,
  getValues,
  setValue,
  clearErrors,
  trigger,
  error,
  setError,
}) => {
  const [fileStatus, setFileStatus] = useState<FileStatus>("none");
  const [branch, setBranch] = useState<string | null>(null);
  const [branches, setBranches] = useState<string[]>([]);
  const [repositories, setRepositories] = useState<string[]>([]);
  const [isRepositoryDisabled, setIsRepositoryDisabled] = useState(true);

  const handleValidateToken = async () => {
    const values = getValues();
    console.log(">> values", values);
    console.log(">> about to validate accessToken", values.accessToken);
    const response = await validateAccessToken(values.accessToken);
    console.log(">> response", response);
    if (response.status === "connected" && response.repositories) {
      setError(null);
      const repositoryNames = response.repositories.map(
        (repo) => repo.full_name
      );
      setRepositories(repositoryNames);
      console.log(">> repositoryNames", repositoryNames);
      setIsRepositoryDisabled(false);
      setIsConnected(true);
    } else {
      console.log(
        ">>status is not 'connected'",
        response.status,
        response.error
      );
      setError(response.error || "Failed to validate access token");
      setIsRepositoryDisabled(true);
      setRepositories([]);
      setError(
        "Access token validation failed. Please check your credentials and try again."
      );
      setIsConnected(false);
      console.error(response.error);
    }
  };

  const handleTestConnection = () => {
    const values = getValues();
    testRepositoryConnection({
      repository: values.repository,
      accessToken: values.accessToken,
    }).then((response) => {
      if (response.status === "connected" && response.branches) {
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
          setValue("branch", "main");
          setBranch("main");
        }
      } else {
        setIsSaveDisabled(true);
        setBranches([]);
        setError(response.error || "Failed to fetch repository branches");
      }
    });
  };

  const handleCheckFile = async () => {
    const values = getValues();
    try {
      const { status } = await testFileExists({
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
    } catch (err) {
      setFileStatus("error");
      setIsSaveDisabled(true);
      setError("Failed to check file existence");
    }
  };

  const filePath = register("filePath", {
    onChange: () => {
      setFileStatus("none");
      trigger("filePath");
    },
  });

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

  return (
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
              {...register("accessToken", {
                onChange: (e) => {
                  setValue("accessToken", e.target.value, {
                    shouldValidate: true,
                  });
                },
                onBlur: (e) => {
                  setValue("accessToken", e.target.value, {
                    shouldValidate: true,
                  });
                },
              })}
            />
            <Button
              variant="secondary"
              disabled={!getValues("accessToken")}
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
            error={errors.accessToken}
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
              value={getValues("repository")}
              onValueChange={(value) => {
                setValue("repository", value);
                handleTestConnection();
              }}
              placeholder="Select a repository..."
              disabled={isRepositoryDisabled}
              className="flex-1"
            />
          </div>
          <FieldDescription
            error={errors.repository}
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
            disabled={isRepositoryDisabled || repositories.length === 0}
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
            error={errors.branch}
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
                isRepositoryDisabled ||
                !getValues("filePath") ||
                errors.filePath !== undefined
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
              error={errors.filePath}
              text={"Path to save/read the tokens JSON file"}
            />
          )}
        </div>
      </div>

      {(fileStatus === "not-found" || fileStatus === "create-new") && (
        <div className="inline-flex items-center p-4 space-x-2">
          <Checkbox
            id="create-new-file"
            onCheckedChange={(checked: boolean) => {
              if (checked) {
                setFileStatus("create-new");
                setValue("createNewFile", checked);
                setIsSaveDisabled(false);
              } else {
                setFileStatus("not-found");
                setValue("createNewFile", checked);
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
    </>
  );
};
