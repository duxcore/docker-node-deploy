import { config } from 'dotenv';
import http from "http";
import express from 'express';
import { Environmentmanager } from './classes/EnvironmentManager';
import { validateDeploySchema } from './schemas/deploy';
import { validateStopSchema } from './schemas/stop';

config();

const app = express();
const port = process.env.HTTP_PORT || 6969;
const secret = process.env.DEPLOY_SECRET || "SECRET";
const httpServer = http.createServer(app);

const environmentManager = new Environmentmanager();

app.use(express.json())

app.post('/deploy', async (req, res) => {
    if (req.headers.authorization !== secret) res.send({ success: false, error: "Not Authorised" });
    const data = validateDeploySchema(req.body);
    if (!data) {
        return res.send({ success: false, error: "Invalid deploy schema" });
    } else {
        const environment = await environmentManager.createEnvironment(data.envName, data.url, data.branch, data.containers)
        if (!environment) {
            return res.send({ success: false, error: "Failed to initialize environment" })
        } else {
            console.log(`Initialized environment ${environment.name}`);
            return res.send({ success: true, data: { name: environment.name } })
        }
    }
})

app.post('/terminate', async (req, res) => {
    if (req.headers.authorization !== secret) res.send({ success: false, error: "Not Authorised" });
    const data = validateStopSchema(req.body);
    if (!data) {
        return res.send({ success: false, error: "Invalid stop schema" });
    } else {
        const environment = environmentManager.getEnvironment(data.envName)
        if (!environment) {
            console.log(`Unable to locate ${data.envName}`);
            return res.send({ success: false, error: "Failed to locate environment" })
        } else {
            await environment.stopContainers();
            console.log(`Terminating environment ${environment.name}`);
            return res.send({ success: true, data: { name: environment.name } })
        }
    }
})

httpServer.listen(port, () => {
    console.log(`listening on http://localhost:${port}`);
});

