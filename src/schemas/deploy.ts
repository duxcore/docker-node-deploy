import { RawContainerOptions } from "../types/Container";

export function validateDeploySchema(data: any): ValidatedDeploySchema | undefined {
    if (!data.url) return;
    if (!data.branch) return;
    if (!data.envName) return;
    if (!data.containers) return;

    if (typeof data.url !== "string") return;
    if (typeof data.branch !== "string") return;
    if (typeof data.envName !== "string") return;

    if (data.containers.map((container: any) => {
        if (!container.dir) return false;
        if (typeof container.dir !== "string") return false;

        if (container.envVars) {
            if (container.envVars.map((envVar: any) => {
                if (!envVar.key) return false;
                if (!envVar.value) return false;

                if (typeof envVar.key !== "string") return false;
                if (typeof envVar.value !== "string") return false;
            }).includes(false)) return false;
        }
    }).includes(false)) return;

    return data as ValidatedDeploySchema;
}

interface ValidatedDeploySchema {
    url: string;
    branch: string;
    envName: string;
    containers: RawContainerOptions[]
}

