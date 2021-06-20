
import { ContainerCreateOptions, ContainerEnvironmentVariable, ContainerRepo } from "../types/Container";

export class Container {

    private _id: string;
    private _repo: { url: string, branch: string }
    private _repoPath: string;
    private _containerPath: string;
    private _startTime = 0;
    private _environmentVariables?: ContainerEnvironmentVariable[];

    constructor(options: ContainerCreateOptions) {
        this._id = options.id;
        this._repo = options.repo
        this._repoPath = options.repoPath;
        this._containerPath = options.containerPath;

        if (options.startTime) this._startTime = options.startTime
        if (options.environmentVariables) this._environmentVariables = options.environmentVariables
    }

    get id(): string { return this._id }
    get repo(): ContainerRepo { return this._repo }
    get repoPath(): string { return this._repoPath }
    get containerPath(): string { return this._containerPath }
    get path(): string { return this._repoPath + this._containerPath }
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