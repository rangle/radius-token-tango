import { RepositoryFormSchema } from "@repo/config";
import {
  UseFormRegister,
  FieldError,
  UseFormSetValue,
  UseFormTrigger,
  UseFormClearErrors,
  UseFormGetValues,
} from "react-hook-form";

// Type guard to check if a form schema is a File Download config
export const isFileDownloadConfig = (
  config: RepositoryFormSchema
): config is Extract<RepositoryFormSchema, { tool: "File Download" }> => {
  return config.tool === "File Download";
};

// Type for the File Download form data
export type FileDownloadFormData = Extract<
  RepositoryFormSchema,
  { tool: "File Download" }
>;

// Props specific to the File Download form component
export type FileDownloadFormProps = {
  // Form state
  errors: Record<keyof FileDownloadFormData, FieldError | undefined>;
  register: UseFormRegister<FileDownloadFormData>;
  getValues: UseFormGetValues<FileDownloadFormData>;
  setValue: UseFormSetValue<FileDownloadFormData>;
  clearErrors: UseFormClearErrors<FileDownloadFormData>;
  trigger: UseFormTrigger<FileDownloadFormData>;

  // UI state
  isSaveDisabled: boolean;
  setIsSaveDisabled: (disabled: boolean) => void;
};

// Function to create props for the File Download form
export const createFileDownloadFormProps = ({
  errors,
  register,
  getValues,
  setValue,
  clearErrors,
  trigger,
  isSaveDisabled,
  setIsSaveDisabled,
}: {
  errors: Record<string, FieldError | undefined>;
  register: UseFormRegister<RepositoryFormSchema>;
  getValues: UseFormGetValues<RepositoryFormSchema>;
  setValue: UseFormSetValue<RepositoryFormSchema>;
  clearErrors: UseFormClearErrors<RepositoryFormSchema>;
  trigger: UseFormTrigger<RepositoryFormSchema>;
  isSaveDisabled: boolean;
  setIsSaveDisabled: (disabled: boolean) => void;
}): FileDownloadFormProps | null => {
  const values = getValues();
  if (!isFileDownloadConfig(values)) return null;

  return {
    errors: errors as Record<
      keyof FileDownloadFormData,
      FieldError | undefined
    >,
    register: register as UseFormRegister<FileDownloadFormData>,
    getValues: getValues as UseFormGetValues<FileDownloadFormData>,
    setValue: setValue as UseFormSetValue<FileDownloadFormData>,
    clearErrors: clearErrors as UseFormClearErrors<FileDownloadFormData>,
    trigger: trigger as UseFormTrigger<FileDownloadFormData>,
    isSaveDisabled,
    setIsSaveDisabled,
  };
};
