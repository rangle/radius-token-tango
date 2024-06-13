import * as z from "zod";
import { pushMessageSchema } from "./push.schema";
export type PushMessageSchema = z.infer<typeof pushMessageSchema>;

export type PushMessageType = PushMessageSchema & {
  version?: string;
};
