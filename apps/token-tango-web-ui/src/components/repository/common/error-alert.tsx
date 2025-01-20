"use client";

import React, { FC } from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { TriangleAlertIcon } from "./custom-icons";

type ErrorAlertProps = {
  title?: string;
  description: string;
};

export const ErrorAlert: FC<ErrorAlertProps> = ({
  title = "Error",
  description,
}) => {
  return (
    <Alert variant="destructive" className="mb-2">
      <TriangleAlertIcon className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
};
