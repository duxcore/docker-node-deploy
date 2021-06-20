
import { ContainerCreateOptions, ContainerEnvironmentVariable, ContainerRepo } from "../types/Container";

export class Container {

    private _id: string;
    private _repo: { url: string, branch: string }
    private _path: string;
    private _startTime = 0;
    private _environmentVariables?: ContainerEnvironmentVariable[];

    constructor(options: ContainerCreateOptions) {
        this._id = options.id;
        this._repo = options.repo
        this._path = options.path;
        if (options.startTime) this._startTime = options.startTime
        if (options.environmentVariables) this._environmentVariables = options.environmentVariables
    }

    get id(): string { return this._id }
    get repo(): ContainerRepo { return this._repo }
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

}

// { id: string, url: string, branch: string, path: string, startTime: number }