import { Environment } from "../classes/Environment";

export interface ContainerCreateOptions {
    id: string;
    environment: Environment;
    dir: string;
    startTime?: number;
    environmentVariables?: ContainerEnvironmentVariable[]
}

export interface RawContainerOptions {
    dir: string;
    envVars: ContainerEnvironmentVariable[]
}

export interface ContainerEnvironmentVariable {
    key: string;
    value: string;
}