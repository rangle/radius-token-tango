import { RepositoryFormSchema } from "@repo/config";
import {
  UseFormRegister,
  FieldError,
  UseFormSetValue,
  UseFormTrigger,
  UseFormClearErrors,
  UseFormGetValues,
} from "react-hook-form";

// Type guard to check if a form schema is a GitHub config
export const isGithubConfig = (
  config: RepositoryFormSchema
): config is Extract<RepositoryFormSchema, { tool: "GitHub" }> => {
  return config.tool === "GitHub";
};

// Type for the GitHub form data
export type GithubFormData = Extract<RepositoryFormSchema, { tool: "GitHub" }>;

// File status type for GitHub form
export type FileStatus =
  | "none"
  | "found"
  | "not-found"
  | "error"
  | "create-new";

// Props specific to the GitHub form component
export type GithubFormProps = {
  // Form state
  errors: Record<keyof GithubFormData, FieldError | undefined>;
  register: UseFormRegister<GithubFormData>;
  getValues: UseFormGetValues<GithubFormData>;
  setValue: UseFormSetValue<GithubFormData>;
  clearErrors: UseFormClearErrors<GithubFormData>;
  trigger: UseFormTrigger<GithubFormData>;

  // Connection state
  isConnected: boolean;
  setIsConnected: (connected: boolean) => void;
  isSaveDisabled: boolean;
  setIsSaveDisabled: (disabled: boolean) => void;

  // Error handling
  error: string | null;
  setError: (error: string | null) => void;
};

// Function to create props for the GitHub form
export const createGithubFormProps = ({
  errors,
  register,
  getValues,
  setValue,
  clearErrors,
  trigger,
  isConnected,
  setIsConnected,
  isSaveDisabled,
  setIsSaveDisabled,
  error,
  setError,
}: {
  errors: Record<string, FieldError | undefined>;
  register: UseFormRegister<RepositoryFormSchema>;
  getValues: UseFormGetValues<RepositoryFormSchema>;
  setValue: UseFormSetValue<RepositoryFormSchema>;
  clearErrors: UseFormClearErrors<RepositoryFormSchema>;
  trigger: UseFormTrigger<RepositoryFormSchema>;
  isConnected: boolean;
  setIsConnected: (connected: boolean) => void;
  isSaveDisabled: boolean;
  setIsSaveDisabled: (disabled: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}): GithubFormProps | null => {
  const values = getValues();
  if (!isGithubConfig(values)) return null;

  return {
    errors: errors as Record<keyof GithubFormData, FieldError | undefined>,
    register: register as UseFormRegister<GithubFormData>,
    getValues: getValues as UseFormGetValues<GithubFormData>,
    setValue: setValue as UseFormSetValue<GithubFormData>,
    clearErrors: clearErrors as UseFormClearErrors<GithubFormData>,
    trigger: trigger as UseFormTrigger<GithubFormData>,
    isConnected,
    setIsConnected,
    isSaveDisabled,
    setIsSaveDisabled,
    error,
    setError,
  };
};
