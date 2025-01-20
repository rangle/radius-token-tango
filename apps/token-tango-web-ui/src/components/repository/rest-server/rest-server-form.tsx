"use client";

import React, { FC } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { InfoAlert } from "../common/info-alert";
import { FieldDescription } from "../common/field-description";
import { RestServerFormProps } from "./rest-server-form.utils";

export const RestServerForm: FC<RestServerFormProps> = ({
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

      <div className="grid grid-cols-[120px_1fr] items-center gap-2">
        <Label htmlFor="url">URL</Label>
        <div className="relative">
          <Input
            id="url"
            placeholder="https://api.example.com/tokens"
            {...register("url")}
          />
          <FieldDescription
            error={errors.url}
            text={"The URL to fetch tokens from"}
          />
        </div>
      </div>

      <InfoAlert
        title="REST Server"
        description="Connect to a REST API endpoint to fetch and update your tokens. This is ideal for teams that want to integrate with their existing infrastructure or need real-time synchronization with a backend service."
      />
    </>
  );
};
