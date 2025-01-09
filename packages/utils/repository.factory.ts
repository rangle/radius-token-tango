import {
  RepositoryService,
  RepositoryServiceFactory,
} from "./repository.interface";
import { GitHubService } from "./github.service";

/**
 * Factory function to create the appropriate repository service based on the tool.
 * Currently only supports GitHub, but is designed to be extended with GitLab support.
 */
export const createRepositoryService: RepositoryServiceFactory = (
  tool: "GitHub" | "GitLab"
): RepositoryService => {
  switch (tool) {
    case "GitHub":
      return new GitHubService();
    case "GitLab":
      throw new Error("GitLab support is not yet implemented");
    default:
      throw new Error(`Unsupported repository tool: ${tool}`);
  }
};
