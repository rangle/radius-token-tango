# GitHub API Documentation

## Overview

This document outlines the GitHub API endpoints and functions used in the Token Tango application. We use the GitHub REST API v2022-11-28 for all operations.

## API Endpoints

All endpoints are prefixed with `https://api.github.com/repos/{repoFullName}/`

- `GET /contents/{path}` - Get repository contents
- `POST /git/blobs` - Create a Git blob
- `GET /git/trees/{branch}` - Get a Git tree
- `POST /git/trees` - Create a Git tree
- `POST /git/commits` - Create a Git commit
- `GET /commits` - Get commit history
- `GET /branches` - List repository branches
- `GET /user/repos` - List user repositories

## Functions

### Repository Client Creation

```typescript
createGithubRepositoryClient({ accessToken, repoFullName }: GithubCredentials)
```

Creates a client instance with authentication for interacting with a specific repository.

### File Operations

#### `fetchRawFile(url: string, head?: boolean)`

Fetches raw file content from GitHub, with optional HEAD request.

#### `getFileListByPath(path: string, branch?: string, headers?: HeadersInit)`

Lists files in a directory path.

#### `getFileDetailsByPath(path: string, branch?: string, headers?: HeadersInit)`

Gets detailed information about a specific file.

#### `getFileInPreviousPath(path: string, searchFileName: string)`

Recursively searches for a file in parent directories.

### Git Operations

#### `createFileBlob({ path, content, encoding }: GithubFile)`

Creates a Git blob for file content.

#### `getBaseTree(branchName: string)`

Gets the base tree for a branch.

#### `createGithubRepoTree(branchName: string, files: GithubFile[])`

Creates a new Git tree with modified files.

#### `createCommit(branchName: string, message: string, files: GithubFile[], newBranchName?: string)`

Creates a new commit with the specified files.

### Repository Information

#### `getBranches()`

Lists all branches in the repository.

#### `getLastCommitByPath(path: string)`

Gets the last commit that modified a specific path.

#### `getRepositories()`

Lists repositories accessible to the authenticated user.

## Types

### `GithubCredentials`

```typescript
{
  accessToken: string;
  repoFullName: string;
}
```

### `GithubFile`

```typescript
{
  path: string;
  content: string;
  encoding: string;
}
```

### `GithubFileDetails`

```typescript
{
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
}
```

## Headers

All API requests include these default headers:

```typescript
{
  Accept: "application/vnd.github+json",
  Authorization: `Bearer ${accessToken}`,
  "X-GitHub-Api-Version": "2022-11-28"
}
```
