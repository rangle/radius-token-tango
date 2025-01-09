# GitLab API Integration Plan

## Overview

This document outlines the planned GitLab API integration for Token Tango, mirroring our GitHub functionality. We will use the GitLab REST API v4.

## API Endpoints

All endpoints are prefixed with `https://gitlab.com/api/v4/projects/{projectId}/`

- `GET /repository/files/{path}` - Get repository file contents
- `POST /repository/files/{path}` - Create/update repository file
- `GET /repository/tree` - List repository contents
- `GET /repository/commits` - Get commit history
- `GET /repository/branches` - List repository branches
- `GET /projects` - List user's projects

## Planned Functions

### Repository Client Creation

```typescript
type GitlabCredentials = {
  accessToken: string;
  projectId: string | number; // Can be name/namespace/project or project ID
}

createGitlabRepositoryClient({ accessToken, projectId }: GitlabCredentials)
```

Creates a client instance with authentication for interacting with a specific GitLab project.

### File Operations

#### `fetchRawFile(path: string, ref?: string)`

```typescript
// GET /repository/files/{path}/raw?ref={branch}
// Returns file content directly
```

Fetches raw file content from GitLab, with optional branch/ref specification.

#### `getFileListByPath(path: string, ref?: string)`

```typescript
// GET /repository/tree?path={path}&ref={branch}
// Returns: Array<{
//   id: string;
//   name: string;
//   type: string;
//   path: string;
//   mode: string;
// }>
```

Lists files in a directory path.

#### `getFileDetailsByPath(path: string, ref?: string)`

```typescript
// GET /repository/files/{encoded_path}?ref={branch}
// Returns: {
//   file_name: string;
//   file_path: string;
//   size: number;
//   encoding: string;
//   content: string;
//   content_sha256: string;
//   ref: string;
//   blob_id: string;
//   commit_id: string;
//   last_commit_id: string;
// }
```

Gets detailed information about a specific file.

### Git Operations

#### `createCommit(branch: string, message: string, files: GitlabFile[], newBranch?: string)`

```typescript
type GitlabFile = {
  path: string;
  content: string;
  encoding: "text" | "base64";
};

// For each file:
// POST /repository/files/{encoded_path}
// {
//   branch: string;
//   content: string;
//   commit_message: string;
//   encoding: string;
// }
```

Creates a new commit with the specified files. In GitLab, we commit files individually rather than creating blobs and trees.

#### `createBranch(newBranch: string, ref: string)`

```typescript
// POST /repository/branches
// {
//   branch: string;
//   ref: string;
// }
```

Creates a new branch from an existing ref.

### Repository Information

#### `getBranches()`

```typescript
// GET /repository/branches
// Returns: Array<{
//   name: string;
//   protected: boolean;
//   default: boolean;
//   developers_can_push: boolean;
//   developers_can_merge: boolean;
//   can_push: boolean;
//   web_url: string;
//   commit: {
//     id: string;
//     short_id: string;
//     title: string;
//     message: string;
//     author_name: string;
//     author_email: string;
//     authored_date: string;
//     committed_date: string;
//   }
// }>
```

Lists all branches in the repository.

#### `getLastCommitByPath(path: string, ref?: string)`

```typescript
// GET /repository/commits?path={path}&ref={branch}
// Returns the last commit that modified the path
```

Gets the last commit that modified a specific path.

#### `getProjects()`

```typescript
// GET /projects?membership=true
// Returns list of accessible projects
```

Lists projects accessible to the authenticated user.

## Types

### `GitlabCredentials`

```typescript
{
  accessToken: string;
  projectId: string | number;
}
```

### `GitlabFile`

```typescript
{
  path: string;
  content: string;
  encoding: "text" | "base64";
}
```

### `GitlabFileDetails`

```typescript
{
  file_name: string;
  file_path: string;
  size: number;
  encoding: string;
  content: string;
  content_sha256: string;
  ref: string;
  blob_id: string;
  commit_id: string;
  last_commit_id: string;
}
```

## Headers

All API requests include these default headers:

```typescript
{
  'PRIVATE-TOKEN': accessToken,
  'Content-Type': 'application/json'
}
```

## Key Differences from GitHub Integration

1. **Project Identification**: GitLab uses project IDs or full path with namespace (e.g., `group/subgroup/project`) instead of GitHub's `owner/repo` format.

2. **File Operations**:

   - GitLab requires paths to be URL-encoded in the API endpoints
   - GitLab commits files individually rather than using Git's blob/tree system
   - GitLab provides direct file content endpoints without needing to decode base64

3. **Authentication**:

   - GitLab uses `PRIVATE-TOKEN` header instead of `Bearer` token
   - GitLab tokens can be scoped more granularly at the API level

4. **Rate Limiting**:
   - GitLab's rate limits are typically higher than GitHub's
   - Limits are based on user type (authenticated, admin, etc.)

## Implementation Notes

1. All paths in GitLab API calls must be URL-encoded
2. Error handling should account for GitLab-specific error codes and messages
3. Consider implementing pagination for large repositories
4. Token scope requirements:
   - `read_repository` for read operations
   - `write_repository` for write operations
   - `api` for general API access
