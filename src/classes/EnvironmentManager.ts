import Collection from "@discordjs/collection";
import { Environment } from "./Environment";
import fs from 'fs';
import { RawContainerOptions } from "../types/Container";


export class Environmentmanager {
    private _environments: Collection<string, Environment>
    private _environmentsBasePath = `${__dirname}/../../environments`;

    constructor() {
        this._environments = new Collection<string, Environment>()

        if (!fs.existsSync(this._environmentsBasePath)) fs.mkdirSync(this._environmentsBasePath)
    }

    get environmentsBasePath(): string { return this._environmentsBasePath }
    get environments(): Environment[] { return this._environments.array() }

    getEnvironment(name: string) {
        return this._environments.get(name)
    }

    async createEnvironment(envName: string, url: string, branch: string, containers: RawContainerOptions[]) {
        if (!url) return;

        if (this.getEnvironment(envName)) {
            const env = this.getEnvironment(envName);
            if (!env) return;

            await env.pull();
            await env.stopContainers()
            await env.buildContainers(containers);
            return await env.startContainers();
        }

        const path = `${this._environmentsBasePath}/${envName}`;
        const env = new Environment({
            name: envName,
            path,
            rawContainers: containers,
            repo: { url, branch }
        })
        this._environments.set(envName, env);

        if (!fs.existsSync(path)) fs.mkdirSync(path);
        await env.pull();
        await env.stopContainers()
        await env.buildContainers(env.rawContainers);
        return await env.startContainers();
    }
}