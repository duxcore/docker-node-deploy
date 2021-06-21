import { RawContainerOptions } from "./Container";

export interface EnvironmentCreateOptions {
    name: string;
    path: string;
    repo: EnvironmentRepo;
    rawContainers: RawContainerOptions[];
}


export interface EnvironmentRepo {
    url: string;
    branch: string
}