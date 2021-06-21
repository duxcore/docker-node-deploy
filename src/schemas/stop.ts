export function validateStopSchema(data: any): ValidatedStopSchema | undefined {
    if (!data.envName) return;
    if (typeof data.envName !== "string") return;

    return data as ValidatedStopSchema;
}

interface ValidatedStopSchema {
    envName: string;
}

