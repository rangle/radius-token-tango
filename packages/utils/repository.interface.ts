import { TokenLayerStructure } from "./token-layers.types";

// Common types that are tool-agnostic
export type RepositoryCredentials = {
  accessToken: string;
  repository: string; // For GitHub: owner/repo, For GitLab: project ID or path
};

export type RepositoryOptions = {
  credentials: RepositoryCredentials;
  branch: string;
  tokenFilePath: string;
  createFile: boolean;
  contentProcessor?: ContentProcessor; // Optional content processor for browser-specific operations
};

export type BufferEncoding = "utf-8" | "base64";

// Content processor interface for browser-specific operations
export interface ContentProcessor {
  decodeContent(content: string, encoding: BufferEncoding): string;
  encodeContent(content: string, encoding: BufferEncoding): string;
  stringifyContent(content: unknown): string;
  parseContent(content: string): unknown;
}

export type FileDetails = {
  name: string;
  path: string;
  size: number;
  encoding: string;
  content: string;
  url: string;
};

export type CommitAuthor = {
  name: string;
  email: string;
  date: string;
  avatar_url?: string;
};

export type LastCommit = {
  sha: string;
  message: string;
  author: CommitAuthor;
  committer: CommitAuthor;
};

export type RepositoryFile = {
  path: string;
  content: string;
  encoding: string;
};

export type ConnectionStatus = {
  status: "connected" | "disconnected" | "error";
  error?: string;
  repositories?: Array<{
    id: string | number;
    name: string;
    full_name: string;
  }>;
  branches?: { name: string; protected: boolean }[];
};

export type FileStatus = {
  status: "found" | "error";
  error?: string;
  file?: FileDetails;
};

export type PackageJSON = {
  name?: string;
  version?: string;
  [key: string]: unknown;
};

export type TokenLayersResult = readonly [
  TokenLayerStructure,
  PackageJSON | undefined,
  {
    name: string;
    version: string;
    lastCommits: LastCommit[];
    packageFileDetails: FileDetails;
  },
];

// Default content processor that throws errors (must be overridden in browser environment)
export const defaultContentProcessor: ContentProcessor = {
  decodeContent: () => {
    throw new Error("Content processor not provided");
  },
  encodeContent: () => {
    throw new Error("Content processor not provided");
  },
  stringifyContent: () => {
    throw new Error("Content processor not provided");
  },
  parseContent: () => {
    throw new Error("Content processor not provided");
  },
};

// The core interface that both GitHub and GitLab implementations will follow
export interface RepositoryService {
  // Connection and validation
  validateAccessToken(accessToken: string): Promise<ConnectionStatus>;
  testRepositoryConnection(
    credentials: Pick<RepositoryCredentials, "repository" | "accessToken">,
    contentProcessor?: ContentProcessor
  ): Promise<ConnectionStatus>;
  testFileExists(
    credentials: RepositoryCredentials & { branch: string; filePath: string }
  ): Promise<FileStatus>;

  // Token layer operations
  fetchRepositoryTokenLayers(
    options: RepositoryOptions
  ): Promise<TokenLayersResult>;
  saveRepositoryTokenLayers(
    options: RepositoryOptions,
    tokenLayers: TokenLayerStructure,
    message: string,
    destinationBranch?: string,
    version?: string
  ): Promise<{ status: "success" | "error"; error?: string }>;

  // Repository information
  getBranchNames(credentials: RepositoryCredentials): Promise<string[]>;
  testBranchExists(
    branches: string[],
    branch: string
  ): { status: "exists" | "not-exists" };
}

// Factory function type for creating repository services
export type RepositoryServiceFactory = (
  tool: "GitHub" | "GitLab"
) => RepositoryService;

// Helper to determine if a repository string is for GitHub or GitLab
export const determineRepositoryType = (
  repository: string
): "GitHub" | "GitLab" => {
  // GitLab can be numeric ID or group/project path
  const isGitLabId = /^\d+$/.test(repository);
  const hasSubgroups = repository.split("/").length > 2;

  return isGitLabId || hasSubgroups ? "GitLab" : "GitHub";
};
