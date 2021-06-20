
import { ContainerOptions, ContainerRepo } from "../types/Container";

export class Container {

    private _id: string;
    private _repo: { url: string, branch: string }
    private _path: string;
    private _startTime = 0;

    constructor(options: ContainerOptions) {
        this._id = options.id;
        this._repo = options.repo
        this._path = options.path;
        if (options.startTime) this._startTime = options.startTime
    }

    get id(): string { return this._id }
    get repo(): ContainerRepo { return this._repo }
    get path(): string { return this._path }
    get startTime(): number { return this._startTime }

    setStartTime(time: number): this {
        this._startTime = time
        return this;
    }

}

// { id: string, url: string, branch: string, path: string, startTime: number }