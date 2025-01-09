import { Buffer } from "buffer";
import { ContentProcessor } from "@repo/utils";

export type BufferEncoding = "utf-8" | "base64";

export const browserContentProcessor: ContentProcessor = {
  decodeContent(content: string, encoding: BufferEncoding): string {
    return Buffer.from(content).toString(encoding);
  },

  encodeContent(content: string, encoding: BufferEncoding): string {
    return Buffer.from(content).toString(encoding);
  },

  stringifyContent(content: unknown): string {
    return JSON.stringify(content, undefined, 2);
  },

  parseContent(content: string): unknown {
    return JSON.parse(content);
  },
};
