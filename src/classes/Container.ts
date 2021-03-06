
import { ContainerCreateOptions, ContainerEnvironmentVariable } from "../types/Container";
import { Environment } from "./Environment";
import compose from 'docker-compose';
import { makeEnvFile } from "../util";

export class Container {

    private _id: string;
    private _environment: Environment;
    private _dir: string;
    private _path: string;
    private _startTime = 0;
    private _environmentVariables?: ContainerEnvironmentVariable[];

    constructor(options: ContainerCreateOptions) {
        this._id = options.id;
        this._environment = options.environment;
        this._dir = options.dir
        this._path = this._environment.path + this._dir

        if (options.startTime) this._startTime = options.startTime
        if (options.environmentVariables) this._environmentVariables = options.environmentVariables
    }

    get id(): string { return this._id }
    get environment(): Environment { return this._environment }
    get dir(): string { return this._dir }
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
        await compose.stop({ cwd: this.path }).catch((e) => console.error(e))
        await compose.rm({ cwd: this.path }).catch((e) => console.error(e))
        this.setStartTime(0);

        console.log(`Stopped container ${this.id} - ${Date.now()}`)
        return this;
    }

    async start() {
        await compose.upAll({ cwd: this.path }).catch((e) => console.error(e))
        this.setStartTime(Date.now())

        console.log(`Started container ${this.id} - ${Date.now()}`)
        return this;
    }

    async build() {
        if (this.environmentVariables) makeEnvFile(this.path, this.environmentVariables)
        await compose.buildAll({ cwd: this.path }).catch((e) => console.error(e))

        console.log(`Built container ${this.id} - ${Date.now()}`)
        return this;
    }

}
