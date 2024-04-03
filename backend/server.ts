import { Server } from 'socket.io';
import { createServer } from 'http';
import startServer from './util/serverUtil';
import handleConnection from './util/socketHandler';
import { join } from "path";
import { handleGetRequest } from './util/routeUtil';

const express = require("express");
const app = express();
const server = createServer(app);
const io: Server = new Server(server);
const buildPath: string = join(__dirname, "../frontend/build");

app.use(express.static(buildPath));
app.get("*", handleGetRequest);

io.on('connection', handleConnection);

startServer(server)