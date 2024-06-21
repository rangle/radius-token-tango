import { promises } from "node:fs";
import { SystemOperations } from "../lib/exporting";

/// read data from standard input
export const readStdin = (): Promise<Buffer> => {
  // eslint-disable-next-line
  if (!!process.stdin.setRawMode) {
    throw new Error(
      `This script should receive its input as data piped through standard input
           example:
             cat file.json | ts-node ${__filename} > result.json
          `
    );
  }

  return new Promise((resolve, reject) => {
    let chunks: Buffer[] = [];
    process.stdin.on("readable", () => {
      const chunk = process.stdin.read();

      if (chunk !== null) {
        chunks = [...chunks, chunk];
      }
    });
    process.stdin.on("end", () => {
      resolve(Buffer.concat(chunks));
    });
    process.stdin.on("error", reject);
  });
};

/// write a buffer to standard output
export const writeToStdout = (buffer: Buffer) => {
  process.stdout.write(buffer);
};

/// load a file from the file system
export const loadFile = async (fileName: string) => {
  return promises.readFile(fileName);
};

/// write a buffer to a file
export const writeFile = async (fileName: string, buffer: Buffer) => {
  return promises.writeFile(fileName, buffer);
};

export const systemOperations: SystemOperations = {
  loadFile,
  writeFile,
  readStdin,
  writeToStdout,
};
