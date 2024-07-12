import URL from "url-parse";

import { createLogger } from "./logging.utils";

const log = createLogger("utils:github");

export type GithubFile = {
  path: string;
  content: string;
  encoding: string;
};

export type ObjectWithSha = { sha: string };
export const isObjectWithSHA = (u: unknown): u is ObjectWithSha =>
  u !== null &&
  typeof u === "object" &&
  "sha" in u &&
  typeof u["sha"] === "string";

export type GithubFileDetails = {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  download_url: string;
  type: string;
  encoding: "utf-8" | "base64";
  content: string;
};

export const isGithubFileDetails = (u: unknown): u is GithubFileDetails =>
  u !== null &&
  typeof u === "object" &&
  "name" in u &&
  "url" in u &&
  "type" in u &&
  "html_url" in u &&
  "download_url" in u;

export type CommitUser = {
  name: string;
  email: string;
  date: string;
};

export const isCommitUser = (u: unknown): u is CommitUser =>
  u !== null &&
  typeof u === "object" &&
  "name" in u &&
  typeof u["name"] === "string" &&
  "email" in u &&
  typeof u["email"] === "string" &&
  "date" in u &&
  typeof u["date"] === "string";

export type UserDetails = {
  login: string;
  id: number;
  avatar_url: string;
};

export const isUserDetails = (u: unknown): u is UserDetails =>
  u !== null &&
  typeof u === "object" &&
  "login" in u &&
  typeof u["login"] === "string" &&
  "id" in u &&
  typeof u["id"] === "number" &&
  "avatar_url" in u &&
  typeof u["avatar_url"] === "string";

export type CommitData = {
  author: CommitUser;
  committer: CommitUser;
  message: string;
  url: string;
};

export const isCommitData = (u: unknown): u is CommitData =>
  u !== null &&
  typeof u === "object" &&
  "author" in u &&
  isCommitUser(u["author"]) &&
  "committer" in u &&
  isCommitUser(u["committer"]) &&
  "message" in u &&
  typeof u["message"] === "string" &&
  "url" in u &&
  typeof u["url"] === "string";

export type CommitDetails = {
  sha: string;
  node_id: string;
  commit: CommitData;
  url: string;
  author: UserDetails;
  committer: UserDetails;
};

export const isCommitDetails = (u: unknown): u is CommitDetails =>
  u !== null &&
  typeof u === "object" &&
  "sha" in u &&
  typeof u["sha"] === "string" &&
  "node_id" in u &&
  typeof u["node_id"] === "string" &&
  "commit" in u &&
  isCommitData(u["commit"]) &&
  "url" in u &&
  typeof u["url"] === "string" &&
  "author" in u &&
  "committer" in u;

export const isCommitDetailsArray = (u: unknown): u is Array<CommitDetails> => {
  return Array.isArray(u) && u.every((item) => isCommitDetails(item));
};

export type CommitListItem = {
  name: string;
  protected: boolean;
};

export const isCommitListItem = (u: unknown): u is CommitListItem =>
  !!u && typeof u === "object" && "name" in u && "protected" in u;

export const isCommitList = (l: unknown): l is Array<CommitListItem> => {
  return Array.isArray(l) && l.every(isCommitListItem);
};

export const githubUrlToPath = (url: string) => {
  return url.replace(/^.*\/contents\//, "").replace(/\?[^\/]*$/, "");
};

// this recursive function should receive a path, that is either a path or a url, and run the visitor function for each path segment until it's true or until the execution reaches either the host or the root
export const findInPreviousPath = async (
  pathOrUrl: string,
  visit: (f: string) => Promise<GithubFileDetails | undefined>
): Promise<GithubFileDetails | undefined> => {
  // if it's a url, extricate the path part and pass only the path to the visitor
  const isUrl = pathOrUrl.startsWith("http");
  const path = isUrl ? new URL(pathOrUrl).pathname : pathOrUrl;
  const pathSegments = path.split("/").filter(Boolean);

  if (pathSegments.length < 0) {
    return undefined;
  }

  const newPath = pathSegments.join("/");
  const visitResult = await visit(newPath);

  if (visitResult || newPath === "") {
    return visitResult;
  }

  return findInPreviousPath(pathSegments.slice(0, -1).join("/"), visit);
};

export type GithubCredentials = {
  accessToken: string;
  repoFullName: string;
};

export type GithubOptions = {
  credentials: GithubCredentials;
  branch: string;
  tokenFilePath: string;
  createFile: boolean;
};

export type PackageJSON = {
  name?: string;
  version?: string;
  [key: string]: unknown;
};

export type LastCommit = {
  sha: string;
  message: string;
  author: {
    name: string;
    email: string;
    date: string;
  };
  committer: {
    name: string;
    email: string;
    date: string;
  };
  autor_avatar_url?: string;
  commiter_avatar_url?: string;
};

export const isPackageJSON = (u: unknown): u is PackageJSON =>
  u !== null && typeof u === "object" && ("name" in u || "version" in u);

export const formatUrl = (
  originalUrl: string,
  newPath: string,
  fileName: string
) => {
  const url = new URL(originalUrl);
  const protocol = url.protocol;
  const newPathWithFileName = newPath ? `${newPath}/${fileName}` : fileName;
  return `${protocol}//${url.host}/${newPathWithFileName}${url.query}`;
};

export const createGithubRepositoryClient = ({
  accessToken,
  repoFullName,
}: GithubCredentials) => {
  const command = async <T extends object>(
    partialUrl: string,
    body?: T,
    method = "POST",
    headers: HeadersInit = {}
  ) => {
    log(
      "debug",
      ">>> Before fetch",
      method,
      `https://api.github.com/repos/${repoFullName}/${partialUrl}`
    );
    const response = await fetch(
      `https://api.github.com/repos/${repoFullName}/${partialUrl}`,
      {
        method,
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${accessToken}`,
          "X-GitHub-Api-Version": "2022-11-28",
          ...headers,
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
      }
    ).catch((e) => {
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

  const fetchRawFile = async (url: string, head = false) => {
    log("debug", ">>>>> before raw fetch", url);
    const response = await fetch(url, {
      method: head ? "HEAD" : "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });
    log("debug", ">>>>> after raw fetch", response.status);
    // log('debug', JSON.stringify(await response.json()));
    return response;
  };

  const createFileBlob = async ({ path, content, encoding }: GithubFile) => {
    const result = await command("git/blobs", {
      content,
      encoding,
    });
    if (!isObjectWithSHA(result))
      throw new Error(`Could not create blob for file ${path}`);
    return result.sha;
  };

  const getBaseTree = async (branchName: string) => {
    const result = await command(`git/trees/${branchName}`, undefined, "GET");
    if (!isObjectWithSHA(result))
      throw new Error(
        `Could not obtain SHA for base tree on branch ${branchName}`
      );
    log("debug", ">>>>>>>", result);
    return result;
  };

  const getShaForBaseTree = async (branchName: string) => {
    const result = await getBaseTree(branchName);
    return result.sha;
  };

  const getParentSha = async (branchName: string) => {
    log("debug", "getParentSha", branchName);
    const result = await command(
      `git/refs/heads/${branchName}`,
      undefined,
      "GET"
    )
      .then((res) => {
        log("debug", "getParentSha yeah!");
        return res;
      })
      .catch((e) => {
        log("debug", "getParentSha ERROR!", e);
        throw new Error(e);
      });
    log("debug", ">> getParentSha fetched!");

    if (
      !(
        typeof result === "object" &&
        "object" in result &&
        isObjectWithSHA(result.object)
      )
    )
      throw new Error(
        `Could not obtain SHA for the parent commit on branch ${branchName}`
      );
    return result.object.sha;
  };

  const createGithubRepoTree = async (
    branchName: string,
    files: GithubFile[]
  ) => {
    const base_tree = await getShaForBaseTree(branchName);
    const tree = await Promise.all(
      files.map(async ({ path, content, encoding }) => {
        const sha = await createFileBlob({ path, content, encoding });
        return {
          path: path.replace(/^\/*/, ""),
          mode: "100644",
          type: "blob",
          sha,
        };
      })
    );
    const result = await command("git/trees", {
      base_tree,
      tree,
    });
    if (!isObjectWithSHA(result))
      throw new Error(
        `Could not obtain SHA for the new tree on branch ${branchName}`
      );
    return result.sha;
  };

  const createCommit = async (
    branchName: string,
    message: string,
    files: GithubFile[],
    newBranchName?: string
  ) => {
    log("debug", "Create Commit from", branchName);
    const parentSha = await getParentSha(branchName);
    let branch = branchName;
    if (newBranchName) {
      const payload = {
        ref: `refs/heads/${newBranchName}`,
        sha: parentSha,
      };
      branch = newBranchName;
      log("debug", "Create Commit on", branch);
      await command("git/refs", payload, "POST");
      log("debug", "Branch", branch, "created");
    }
    log("debug", "creating tree");
    const tree = await createGithubRepoTree(branch, files);
    log("debug", "tree created");

    const payload = {
      message,
      tree,
      parents: [parentSha],
    };

    log("debug", "pushing commit");
    const commitResult = await command("git/commits", payload, "POST");
    if (!isObjectWithSHA(commitResult))
      throw new Error(`Could not obtain SHA of the commit`);

    // if it's a new branch, create the branch with the commit

    // if not, patch the tree
    return await command(
      `git/refs/heads/${branch}`,
      {
        sha: commitResult.sha,
        force: false,
      },
      "PATCH"
    );
  };

  const getFileListByPath = async (
    path: string,
    branch?: string,
    headers?: HeadersInit
  ) => {
    const result = await command(
      `contents/${path}${branch ? `?ref=${branch}` : ""}`,
      undefined,
      "GET",
      headers
    );
    log("debug", "getFileDetailsByPath", result);
    if (
      !(
        typeof result === "object" &&
        Array.isArray(result) &&
        result.every(isGithubFileDetails)
      )
    )
      throw new Error(`Could not obtain contents of file ${path}`);
    return result;
  };

  const getFileDetailsByPath = async (
    path: string,
    branch?: string,
    headers?: HeadersInit
  ) => {
    const result = await command(
      `contents/${path}${branch ? `?ref=${branch}` : ""}`,
      undefined,
      "GET",
      headers
    );
    log("debug", "getFileDetailsByPath", result);
    if (!(typeof result === "object" && isGithubFileDetails(result)))
      throw new Error(`Could not obtain contents of file ${path}`);
    return result;
  };

  const formatPath = (newPath: string, fileName: string) => {
    return newPath ? `${newPath}/${fileName}` : fileName;
  };

  const getFileInPreviousPath = async (
    path: string,
    searchFileName: string
  ) => {
    log("debug", "getFileInPreviousPath");
    const fileUrl = path; // using url instead of download_url to avoid CORS issue
    log("debug", "file", fileUrl);
    const foundFileDetails = await findInPreviousPath(fileUrl, async (p) => {
      const searchPath = formatPath(p, searchFileName);
      log("debug", "file url >>", searchPath);
      const response = await getFileDetailsByPath(searchPath).catch((_e) => {
        console.info("file not found", searchPath);
        return undefined;
      });
      return response;
    });
    log("debug", "foundLocation", foundFileDetails);
    return [fileUrl, foundFileDetails] as const;
  };

  const getLastCommitByPath = async (path: string) => {
    const result = await command(`commits?path=${path}`, undefined, "GET");
    log("debug", ">>>", result, isCommitDetailsArray(result));
    if (!isCommitDetailsArray(result))
      throw new Error(`Could not obtain last commits for file ${path}`);
    return result;
  };

  const getBranches = async () => {
    const result = await command(`branches`, undefined, "GET");
    log("debug", ">>>", result, isCommitList(result));
    if (!isCommitList(result))
      throw new Error(`Could not obtain branches for the repository`);
    return result;
  };

  return {
    fetchRawFile,
    createCommit,
    getBaseTree,
    getBranches,
    getFileListByPath,
    getFileDetailsByPath,
    getLastCommitByPath,
    getFileInPreviousPath,
  };
};

export type GithubClient = ReturnType<typeof createGithubRepositoryClient>;

/* Example usage */

// const accessToken = "<token here>";
// const repoFullName = "rangle/nx-next-shadcn-ui-starter";

// const options: GithubOptions = {
//   branch: "main",
//   tokenFilePath: "output/new-tokens.json",
//   credentials: { accessToken, repoFullName },
//   createFile: true,
// };

// const client = createGithubRepositoryClient({ accessToken, repoFullName });

// creates a new commit with a utf-8 content

// client.createCommit("main", "new changes from the test script", [
//   {
//     path: "token/test.json",
//     content: `{ "type": "test", "value": 43 }`,
//     encoding: "utf-8",
//   },
// ]);

// obtains the details of a file from a path
// client
//   .getFileListByPath(getDirectory(options.tokenFilePath))
//   .then((files) => files.map((file) => file.name))
// .then((url) => fetch(url))
// .then(async (response) => {
//   if (!response.ok) {
//     console.error(await response.json());
//     throw new Error(`HTTP returned code ${response.status}`);
//   }
//   return response.text();
// })
// .then((result) => log('debug', "1", result));
// client.getLastCommitByPath("token/test.json");

// client
//   .getFileInPreviousPath(options.tokenFilePath, "package.json")
//   .then(([tokenFile, packagejson]) => {
//     log('debug',
//       packagejson?.url.replace(/^.*\/contents\//, "").replace(/\?[^\/]*$/, "")
//     );
//   });

// client.createCommit(
//   "main",
//   "new changes from the test script",
//   [
//     {
//       path: "token/test.json",
//       content: `{ "type": "test", "value": 100 }`,
//       encoding: "utf-8",
//     },
//   ],
//   "design/new1"
// );
