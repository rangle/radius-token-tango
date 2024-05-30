import URL from "url-parse";
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

// this recursive function should receive a path, that is either a path or a url, and run the visitor function for each path segment until it's true or until the execution reaches either the host or the root
export const findInPreviousPath = async (
  pathOrUrl: string,
  visit: (f: string) => Promise<boolean>
): Promise<string | undefined> => {
  // if it's a url, extricate the path part and pass only the path to the visitor
  const isUrl = pathOrUrl.startsWith("http");
  const path = isUrl ? new URL(pathOrUrl).pathname : pathOrUrl;
  const pathSegments = path.split("/").filter(Boolean);

  if (pathSegments.length === 0) {
    return undefined;
  }

  const newPath = pathSegments.join("/");
  const visitResult = await visit(newPath);

  if (visitResult || newPath === "") {
    return newPath;
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
};

export type PackageJSON = {
  name?: string;
  version?: string;
  [key: string]: unknown;
};

export const isPackageJSON = (u: unknown): u is PackageJSON =>
  u !== null && typeof u === "object" && ("name" in u || "version" in u);

export const createGithubRepositoryClient = ({
  accessToken,
  repoFullName,
}: GithubCredentials) => {
  const command = async <T extends object>(
    partialUrl: string,
    body?: T,
    method = "POST"
  ) => {
    console.log(
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
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
      }
    ).catch((e) => {
      console.log(">>>", e);
      console.error("ERROR WHILE FETCHING", e);
      return e;
    });
    console.log("<<<<<<<<<< After fetch", response.status);
    if (!response.ok) {
      console.error(await response.json());
      throw new Error(`HTTP returned code ${response.status}`);
    }
    const res = await response.json();
    console.log(">>> RES", res);
    return res;
  };

  const fetchRawFile = async (url: string, head = false) => {
    console.log(">>>>> before raw fetch", url);
    const response = await fetch(url, {
      method: head ? "HEAD" : "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });
    console.log(">>>>> after raw fetch", response.status);
    // console.log(JSON.stringify(await response.json()));
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
    console.log(">>>>>>>", result);
    return result;
  };

  const getShaForBaseTree = async (branchName: string) => {
    const result = await getBaseTree(branchName);
    return result.sha;
  };

  const getParentSha = async (branchName: string) => {
    console.log("getParentSha", branchName);
    const result = await command(
      `git/refs/heads/${branchName}`,
      undefined,
      "GET"
    )
      .then((res) => {
        console.log("getParentSha yeah!");
        return res;
      })
      .catch((e) => {
        console.log("getParentSha ERROR!", e);
        throw new Error(e);
      });
    console.log(">> getParentSha fetched!");

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
    console.log("Create Commit from", branchName);
    const parentSha = await getParentSha(branchName);
    let branch = branchName;
    if (newBranchName) {
      const payload = {
        ref: `refs/heads/${newBranchName}`,
        sha: parentSha,
      };
      branch = newBranchName;
      console.log("Create Commit on", branch);
      await command("git/refs", payload, "POST");
      console.log("Branch", branch, "created");
    }
    console.log("creating tree");
    const tree = await createGithubRepoTree(branch, files);
    console.log("tree created");

    const payload = {
      message,
      tree,
      parents: [parentSha],
    };

    console.log("pushing commit");
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

  const getFileDetailsByPath = async (path: string) => {
    const result = await command(`contents/${path}`, undefined, "GET");
    console.log("getFileDetailsByPath", result);
    if (!(typeof result === "object" && isGithubFileDetails(result)))
      throw new Error(`Could not obtain contents of file ${path}`);
    return result;
  };

  const formatUrl = (
    originalUrl: string,
    newPath: string,
    fileName: string
  ) => {
    const url = new URL(originalUrl);
    const protocol = url.protocol;
    const newPathWithFileName = newPath ? `${newPath}/${fileName}` : fileName;
    return `${protocol}//${url.host}/${newPathWithFileName}${url.query}`;
  };

  const getFileInPreviousPath = async (
    path: string,
    searchFileName: string
  ) => {
    console.log("getFileInPreviousPath");
    // obtain the original file or directory
    const file = await getFileDetailsByPath(path);
    if (!file)
      throw new Error(`File or Directory ${file} not found in repository`);
    const fileUrl = file.url; // using url instead of download_url to avoid CORS issue
    console.log("file", file);
    const foundLocation = await findInPreviousPath(fileUrl, async (p) => {
      const searchPath = formatUrl(fileUrl, p, searchFileName);
      console.log("file url >>", searchPath);
      const response = await fetchRawFile(searchPath, true);
      return response.ok;
    });
    return [
      file,
      foundLocation && formatUrl(fileUrl, foundLocation, searchFileName),
      foundLocation,
    ] as const;
  };

  const getLastCommitByPath = async (path: string) => {
    const result = await command(`commits?path=${path}`, undefined, "GET");
    console.log(">>>", result, isCommitDetailsArray(result));
    if (!isCommitDetailsArray(result))
      throw new Error(`Could not obtain last commits for file ${path}`);
    return result;
  };

  return {
    fetchRawFile,
    createCommit,
    getBaseTree,
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
//   tokenFilePath: "output/tokens.json",
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
//   .getFileByPath("token/test.json")
//   .then(({ download_url }) => download_url)
//   .then((url) => fetch(url))
//   .then(async (response) => {
//     if (!response.ok) {
//       console.error(await response.json());
//       throw new Error(`HTTP returned code ${response.status}`);
//     }
//     return response.text();
//   })
//   .then((result) => console.log("1", result));
// client.getLastCommitByPath("token/test.json");

// client
//   .getFileInPreviousPath(options.tokenFilePath, "package.json")
//   .then(([tokenFile, packagejson]) => {
//     console.log(tokenFile, packagejson);
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
