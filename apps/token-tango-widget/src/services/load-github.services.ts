import { join } from "path-browserify";
import { Buffer } from "buffer";
import {
  GithubOptions,
  createGithubRepositoryClient,
  GithubClient,
  isPackageJSON,
  isGithubFileDetails,
} from "@repo/utils";
import { TokenLayers } from "../common/token-parser.types.js";

/**
 * Formats the relative path of a package.json file based on the provided options and packageJson
 * @param options - The GithubOptions object containing the necessary credentials and branch information.
 * @param packageJsonPath - The path to the package.json file.
 * @returns The formatted relative path of the package.json file.
 */
export const formatPackageJsonRelativePath = (
  options: GithubOptions,
  packageJsonPath: string | undefined,
) => {
  if (!packageJsonPath) return undefined;
  const branchPrefix = join(options.credentials.repoFullName, options.branch);
  const packageJsonFullPath = join(packageJsonPath ?? "", "package.json");
  const packageJsonRelativePath = packageJsonFullPath?.replace(
    branchPrefix,
    "",
  );
  return packageJsonRelativePath;
};

/**
 * Retrieves the package.json file from the GitHub repository.
 *
 * @param client - The GitHub client.
 * @param options - The GitHub options.
 * @returns A tuple containing the package.json object, token file, and the relative path to the package.json file.
 * @throws An error if the package.json file cannot be found or if there is a problem reading it.
 */
const getPackageJson = async (client: GithubClient, options: GithubOptions) => {
  console.log(">>", "getPackageJson 1");
  const [tokenFile, packageJsonLocation, packageJsonPath] =
    await client.getFileInPreviousPath(options.tokenFilePath, "package.json");
  console.log(">>", "getPackageJson 2");
  if (!packageJsonLocation)
    throw new Error("Cannot find package.json in the repository");
  const packageJsonRelativePath = formatPackageJsonRelativePath(
    options,
    packageJsonPath,
  );
  const packageResponse = await client.fetchRawFile(packageJsonLocation);
  if (!packageResponse.ok)
    throw new Error("Problem occurred while trying to read package.json");
  console.log(">>", "getPackageJson 3");
  console.log(await packageResponse.json());
  console.log(">>", "getPackageJson 4");
  const packageFileDetails = await packageResponse.json();
  console.log("PACKAGE.JSON LOADED");

  if (!isGithubFileDetails(packageFileDetails)) {
    console.log("PACKAGE.JSON UNKNOWN FORMAT:", packageFileDetails);
    return [undefined, tokenFile] as const;
  }

  const packagejsonStr = Buffer.from(
    packageFileDetails.content,
    packageFileDetails.encoding,
  ).toString();

  const packagejson = JSON.parse(packagejsonStr);

  if (!isPackageJSON(packagejson)) {
    console.log("PACKAGE.JSON NOT THE RIGHT FORMAT");
    return [undefined, tokenFile] as const;
  }
  console.log("SUCCESSFULLY", packagejson.version);
  return [packagejson, tokenFile, packageJsonRelativePath] as const;
};

/**
 * fetch latest version of foundations and tokens from github
 * @param options - The options for fetching the token layers.
 * @returns A tuple containing the token layers, package.json, and metadata.
 */
export const fetchRepositoryTokenLayers = async (options: GithubOptions) => {
  console.log("fetchRepositoryTokenLayers 1");
  const client = createGithubRepositoryClient(options.credentials);
  console.log("fetchRepositoryTokenLayers 2");
  const [packagejson, tokenFile, packageJsonPath] = await getPackageJson(
    client,
    options,
  );
  console.log("fetchRepositoryTokenLayers 3");
  const lastCommitsFromRepo = await client.getLastCommitByPath(tokenFile.path);

  console.log("fetchRepositoryTokenLayers 4");
  const lastCommits = lastCommitsFromRepo.map(
    ({
      commit: { author, committer, message },
      sha,
      author: authorDetails,
      committer: committerDetails,
    }) => ({
      sha,
      message,
      author,
      committer,
      autor_avatar_url: authorDetails?.avatar_url,
      commiter_avatar_url: committerDetails?.avatar_url,
    }),
  );
  console.log("fetchRepositoryTokenLayers 5");

  const tokenFileContent = Buffer.from(
    tokenFile.content,
    tokenFile.encoding,
  ).toString();

  const [name, version] = [
    packagejson?.name ?? "---",
    packagejson?.version ?? "0.0.0",
  ] as const;

  const meta = {
    name,
    version,
    lastCommits,
    packageJsonPath,
  };

  // TODO: add proper typeguard of file
  const tokenLayers = JSON.parse(tokenFileContent);
  return [tokenLayers, packagejson, meta] as const;
};

export type RepositoryTokenLayers =
  ReturnType<typeof fetchRepositoryTokenLayers> extends Promise<infer T>
    ? T
    : never;

/**
 * Saves the repository token layers and increments the package.json version.
 * @param options - The GithubOptions object containing the credentials and branch information.
 * @param tokenLayers - The object representing the token layers to be saved.
 * @param message - The commit message.
 * @param destinationBranch - The destination branch.
 * @param version - Version to update on package.json
 */
export const saveRepositoryTokenLayers = async (
  options: GithubOptions,
  synchData: RepositoryTokenLayers,
  message: string,
  destinationBranch?: string,
  version?: string,
) => {
  const client = createGithubRepositoryClient(options.credentials);

  const [tokenLayers, packagejson, { packageJsonPath }] = synchData;

  const packageVersion = packagejson?.version ?? "0.0.0";
  console.log("Saving version", packageVersion, "->", version);
  return await client.createCommit(
    options.branch,
    message,
    [
      // token file
      {
        encoding: "utf-8",
        path: options.tokenFilePath,
        content: JSON.stringify(tokenLayers, undefined, 2),
      },
      // increment package.json version
      ...(packageJsonPath && packagejson
        ? [
            {
              encoding: "utf-8",
              path: packageJsonPath.replace(
                `repos/${options.credentials.repoFullName}/contents`,
                "",
              ),
              content: JSON.stringify(
                {
                  ...packagejson,
                  version,
                },
                undefined,
                2,
              ),
            },
          ]
        : []),
    ],
    destinationBranch,
  );
};
