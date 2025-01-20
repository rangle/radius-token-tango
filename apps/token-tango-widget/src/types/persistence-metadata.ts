export type RepositoryMetadata = {
  version?: string;
  lastCommit?: {
    message: string;
    author: {
      name: string;
      avatar_url?: string;
      date: string;
    };
  };
};

export type RestServerMetadata = {
  version?: string;
  lastSync?: string;
};

export type FileDownloadMetadata = {
  lastModified?: string;
};

export type PersistenceMetadata = {
  repository: RepositoryMetadata;
  "rest-server": RestServerMetadata;
  "file-download": FileDownloadMetadata;
};
