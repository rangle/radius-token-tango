import {
  RepositoryService,
  RepositoryCredentials,
  RepositoryOptions,
  ConnectionStatus,
  FileStatus,
  TokenLayersResult,
  defaultContentProcessor,
} from "./repository.interface";
import {
  createGithubRepositoryClient,
  isGithubFileDetails,
  isPackageJSON,
  githubUrlToPath,
  GithubCredentials,
} from "./github.utils";
import { createLogger } from "./logging.utils";
import {
  isTokenLayerStructure,
  TokenLayerStructure,
} from "./token-layers.types";

const log = createLogger("utils:github-service");

/**
 * GitHub implementation of the RepositoryService interface.
 * This is a thin wrapper around the existing GitHub functionality to maintain compatibility
 * while providing a consistent interface for different repository tools.
 */
export class GitHubService implements RepositoryService {
  private adaptCredentials(creds: RepositoryCredentials): GithubCredentials {
    log("debug", "Adapting credentials for repository:", creds.repository);
    return {
      accessToken: creds.accessToken,
      repoFullName: creds.repository,
    };
  }

  async validateAccessToken(accessToken: string): Promise<ConnectionStatus> {
    try {
      const client = createGithubRepositoryClient({
        accessToken,
        repoFullName: "", // Not needed for validation
      });
      const repositories = await client.getRepositories();
      return {
        status: "connected",
        repositories: repositories.map((repo) => ({
          id: repo.name, // Using name as id since GitHub API doesn't return numeric id in this context
          name: repo.name,
          full_name: repo.full_name,
        })),
      };
    } catch (error) {
      log("error", "Failed to validate access token:", error);
      return {
        status: "error",
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  async testRepositoryConnection(
    credentials: Pick<RepositoryCredentials, "repository" | "accessToken">,
    contentProcessor = defaultContentProcessor
  ): Promise<ConnectionStatus> {
    try {
      const client = createGithubRepositoryClient(
        this.adaptCredentials(credentials as RepositoryCredentials)
      );
      const branches = await client.getBranches();
      return {
        status: "connected",
        branches: branches.map((branch) => ({
          name: branch.name,
          protected: branch.protected || false,
        })),
      };
    } catch (error) {
      log("error", "Failed to test repository connection:", error);
      return {
        status: "error",
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  async testFileExists(
    credentials: RepositoryCredentials & { branch: string; filePath: string }
  ): Promise<FileStatus> {
    log(
      "debug",
      "Testing file existence:",
      credentials.filePath,
      "in branch:",
      credentials.branch
    );
    const client = createGithubRepositoryClient(
      this.adaptCredentials(credentials)
    );

    try {
      const { filePath, branch } = credentials;
      const file = await client.getFileDetailsByPath(filePath, branch);
      log("info", "File found:", filePath);
      return {
        status: "found",
        file: {
          name: file.name,
          path: file.path,
          size: file.size,
          encoding: file.encoding,
          content: file.content,
          url: file.url,
        },
      };
    } catch (error) {
      log("error", "File existence test failed:", (error as Error).message);
      return {
        status: "error",
        error: (error as Error).message,
      };
    }
  }

  async fetchRepositoryTokenLayers(
    options: RepositoryOptions
  ): Promise<TokenLayersResult> {
    log(
      "debug",
      "Fetching repository token layers from:",
      options.tokenFilePath
    );
    const client = createGithubRepositoryClient(
      this.adaptCredentials(options.credentials)
    );
    const contentProcessor =
      options.contentProcessor ?? defaultContentProcessor;

    // Get package.json
    log(
      "debug",
      "Looking for package.json relative to:",
      options.tokenFilePath
    );
    const [tokenFilePath, packageFileDetails] =
      await client.getFileInPreviousPath(options.tokenFilePath, "package.json");

    if (!packageFileDetails) {
      log("error", "package.json file not found");
      throw new Error("package.json file not found, must be a Node repository");
    }

    if (!isGithubFileDetails(packageFileDetails)) {
      log("error", "Invalid package.json format");
      throw new Error("Invalid package.json format");
    }

    const packagejsonStr =
      packageFileDetails.encoding === "none"
        ? packageFileDetails.content
        : contentProcessor.decodeContent(
            packageFileDetails.content,
            packageFileDetails.encoding
          );

    const packagejson = contentProcessor.parseContent(packagejsonStr);
    if (!isPackageJSON(packagejson)) {
      log("error", "Invalid package.json content");
      throw new Error("Invalid package.json content");
    }

    // Get token file
    log("debug", "Fetching token file:", options.tokenFilePath);
    const tokenFileDetails = await client
      .getFileDetailsByPath(tokenFilePath, options.branch)
      .catch((e) => {
        if (e.message.includes("404")) {
          log("warn", "Token file not found:", options.tokenFilePath);
          return undefined;
        }
        throw e;
      });

    if (!tokenFileDetails && !options.createFile) {
      log("error", "Token file not found and creation not allowed");
      throw new Error(
        "Token file not found and option to create new file is not set"
      );
    }

    // Get last commits
    log("debug", "Fetching last commits");
    const fileToGetCommitsFrom = tokenFileDetails ?? packageFileDetails;
    const lastCommitsFromRepo = await client.getLastCommitByPath(
      fileToGetCommitsFrom?.path ?? "/"
    );

    console.log("lastCommitsFromRepo", lastCommitsFromRepo);

    const lastCommits = lastCommitsFromRepo.map(
      ({
        commit: { author, committer, message },
        sha,
        author: authorDetails,
        committer: committerDetails,
      }) => ({
        sha,
        message,
        author: {
          ...author,
          avatar_url: authorDetails?.avatar_url,
        },
        committer: {
          ...committer,
          avatar_url: committerDetails?.avatar_url,
        },
      })
    );

    // Get token file content
    log("debug", "Processing token file content");
    const tokenFileContent =
      tokenFileDetails &&
      tokenFileDetails.content &&
      tokenFileDetails.encoding !== "none"
        ? contentProcessor.decodeContent(
            tokenFileDetails.content,
            tokenFileDetails.encoding
          )
        : await client
            .getFileDetailsByPath(tokenFilePath, options.branch, {
              Accept: "application/vnd.github.raw+json",
              "Accept-Encoding": "gzip, deflate, br, base64, utf-8",
              "X-GitHub-Api-Version": "2022-11-28",
            })
            .catch((e) => {
              if (e.message.includes("404")) {
                log("warn", "Raw token file not found");
                return undefined;
              }
              throw e;
            })
            .then((res) => contentProcessor.stringifyContent(res));

    const [name, version] = [
      packagejson?.name ?? "---",
      packagejson?.version ?? "0.0.0",
    ];

    log("debug", "Creating token layers structure");
    const tokenLayers =
      options.createFile && !tokenFileContent
        ? {
            layers: [],
            order: [],
          }
        : contentProcessor.parseContent(tokenFileContent);

    if (!isTokenLayerStructure(tokenLayers)) {
      log("error", "Invalid token layers format");
      throw new Error("Invalid token layers format");
    }

    log("info", "Successfully fetched repository token layers");
    return [
      tokenLayers,
      packagejson,
      {
        name,
        version,
        lastCommits,
        packageFileDetails: {
          name: packageFileDetails.name,
          path: packageFileDetails.path,
          size: packageFileDetails.size,
          encoding: packageFileDetails.encoding,
          content: packageFileDetails.content,
          url: packageFileDetails.url,
        },
      },
    ] as const;
  }

  async saveRepositoryTokenLayers(
    options: RepositoryOptions,
    tokenLayers: TokenLayerStructure,
    message: string,
    destinationBranch?: string,
    version?: string
  ): Promise<{ status: "success" | "error"; error?: string }> {
    log("debug", "Saving repository token layers");
    try {
      const client = createGithubRepositoryClient(
        this.adaptCredentials(options.credentials)
      );
      const contentProcessor =
        options.contentProcessor ?? defaultContentProcessor;

      log("debug", "Fetching current repository state");
      const [_tokenLayers, packagejson, { packageFileDetails }] =
        await this.fetchRepositoryTokenLayers(options);

      log("debug", "Creating commit with changes");
      await client.createCommit(
        options.branch,
        message,
        [
          {
            encoding: "utf-8",
            path: options.tokenFilePath,
            content: contentProcessor.stringifyContent(tokenLayers),
          },
          ...(packageFileDetails && packagejson && version
            ? [
                {
                  encoding: "utf-8",
                  path: githubUrlToPath(packageFileDetails.url),
                  content: contentProcessor.stringifyContent({
                    ...packagejson,
                    version,
                  }),
                },
              ]
            : []),
        ],
        destinationBranch
      );

      log("info", "Successfully saved repository token layers");
      return { status: "success" };
    } catch (error) {
      log(
        "error",
        "Failed to save repository token layers:",
        (error as Error).message
      );
      return {
        status: "error",
        error: (error as Error).message,
      };
    }
  }

  async getBranchNames(credentials: RepositoryCredentials): Promise<string[]> {
    log(
      "debug",
      "Getting branch names for repository:",
      credentials.repository
    );
    const client = createGithubRepositoryClient(
      this.adaptCredentials(credentials)
    );
    const branches = await client.getBranches();
    log("info", "Successfully retrieved branch names");
    return branches.map((b) => b.name);
  }

  testBranchExists(
    branches: string[],
    branch: string
  ): { status: "exists" | "not-exists" } {
    log("debug", "Testing branch existence:", branch);
    return {
      status: branches.includes(branch) ? "exists" : "not-exists",
    };
  }
}
