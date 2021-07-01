import { ContainerEnvironmentVariable, RawContainerOptions } from "./types/Container";
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
        data += `${variable.key}=${variable.value}\n`
    }
    fs.writeFileSync(envPath, data)
    return envPath
}

export function checkContainerChanges(oldContainers: RawContainerOptions[], newContainers: RawContainerOptions[]) {
    if (newContainers.length !== oldContainers.length) return true;

    if (newContainers.map((container) => {
        const index = newContainers.indexOf(container);
        return container.dir == oldContainers[index].dir;
    }).includes(false)) return true;

    return false;
}