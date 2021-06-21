import { config } from 'dotenv';
import http from "http";
import express from 'express';
import { Environmentmanager } from './classes/EnvironmentManager';

config();

const app = express();
const port = process.env.HTTP_PORT || 6969;
const secret = process.env.DEPLOY_SECRET || "SECRET";
const httpServer = http.createServer(app);

const environmentManager = new Environmentmanager();

app.use(express.json())

app.post('/deploy', async (req, res) => {
    if (req.headers.authorization !== secret) res.send({ success: false, error: "Not Authorised" });
    const environment = await environmentManager.createEnvironment(req.body.envName, req.body.url, req.body.branch, req.body.containers)
    if (!environment) {
        res.send({ success: false, error: "Failed to initialize environment" })
    } else {
        console.log(`Initialized environment ${environment.name}`);
        res.send({ success: true, data: { name: environment.name } })
    }
})

app.post('/stop', async (req, res) => {
    if (req.headers.authorization !== secret) res.send({ success: false, error: "Not Authorised" });
    const environment = environmentManager.getEnvironment(req.body.envName)
    if (!environment) {
        console.log(`Unable to locate ${req.body.envName}`);
        res.send({ success: false, error: "Failed to locate environment" })
    } else {
        await environment.stopContainers();
        console.log(`Terminated environment ${environment.name}`);
        res.send({ success: true, data: { name: environment.name } })
    }
})

httpServer.listen(port, () => {
    console.log(`listening on http://localhost:${port}`);
});

