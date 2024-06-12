import React, {
  FC,
  ReactNode,
  Ref,
  SVGProps,
  forwardRef,
  useEffect,
  useState,
} from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { FieldError, useForm } from "react-hook-form";

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
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", values);
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
            <Alert variant="destructive" className="mb-4">
              <TriangleAlertIcon className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <Alert className="mb-4">
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
                    console.log("CHANGE", value);
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
                    <FileSearchIcon />
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
                Save
              </Button>
            </div>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};

type CustomSelectProps = {
  options: { name: string; value: string; icon: JSX.Element }[];
  value: string;
  onChange: (event: { target: { value: string } }) => void;
  ref?: React.Ref<any>;
};

export const CustomSelect = React.forwardRef<
  HTMLButtonElement,
  CustomSelectProps
>(({ options, value, onChange }, ref) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center justify-between w-full"
          value={value}
          ref={ref}
        >
          <div className="flex items-center gap-2">
            {options.find((o) => o.value === value)?.icon}
            {options.find((o) => o.value === value)?.name}
          </div>
          <ChevronDownIcon className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            className="flex items-center justify-between w-full"
            onClick={() => onChange({ target: option })}
          >
            <div className="flex items-center gap-2">
              {option.icon}
              <span>{option.name}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

export const FieldDescription: FC<{
  error: FieldError | undefined;
  text: ReactNode;
  className?: string;
}> = ({ error, text, className }) =>
  error ? (
    <span className={`text-red-500 text-xs text-medium p-2 ${className}`}>
      {error.message}
    </span>
  ) : (
    <span className={`text-neutral-500 text-xs text-medium p-2 ${className}`}>
      {text}
    </span>
  );

const ChevronDownIcon = forwardRef<SVGSVGElement, SVGProps<{}>>(
  (props, ref: Ref<SVGSVGElement>) => (
    <svg
      {...props}
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
);

const GithubIcon = forwardRef<SVGSVGElement, SVGProps<{}>>(
  (props, ref: Ref<SVGSVGElement>) => (
    <svg
      {...props}
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  )
);

const TriangleAlertIcon = forwardRef<SVGSVGElement, SVGProps<{}>>(
  (props, ref: Ref<SVGSVGElement>) => (
    <svg
      {...props}
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M23 21L12 2L1 21H23ZM11 18V16H13V18H11ZM11 14H13V10H11V14Z"
      />
    </svg>
  )
);

const InfoAlertIcon = forwardRef<SVGSVGElement, SVGProps<{}>>(
  (props, ref: Ref<SVGSVGElement>) => (
    <svg
      {...props}
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M2 12C2 6.48 6.48 2 12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12ZM13 11V17H11V11H13ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM13 7V9H11V7H13Z"
      />
    </svg>
  )
);

const CheckIcon = forwardRef<SVGSVGElement, SVGProps<{}>>(
  (props, ref: Ref<SVGSVGElement>) => (
    <svg
      {...props}
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path
        d="M9.00002 16.2L4.80002 12L3.40002 13.4L9.00002 19L21 6.99998L19.6 5.59998L9.00002 16.2Z"
        fill="#262626"
      />
    </svg>
  )
);

const FileSearchIcon = forwardRef<SVGSVGElement, SVGProps<{}>>(
  (props, ref: Ref<SVGSVGElement>) => (
    <svg
      {...props}
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M20 8V19.59L16.17 15.75C16.69 14.96 17 14.02 17 13C17 10.24 14.76 8 12 8C9.24 8 7 10.24 7 13C7 15.76 9.24 18 12 18C13.02 18 13.96 17.69 14.76 17.17L19.19 21.6C18.85 21.85 18.45 22 18 22H5.99C4.89 22 4 21.1 4 20L4.01 4C4.01 2.9 4.9 2 6 2H14L20 8ZM12 16C10.34 16 9 14.66 9 13C9 11.34 10.34 10 12 10C13.66 10 15 11.34 15 13C15 14.66 13.66 16 12 16Z"
        fill="currentColor"
      />
    </svg>
  )
);
