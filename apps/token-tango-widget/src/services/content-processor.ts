import { Buffer } from "buffer";
import { ContentProcessor } from "@repo/utils";

export type BufferEncoding = "utf-8" | "base64";

export const widgetContentProcessor: ContentProcessor = {
  decodeContent(content: string, encoding: BufferEncoding): string {
    return Buffer.from(content, encoding).toString();
  },

  encodeContent(content: string, encoding: string): string {
    return Buffer.from(content).toString(encoding as BufferEncoding);
  },

  stringifyContent(content: unknown): string {
    return JSON.stringify(content, undefined, 2);
  },

  parseContent(content: string): unknown {
    return JSON.parse(content);
  },
};
