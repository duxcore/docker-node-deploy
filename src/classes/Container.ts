
import { ContainerCreateOptions, ContainerEnvironmentVariable } from "../types/Container";
import { Environment } from "./Environment";
import compose from 'docker-compose';
import { makeEnvFile } from "../util";

export class Container {

    private _id: string;
    private _environment: Environment;
    private _basePath: string;
    private _path: string;
    private _startTime = 0;
    private _environmentVariables?: ContainerEnvironmentVariable[];

    constructor(options: ContainerCreateOptions) {
        this._id = options.id;
        this._environment = options.environment;
        this._basePath = options.basePath
        this._path = this._environment.path + this._basePath

        if (options.startTime) this._startTime = options.startTime
        if (options.environmentVariables) this._environmentVariables = options.environmentVariables
    }

    get id(): string { return this._id }
    get environment(): Environment { return this._environment }
    get basePath(): string { return this._basePath }
    get path(): string { return this._path }
    get startTime(): number { return this._startTime }
    get environmentVariables(): ContainerEnvironmentVariable[] | undefined { return this._environmentVariables }

    setStartTime(time: number): this {
        this._startTime = time
        return this;
    }

    setEnvironmentVariables(environmentVariables: ContainerEnvironmentVariable[]): this {
        this._environmentVariables = environmentVariables
        return this;
    }

    async stop() {
        await compose.down({ cwd: this.path }).catch((e) => console.error(e))
        this.setStartTime(0)
        return this;
    }

    async start() {
        await compose.upAll({ cwd: this.path }).catch((e) => console.error(e))
        this.setStartTime(Date.now())
        return this;
    }


    async build() {
        if (this.environmentVariables) makeEnvFile(this.path, this.environmentVariables)
        await compose.buildAll({ cwd: this.path }).catch((e) => console.error(e))
        return this;
    }

}
