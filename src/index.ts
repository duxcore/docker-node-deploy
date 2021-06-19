
import { config } from 'dotenv';
import http from "http";
import express from 'express';
import { ContainerManager } from './classes/containerManager';

config();

const app = express();
const port = process.env.HTTP_PORT || 6969;
const httpServer = http.createServer(app);

const containerManager = new ContainerManager();

app.use(express.json())

app.post('/deploy', async (req, res) => {
    const container = await containerManager.createContainer(req.body.url, req.body.branch)
    if (!container) res.send({ success: false, data: { error: "Failed to initialize container" } })
    else res.send({ success: true, data: { id: container.id, startTime: container.startTime } })
})

app.get('/container/:ID', async (req, res) => {
    const container = containerManager.getContainer(req.params.ID)
    res.send({ success: true, container })
})

app.post('/container/:ID/stop', async (req, res) => {
    await containerManager.stopContainer(req.params.ID)
    res.send({ success: true })
})


app.post('/container/:ID/start', async (req, res) => {
    await containerManager.startContainer(req.params.ID)
    res.send({ success: true })
})


app.post('/container/:ID/build', async (req, res) => {
    await containerManager.buildContainer(req.params.ID)
    res.send({ success: true })
})

app.post('/container/:ID/pull', async (req, res) => {
    await containerManager.pullContainer(req.params.ID)
    res.send({ success: true })
})

app.post('/container/:ID/delete', async (req, res) => {
    await containerManager.deleteContainer(req.params.ID)
    res.send({ success: true })
})


httpServer.listen(port, () => {
    console.log(`listening on http://localhost:${port}`);
});

