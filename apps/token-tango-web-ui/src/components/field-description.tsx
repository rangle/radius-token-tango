import React, { FC, ReactNode } from "react";
import { FieldError } from "react-hook-form";

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
