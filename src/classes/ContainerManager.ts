import Collection from "@discordjs/collection";
import { Container } from "./Container";
import { ContainerEnvironmentVariable } from "../types/Container";
import { Environment } from "./Environment";

export class ContainerManager {
    private _containers: Collection<string, Container>
    private _runningContainers = 0;

    constructor() {
        this._containers = new Collection<string, Container>()
    }

    get runningContainers(): number { return this._runningContainers }
    get containers(): Container[] { return this._containers.array() }

    getContainer(id: string) {
        return this._containers.get(id)
    }

    async createContainer(
        environment: Environment,
        basePath: string,
        environmentVariables?: ContainerEnvironmentVariable[]
    ) {
        const id = `${environment.name}/${basePath}`;

        if (this.getContainer(id)) {
            const cont = this.getContainer(id)
            if (!cont) return

            await cont.stop()
            this._containers.delete(id);
        }


        const cont = new Container({
            id,
            environment,
            basePath
        })
        if (environmentVariables) cont.setEnvironmentVariables(environmentVariables)
        this._containers.set(id, cont)

        await cont.stop()
        await cont.build()
        return await cont.start()
    }
}