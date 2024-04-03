import { Server } from 'socket.io';
import { createServer } from 'http';
import serverUtil from './util/serverUtil';
import handleConnection from './util/socketHandler';
import * as path from "path";
import { handleGetRequest } from './util/routeUtil';

const port: number = serverUtil.getPort();
const express = require("express");
const app = express();
const server = createServer(app);
const io: Server = new Server(server);
const buildPath: string = path.join(__dirname, "../frontend/build");

app.use(express.static(buildPath));
app.get("*", handleGetRequest);

io.on('connection', handleConnection);

serverUtil.startServer(server, port)