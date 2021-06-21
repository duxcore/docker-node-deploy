import Collection from "@discordjs/collection";
import { Environment } from "./Environment";
import fs from 'fs';
import { RawContainerOptions } from "../types/Container";


export class Environmentmanager {
    private _environments: Collection<string, Environment>
    private _environmentsdir = `${__dirname}/../../environments`;

    constructor() {
        this._environments = new Collection<string, Environment>()

        if (!fs.existsSync(this._environmentsdir)) fs.mkdirSync(this._environmentsdir)
    }

    get environmentsdir(): string { return this._environmentsdir }
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
            return await env.buildContainers(containers);
        }

        const path = `${this._environmentsdir}/${envName}`;
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
        return await env.buildContainers(env.rawContainers);
    }
}