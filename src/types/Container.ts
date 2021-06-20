export interface ContainerOptions {
    id: string;
    repo: ContainerRepo;
    path: string;
    startTime?: number;
}

export interface ContainerRepo {
    url: string;
    branch: string
}