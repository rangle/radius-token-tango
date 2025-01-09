import URL from "url-parse";
import { createLogger } from "./logging.utils";

const log = createLogger("utils:gitlab");

// Type definitions
export type GitlabFile = {
  path: string;
  content: string;
  encoding: "text" | "base64";
};

export type GitlabFileDetails = {
  file_name: string;
  file_path: string;
  size: number;
  encoding: string;
  content: string;
  content_sha256: string;
  ref: string;
  blob_id: string;
  commit_id: string;
  last_commit_id: string;
};

export type GitlabTreeItem = {
  id: string;
  name: string;
  type: string;
  path: string;
  mode: string;
};

export type GitlabBranch = {
  name: string;
  protected: boolean;
  default: boolean;
  developers_can_push: boolean;
  developers_can_merge: boolean;
  can_push: boolean;
  web_url: string;
  commit: {
    id: string;
    short_id: string;
    title: string;
    message: string;
    author_name: string;
    author_email: string;
    authored_date: string;
    committed_date: string;
  };
};

export type GitlabProject = {
  id: number;
  name: string;
  name_with_namespace: string;
  path: string;
  path_with_namespace: string;
  web_url: string;
};

export type GitlabCredentials = {
  accessToken: string;
  projectId: string | number;
};

export type GitlabOptions = {
  credentials: GitlabCredentials;
  branch: string;
  tokenFilePath: string;
  createFile: boolean;
};

// Type guards
export const isGitlabFileDetails = (u: unknown): u is GitlabFileDetails =>
  u !== null &&
  typeof u === "object" &&
  "file_name" in u &&
  "file_path" in u &&
  "content" in u;

export const isGitlabTreeItem = (u: unknown): u is GitlabTreeItem =>
  u !== null &&
  typeof u === "object" &&
  "id" in u &&
  "name" in u &&
  "type" in u &&
  "path" in u;

export const isGitlabBranch = (u: unknown): u is GitlabBranch =>
  u !== null &&
  typeof u === "object" &&
  "name" in u &&
  "protected" in u &&
  "commit" in u;

export const isGitlabProject = (u: unknown): u is GitlabProject =>
  u !== null &&
  typeof u === "object" &&
  "id" in u &&
  "path_with_namespace" in u;

// Utility functions
export const gitlabUrlToPath = (url: string) => {
  const parsedUrl = new URL(url);
  return decodeURIComponent(
    parsedUrl.pathname.replace(/^.*\/repository\/files\//, "")
  );
};

// Main client creation function
export const createGitlabRepositoryClient = ({
  accessToken,
  projectId,
}: GitlabCredentials) => {
  const encodePath = (path: string) =>
    encodeURIComponent(path.replace(/^\//, ""));

  const command = async <T extends object>(
    partialUrl: string,
    body?: T,
    method = "POST",
    headers: HeadersInit = {}
  ) => {
    const url = `https://gitlab.com/api/v4/projects/${encodeURIComponent(String(projectId))}/${partialUrl}`;
    log("debug", ">>> Before fetch", method, url);

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "PRIVATE-TOKEN": accessToken,
        ...headers,
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    }).catch((e) => {
      log("debug", ">>>", e);
      console.error("ERROR WHILE FETCHING", e);
      return e;
    });

    log("debug", "<<<<<<<<<< After fetch", response.status);
    if (!response.ok) {
      console.error(await response.json());
      throw new Error(`HTTP returned code ${response.status}`);
    }

    const res = await response.json();
    log("debug", ">>> RES", res);
    return res;
  };

  const fetchRawFile = async (path: string, ref?: string) => {
    const encodedPath = encodePath(path);
    const url = `https://gitlab.com/api/v4/projects/${encodeURIComponent(String(projectId))}/repository/files/${encodedPath}/raw${ref ? `?ref=${ref}` : ""}`;

    log("debug", ">>>>> before raw fetch", url);
    const response = await fetch(url, {
      headers: {
        "PRIVATE-TOKEN": accessToken,
      },
    });
    log("debug", ">>>>> after raw fetch", response.status);
    return response;
  };

  const getFileListByPath = async (path: string, ref?: string) => {
    const result = await command(
      `repository/tree?path=${encodePath(path)}${ref ? `&ref=${ref}` : ""}`,
      undefined,
      "GET"
    );

    if (!Array.isArray(result) || !result.every(isGitlabTreeItem)) {
      throw new Error(`Could not obtain tree for path ${path}`);
    }
    return result;
  };

  const getFileDetailsByPath = async (path: string, ref?: string) => {
    const encodedPath = encodePath(path);
    const result = await command(
      `repository/files/${encodedPath}${ref ? `?ref=${ref}` : ""}`,
      undefined,
      "GET"
    );

    if (!isGitlabFileDetails(result)) {
      throw new Error(`Could not obtain file details for ${path}`);
    }
    return result;
  };

  const createBranch = async (newBranch: string, ref: string) => {
    return command("repository/branches", {
      branch: newBranch,
      ref,
    });
  };

  const createCommit = async (
    branch: string,
    message: string,
    files: GitlabFile[],
    newBranch?: string
  ) => {
    if (newBranch) {
      await createBranch(newBranch, branch);
      branch = newBranch;
    }

    // In GitLab, we commit files individually
    for (const file of files) {
      const encodedPath = encodePath(file.path);
      await command(`repository/files/${encodedPath}`, {
        branch,
        content: file.content,
        commit_message: message,
        encoding: file.encoding,
      });
    }

    return { status: "success" };
  };

  const getLastCommitByPath = async (path: string, ref?: string) => {
    const result = await command(
      `repository/commits?path=${encodePath(path)}${ref ? `&ref=${ref}` : ""}&per_page=1`,
      undefined,
      "GET"
    );

    if (!Array.isArray(result) || result.length === 0) {
      throw new Error(`Could not obtain last commit for ${path}`);
    }
    return result[0];
  };

  const getBranches = async () => {
    const result = await command("repository/branches", undefined, "GET");
    if (!Array.isArray(result) || !result.every(isGitlabBranch)) {
      throw new Error("Could not obtain branches for the repository");
    }
    return result;
  };

  const getProjects = async () => {
    const result = await fetch(
      "https://gitlab.com/api/v4/projects?membership=true",
      {
        headers: {
          "PRIVATE-TOKEN": accessToken,
        },
      }
    ).then((res) => res.json());

    if (!Array.isArray(result) || !result.every(isGitlabProject)) {
      throw new Error("Could not obtain projects list");
    }
    return result;
  };

  return {
    fetchRawFile,
    createCommit,
    getBranches,
    getProjects,
    getFileListByPath,
    getFileDetailsByPath,
    getLastCommitByPath,
    createBranch,
  };
};

export type GitlabClient = ReturnType<typeof createGitlabRepositoryClient>;
