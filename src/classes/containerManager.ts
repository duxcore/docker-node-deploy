import Collection from "@discordjs/collection";
import { gitP } from 'simple-git';
import { SimpleGit } from "simple-git/promise";
import { randomString } from "../util";
import fs from 'fs';
import compose from 'docker-compose';

export class ContainerManager {
    private _containers: Collection<string, { id: string, url: string, branch: string, path: string, startTime: number }>
    private _containersBasePath: string;
    private _containerIdLength = 12;

    constructor() {
        this._containersBasePath = `${__dirname}/../../containers`
        this._containers = new Collection<string, { id: string, url: string, branch: string, path: string, startTime: number }>()

        if (!fs.existsSync(this._containersBasePath)) fs.mkdirSync(this._containersBasePath)
    }

    getContainer(id: string) {
        return this._containers.get(id)
    }

    async createContainer(url: string, branch: string) {
        if (!url) return

        const id = randomString(this._containerIdLength)
        const path = `${this._containersBasePath}/${id}`

        this._containers.set(id, { id, url, branch, path, startTime: 0 })

        if (!fs.existsSync(path)) fs.mkdirSync(path)

        await this.pullContainer(id);
        await this.stopContainer(id);
        await this.buildContainer(id);
        return await this.startContainer(id);
    }

    async pullContainer(id: string) {
        const container = this.getContainer(id)
        if (!container) return;

        const repo: SimpleGit = gitP(container.path);
        const isRepo = await repo.checkIsRepo();

        if (!isRepo) {
            await repo.init();
            await repo.addRemote("origin", container.url ?? "");
        }

        await repo.pull("origin", container.branch)
        return container;
    }

    async buildContainer(id: string) {
        const container = this.getContainer(id)
        if (!container) return;
        await compose.buildAll({ cwd: container.path }).catch((e) => console.error(e))
        return container;
    }

    async stopContainer(id: string) {
        const container = this.getContainer(id)
        if (!container) return;
        await compose.down({ cwd: container.path }).catch((e) => console.error(e))
        container.startTime = 0;
        this._containers.set(id, container);
        return container;
    }

    async startContainer(id: string) {
        const container = this.getContainer(id)
        if (!container) return;
        await compose.upAll({ cwd: container.path }).catch((e) => console.error(e))
        container.startTime = Date.now()
        this._containers.set(id, container);
        return container;
    }
}