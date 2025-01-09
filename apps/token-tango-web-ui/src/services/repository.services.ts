import { RepositoryFormSchema } from "@repo/config";
import { createLogger } from "@repo/utils";
import { createRepositoryService, determineRepositoryType } from "@repo/utils";
import { browserContentProcessor } from "./content-processor";

const log = createLogger("WEB:Services:repository");

type GithubCredentials = Extract<RepositoryFormSchema, { tool: "GitHub" }>;

export const testRepositoryConnection = async (
  credentials: Pick<GithubCredentials, "repository" | "accessToken">
) => {
  const service = createRepositoryService(
    determineRepositoryType(credentials.repository)
  );
  return service.testRepositoryConnection(credentials, browserContentProcessor);
};

export const testFileExists = async (
  credentials: Pick<
    GithubCredentials,
    "repository" | "accessToken" | "branch" | "filePath"
  >
) => {
  const service = createRepositoryService(
    determineRepositoryType(credentials.repository)
  );
  return service.testFileExists({
    ...credentials,
  });
};

export const getBranchNames = async (
  credentials: Pick<GithubCredentials, "repository" | "accessToken" | "branch">
) => {
  const service = createRepositoryService(
    determineRepositoryType(credentials.repository)
  );
  return service.getBranchNames({
    ...credentials,
  });
};

export const testBranchAlreadyExists = (branches: string[], branch: string) => {
  const service = createRepositoryService("GitHub"); // Tool type doesn't matter for this pure function
  return service.testBranchExists(branches, branch);
};

export const validateAccessToken = async (accessToken: string) => {
  // For now, we'll default to GitHub since we don't have tool selection at this point
  const service = createRepositoryService("GitHub");
  return service.validateAccessToken(accessToken);
};
