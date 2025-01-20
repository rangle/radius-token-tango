import { RepositoryFormSchema } from "@repo/config";
import {
  UseFormRegister,
  FieldError,
  UseFormSetValue,
  UseFormTrigger,
  UseFormClearErrors,
  UseFormGetValues,
} from "react-hook-form";

// Type guard to check if a form schema is a REST Server config
export const isRestServerConfig = (
  config: RepositoryFormSchema
): config is Extract<RepositoryFormSchema, { tool: "REST Server" }> => {
  return config.tool === "REST Server";
};

// Type for the REST Server form data
export type RestServerFormData = Extract<
  RepositoryFormSchema,
  { tool: "REST Server" }
>;

// Props specific to the REST Server form component
export type RestServerFormProps = {
  // Form state
  errors: Record<keyof RestServerFormData, FieldError | undefined>;
  register: UseFormRegister<RestServerFormData>;
  getValues: UseFormGetValues<RestServerFormData>;
  setValue: UseFormSetValue<RestServerFormData>;
  clearErrors: UseFormClearErrors<RestServerFormData>;
  trigger: UseFormTrigger<RestServerFormData>;

  // UI state
  isSaveDisabled: boolean;
  setIsSaveDisabled: (disabled: boolean) => void;
};

// Function to create props for the REST Server form
export const createRestServerFormProps = ({
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
}): RestServerFormProps | null => {
  const values = getValues();
  if (!isRestServerConfig(values)) return null;

  return {
    errors: errors as Record<keyof RestServerFormData, FieldError | undefined>,
    register: register as UseFormRegister<RestServerFormData>,
    getValues: getValues as UseFormGetValues<RestServerFormData>,
    setValue: setValue as UseFormSetValue<RestServerFormData>,
    clearErrors: clearErrors as UseFormClearErrors<RestServerFormData>,
    trigger: trigger as UseFormTrigger<RestServerFormData>,
    isSaveDisabled,
    setIsSaveDisabled,
  };
};
