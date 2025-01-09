import { join } from "path-browserify";
import {
  createRepositoryService,
  determineRepositoryType,
  RepositoryOptions,
} from "@repo/utils";
import { createLogger } from "@repo/utils";
import { RepositoryTokenLayers } from "../../types/state";
import { widgetContentProcessor } from "./content-processor";

const log = createLogger("Services:load-github");

/**
 * Formats the relative path of a package.json file based on the provided options and packageJson
 * @param options - The repository options object containing the necessary credentials and branch information.
 * @param packageJsonPath - The path to the package.json file.
 * @returns The formatted relative path of the package.json file.
 */
export const formatPackageJsonRelativePath = (
  options: RepositoryOptions,
  packageJsonPath: string | undefined,
) => {
  if (!packageJsonPath) return undefined;
  const branchPrefix = join(options.credentials.repository, options.branch);
  const packageJsonFullPath = join(packageJsonPath ?? "", "package.json");
  const packageJsonRelativePath = packageJsonFullPath?.replace(
    branchPrefix,
    "",
  );
  return packageJsonRelativePath;
};

/**
 * fetch latest version of foundations and tokens from github
 * @param options - The options for fetching the token layers.
 * @returns A tuple containing the token layers, package.json, and metadata.
 */
export const fetchRepositoryTokenLayers = async (
  options: RepositoryOptions,
) => {
  log("debug", "fetchRepositoryTokenLayers 1");
  const service = createRepositoryService(
    determineRepositoryType(options.credentials.repository),
  );
  return service.fetchRepositoryTokenLayers({
    ...options,
    contentProcessor: widgetContentProcessor,
  });
};

/**
 * Saves the repository token layers and increments the package.json version.
 * @param options - The repository options object containing the credentials and branch information.
 * @param tokenLayers - The object representing the token layers to be saved.
 * @param message - The commit message.
 * @param destinationBranch - The destination branch.
 * @param version - Version to update on package.json
 */
export const saveRepositoryTokenLayers = async (
  options: RepositoryOptions,
  synchData: RepositoryTokenLayers,
  message: string,
  destinationBranch?: string,
  version?: string,
) => {
  const service = createRepositoryService(
    determineRepositoryType(options.credentials.repository),
  );
  return service.saveRepositoryTokenLayers(
    {
      ...options,
      contentProcessor: widgetContentProcessor,
    },
    synchData[0],
    message,
    destinationBranch,
    version,
  );
};
