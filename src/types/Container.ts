export interface ContainerCreateOptions {
    id: string;
    repo: ContainerRepo;
    repoPath: string;
    containerPath: string;
    startTime?: number;
    environmentVariables?: ContainerEnvironmentVariable[]
}

export interface ContainerRepo {
    url: string;
    branch: string
}

export interface ContainerEnvironmentVariable {
    key: string;
    value: string;
}