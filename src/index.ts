import { config } from 'dotenv';
import http from "http";
import express from 'express';
import { ContainerManager } from './classes/ContainerManager';

config();

const app = express();
const port = process.env.HTTP_PORT || 6969;
const secret = process.env.DEPLOY_SECRET || "SECRET";
const httpServer = http.createServer(app);

const containerManager = new ContainerManager();

app.use(express.json())

app.post('/deploy', async (req, res) => {
    if (req.headers.authorization !== secret) res.send("Not Authorised");
    const container = await containerManager.createContainer(req.body.url, req.body.branch, req.body.envName, req.body.basePath, req.body.envVars)
    if (!container) res.send({ success: false, data: { error: "Failed to initialize container" } })
    else res.send({ success: true, data: { id: container.id, startTime: container.startTime } })
})

httpServer.listen(port, () => {
    console.log(`listening on http://localhost:${port}`);
});

