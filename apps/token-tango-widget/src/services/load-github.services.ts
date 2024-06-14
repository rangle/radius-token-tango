import { join } from "path-browserify";
import { Buffer } from "buffer";
import {
  GithubOptions,
  createGithubRepositoryClient,
  GithubClient,
  isPackageJSON,
  isGithubFileDetails,
  githubUrlToPath,
} from "@repo/utils";
import { TokenLayers } from "radius-toolkit";

import { createLogger } from "@repo/utils";

const log = createLogger("Services:load-github");

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
  log("debug", ">>", "getPackageJson 1");
  const [tokenFilePath, packageFileDetails] =
    await client.getFileInPreviousPath(options.tokenFilePath, "package.json");
  log("debug", ">>", "getPackageJson 2", tokenFilePath);
  if (!packageFileDetails)
    throw new Error("Cannot find package.json in the repository");

  if (!isGithubFileDetails(packageFileDetails)) {
    log("debug", "PACKAGE.JSON UNKNOWN FORMAT:", packageFileDetails);
    return [undefined, tokenFilePath] as const;
  }

  const packagejsonStr = Buffer.from(
    packageFileDetails.content,
    packageFileDetails.encoding,
  ).toString();

  const packagejson = JSON.parse(packagejsonStr);

  if (!isPackageJSON(packagejson)) {
    log("debug", "PACKAGE.JSON NOT THE RIGHT FORMAT");
    return [undefined, tokenFilePath] as const;
  }
  log("debug", "SUCCESSFULLY", packagejson.version);
  return [packagejson, tokenFilePath, packageFileDetails] as const;
};

/**
 * fetch latest version of foundations and tokens from github
 * @param options - The options for fetching the token layers.
 * @returns A tuple containing the token layers, package.json, and metadata.
 */
export const fetchRepositoryTokenLayers = async (options: GithubOptions) => {
  log("debug", "fetchRepositoryTokenLayers 1");
  const client = createGithubRepositoryClient(options.credentials);
  log("debug", "fetchRepositoryTokenLayers 2");
  const [packagejson, tokenFilePath, packageFileDetails] = await getPackageJson(
    client,
    options,
  );

  const tokenFileDetails = await client
    .getFileDetailsByPath(tokenFilePath, options.branch)
    .catch((e) => {
      if (e.message.includes("404")) {
        console.info("Token file not found at ", tokenFilePath);
        return undefined;
      }
      throw e;
    });

  log("debug", "fetchRepositoryTokenLayers 3", tokenFileDetails);

  if (!tokenFileDetails && !options.createFile) {
    throw new Error(
      "Token file not found and option to create new file is not set",
    );
  }

  const fileToGetCommitsFrom = tokenFileDetails ?? packageFileDetails;

  const lastCommitsFromRepo = await client.getLastCommitByPath(
    fileToGetCommitsFrom?.path ?? "/",
  );

  log("debug", "fetchRepositoryTokenLayers 4");
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
  log("debug", "fetchRepositoryTokenLayers 5");

  // retry obtaining token file content if the original one is empty (ISSUE WITH GITHUB API)
  const tokenFileContent =
    tokenFileDetails &&
    tokenFileDetails.content &&
    (tokenFileDetails.encoding as string) !== "none"
      ? Buffer.from(
          tokenFileDetails.content,
          tokenFileDetails.encoding,
        ).toString()
      : await client
          .getFileDetailsByPath(tokenFilePath, options.branch, {
            Accept: "application/vnd.github.raw+json",
            "Accept-Encoding": "gzip, deflate, br, base64, utf-8",
            "X-GitHub-Api-Version": "2022-11-28",
          })
          .catch((e) => {
            if (e.message.includes("404")) {
              console.info("Token file not found at ", tokenFilePath);
              return undefined;
            }
            throw e;
          })
          .then((res) => JSON.stringify(res));

  log("debug", "fetchRepositoryTokenLayers 6");
  log("debug", tokenFileContent);

  const [name, version] = [
    packagejson?.name ?? "---",
    packagejson?.version ?? "0.0.0",
  ] as const;

  const meta = {
    name,
    version,
    lastCommits,
    packageFileDetails,
  };

  // TODO: add proper typeguard for the contents of the file and some error messages to make it easier for consumers to understand what went wrong
  const tokenLayers =
    options.createFile && !tokenFileContent
      ? ({
          layers: [],
          order: [],
        } satisfies TokenLayers)
      : JSON.parse(tokenFileContent);
  log("debug", "fetchRepositoryTokenLayers 7");
  log("debug", tokenLayers);
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

  const [tokenLayers, packagejson, { packageFileDetails }] = synchData;

  const packageVersion = packagejson?.version ?? "0.0.0";
  log("debug", "Saving version", packageVersion, "->", version);
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
      ...(packageFileDetails && packagejson
        ? [
            {
              encoding: "utf-8",
              path: githubUrlToPath(packageFileDetails.url),
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
