import { Request, Response } from 'express';
import { Server, Socket } from 'socket.io';
import { createServer } from 'http';
import serverUtil from './util/serverUtil';
import socketHandler from './util/socketHandler';
import * as path from "path";

const port: number = serverUtil.getPort();
const express = require("express");
const app = express();
const server = createServer(app);
const io: Server = new Server(server);
const buildPath = path.join(__dirname, "../frontend/build");

app.use(express.static(buildPath));
app.get("*", (_req: Request, res: Response) => {
    res.sendFile("index.html", {
        root: buildPath
    });
});

io.on('connection', (socket: Socket) => {
    console.log("Socket.io connection made successfully.");

    socket.on("get_race_data", async (race: string, game: string, cc: string) => {
        await socketHandler.handleGetRaceData(socket, race, game, cc);
    });

    socket.on("get_player_data", async (player: string, game: string) => {
        await socketHandler.handleGetPlayerData(socket, player, game);
    });

    socket.on("get_records", async (table: string, cc: string) => {
        await socketHandler.handleGetRecords(socket, table, cc);
    });

    socket.on("get_latest_records", async () => {
        await socketHandler.handleGetLatestRecords(socket);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(port, async () => {
    console.log(`Server is running on port ${port}! :D `);
});
