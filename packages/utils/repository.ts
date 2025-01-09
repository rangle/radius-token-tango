// Re-export only the generic interface types and factory functions
export type {
  RepositoryCredentials,
  RepositoryOptions,
  RepositoryService,
  RepositoryServiceFactory,
  ContentProcessor,
  FileDetails,
  CommitAuthor,
  LastCommit,
  ConnectionStatus,
  FileStatus,
  TokenLayersResult,
} from "./repository.interface";

// Re-export the factory functions and utilities
export { createRepositoryService } from "./repository.factory";
export {
  determineRepositoryType,
  defaultContentProcessor,
} from "./repository.interface";
