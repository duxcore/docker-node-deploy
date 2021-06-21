import { EnvironmentCreateOptions, EnvironmentRepo } from "../types/Environment";
import { ContainerManager } from "./ContainerManager";
import { gitP } from 'simple-git';
import { SimpleGit } from "simple-git/promise";
import { RawContainerOptions } from "../types/Container";

export class Environment {
    private _name: string;
    private _path: string;
    private _repo: EnvironmentRepo;
    private _containerManager: ContainerManager;
    private _rawContainers: RawContainerOptions[];

    constructor(options: EnvironmentCreateOptions) {
        this._name = options.name
        this._path = options.path
        this._repo = options.repo
        this._containerManager = new ContainerManager();
        this._rawContainers = options.rawContainers;
    }

    get name(): string { return this._name }
    get path(): string { return this._path }
    get repo(): EnvironmentRepo { return this._repo }
    get containerManager(): ContainerManager { return this._containerManager }
    get rawContainers(): RawContainerOptions[] { return this._rawContainers }


    async pull() {
        const repo: SimpleGit = gitP(this.path);
        const isRepo = await repo.checkIsRepo();

        if (!isRepo) {
            await repo.init();
            await repo.addRemote("origin", this.repo.url ?? "");
        }

        await repo.pull("origin", this.repo.branch)
        return this;
    }

    async stopContainers() {
        this._containerManager.containers.forEach(async (container) => {
            await container.stop();
        })
        return this;
    }

    async startContainers() {
        this._containerManager.containers.forEach(async (container) => {
            await container.start();
        })

        return this;
    }

    async deleteContainers() {
        this._containerManager.containers.forEach(async (container) => {
            await container.stop();
            this._containerManager.deleteContainer(container.id);
        })

        return this;
    }

    async buildContainers(containers: RawContainerOptions[]) {
        await this.deleteContainers();

        containers.forEach(async (options) => {
            await this._containerManager.createContainer(this, options.dir, options.envVars)
        })

        return this;
    }

}