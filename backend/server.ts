import { Request, Response } from 'express';
import { Server, Socket } from 'socket.io';
import { createServer } from 'http';
import serverUtil from './util/serverUtil';
import handleConnection from './util/socketHandler';
import * as path from "path";

const port: number = serverUtil.getPort();
const express = require("express");
const app = express();
const server = createServer(app);
const io: Server = new Server(server);
const buildPath: string = path.join(__dirname, "../frontend/build");

app.use(express.static(buildPath));
app.get("*", (_req: Request, res: Response) => {
    res.sendFile("index.html", {
        root: buildPath
    });
});

io.on('connection', handleConnection);

server.listen(port, async () => {
    console.log(`Server is running on port ${port}! :)) `);
});
