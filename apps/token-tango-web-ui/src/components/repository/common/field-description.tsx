"use client";

import React, { FC, ReactNode } from "react";
import { FieldError } from "react-hook-form";

type FieldDescriptionProps = {
  error?: FieldError;
  text: ReactNode;
  className?: string;
};

export const FieldDescription: FC<FieldDescriptionProps> = ({
  error,
  text,
  className = "",
}) => {
  return (
    <p
      className={`text-sm ${
        error ? "text-red-500" : "text-muted-foreground"
      } ${className}`}
    >
      {error ? error.message : text}
    </p>
  );
};
