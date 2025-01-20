"use client";

import React, { FC } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { FileDownloadFormProps } from "./file-download-form.utils";
import { FieldDescription } from "../common/field-description";
import { InfoAlert } from "../common/info-alert";

export const FileDownloadForm: FC<FileDownloadFormProps> = ({
  errors,
  register,
  getValues,
}) => {
  return (
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
      <InfoAlert
        title="File Download"
        description="Use this option when you want to manually upload and download token files. This is useful when you want to manage your tokens locally or have a custom workflow. You'll be able to export and import token files directly from your computer."
      />
    </>
  );
};
