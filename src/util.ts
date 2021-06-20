import { ContainerEnvironmentVariable } from "./types/Container";
import fs from 'fs';

export function randomString(length: number) {
    var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var result = '';
    for (let i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
}

export function makeEnvFile(containerPath: string, environmentVariables: ContainerEnvironmentVariable[]) {
    if (!fs.existsSync(containerPath)) return;
    const envPath = `${containerPath}/.env`
    let data = "";
    for (let index = 0; index < environmentVariables.length; index++) {
        const variable = environmentVariables[index];
        data += `${variable.key}=${variable.value}`
    }
    fs.writeFileSync(envPath, data)
    return envPath
}