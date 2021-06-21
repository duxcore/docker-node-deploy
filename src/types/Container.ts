import { Environment } from "../classes/Environment";

export interface ContainerCreateOptions {
    id: string;
    environment: Environment;
    basePath: string;
    startTime?: number;
    environmentVariables?: ContainerEnvironmentVariable[]
}

export interface RawContainerOptions {
    basePath: string;
    envVars: ContainerEnvironmentVariable[]
}

export interface ContainerRepo {
    url: string;
    branch: string
}

export interface ContainerEnvironmentVariable {
    key: string;
    value: string;
}