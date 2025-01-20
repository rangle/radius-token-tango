"use client";

import React, { FC } from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { InfoAlertIcon } from "./custom-icons";

type InfoAlertProps = {
  title: string;
  description: string;
};

export const InfoAlert: FC<InfoAlertProps> = ({ title, description }) => {
  return (
    <Alert className="mt-auto">
      <InfoAlertIcon className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
};
