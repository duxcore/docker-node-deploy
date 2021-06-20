import Collection from "@discordjs/collection";
import { gitP } from 'simple-git';
import { SimpleGit } from "simple-git/promise";
import { makeEnvFile, randomString } from "../util";
import fs from 'fs';
import compose from 'docker-compose';
import { Container } from "./Container";
import { ContainerEnvironmentVariable } from "../types/Container";

export class ContainerManager {
    private _containers: Collection<string, Container>
    private _containersBasePath = `${__dirname}/../../containers`;
    private _containerIdLength = 12;
    private _runningContainers = 0;

    constructor() {
        this._containers = new Collection<string, Container>()

        if (!fs.existsSync(this._containersBasePath)) fs.mkdirSync(this._containersBasePath)
    }

    get containersBasePath(): string { return this._containersBasePath }
    get containerIdLength(): number { return this._containerIdLength }
    get runningContainers(): number { return this._runningContainers }

    setContainersBasePath(path: string): this {
        this._containersBasePath = path;
        return this
    }

    setContainerIdLength(length: number): this {
        this._containerIdLength = length;
        return this
    }

    getContainer(id: string) {
        return this._containers.get(id)
    }

    async createContainer(

        url: string,
        branch: string,
        environmentName: string,
        basePath: string,
        environmentVariables?: ContainerEnvironmentVariable[]) {

        if (!url) return

        const id = environmentName;

        if (this.getContainer(id)) {
            await this.stopContainer(id);
            await this.pullContainer(id);
            await this.buildContainer(id);
            return await this.startContainer(id);
        }

        const repoPath = `${this._containersBasePath}/${id}`

        const cont = new Container({
            id,
            repoPath,
            containerPath: basePath !== "/" ? basePath : "",
            repo: { url, branch }
        })
        if (environmentVariables) cont.setEnvironmentVariables(environmentVariables)
        this._containers.set(id, cont)

        if (!fs.existsSync(repoPath)) fs.mkdirSync(repoPath)

        await this.pullContainer(id);
        await this.stopContainer(id);
        await this.buildContainer(id);
        return await this.startContainer(id);
    }

    async pullContainer(id: string) {
        const container = this.getContainer(id)
        if (!container) return;

        const repo: SimpleGit = gitP(container.repoPath);
        const isRepo = await repo.checkIsRepo();

        if (!isRepo) {
            await repo.init();
            await repo.addRemote("origin", container.repo.url ?? "");
        }

        await repo.pull("origin", container.repo.branch)
        return container;
    }

    async buildContainer(id: string) {
        const container = this.getContainer(id)
        if (!container) return;

        if (container.environmentVariables) makeEnvFile(container.path, container.environmentVariables)

        await compose.buildAll({ cwd: container.path }).catch((e) => console.error(e))

        return container;
    }

    async stopContainer(id: string) {
        const container = this.getContainer(id)
        if (!container) return;

        await compose.down({ cwd: container.path }).catch((e) => console.error(e))

        container.setStartTime(0)
        this._containers.set(id, container);
        this._runningContainers = this._runningContainers - 1;

        return container;
    }

    async startContainer(id: string) {
        const container = this.getContainer(id)
        if (!container) return;

        await compose.upAll({ cwd: container.path }).catch((e) => console.error(e))

        container.setStartTime(Date.now())
        this._containers.set(id, container);
        this._runningContainers = this._runningContainers + 1;

        return container;
    }

    async deleteContainer(id: string) {
        const container = this.getContainer(id)
        if (!container) return;

        await this.stopContainer(id);
        fs.unlinkSync(container.path);

        return this._containers.delete(id);
    }
}