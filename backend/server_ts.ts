import { Request, Response } from 'express';
import { Server, Socket } from 'socket.io';
import { createServer } from 'http';
import db from './db/db_ts';
import socketHandler from './utils/socketHandler';

const app = require('express')();
const server = createServer(app);
const io: Server = new Server(server);

app.use((_req: Request, res: Response) => {
    res.sendFile("index.html", { root: "../frontend/build" });
});

io.on('connection', (socket: Socket) => {
    console.log("Socket.io connection made successfully.");

    socket.on("get_race_data", async (race: string, game: string, cc: string) => {
        io.emit("get_race_data_ret", await db.getAllEntriesByRace(race, game, cc));
        await socketHandler.handleGetRaceData(socket, race, game, cc);
    });

    socket.on("get_player_data", async (player: string, game: string) => {
        const [playerData, records] = await Promise.all([
            db.getAllEntriesByPlayer(decodeURI(player), game),
            db.getRecords(game, 'all')
        ]);
        io.emit("get_player_data_ret", playerData, records);
        await socketHandler.handleGetPlayerData(socket, player, game);
    });

    socket.on("get_records", async (table: string, cc: string) => {
        io.emit("get_records_ret", await db.getRecords(table, cc));
        await socketHandler.handleGetRecords(socket, table, cc);
    });

    socket.on("get_latest_records", async () => {
        io.emit("get_latest_records_ret", await db.getLatestRecords());
        await socketHandler.handleGetLatestRecords(socket);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const homePath: string = app.settings['views'].substring(0, 5);
const port: number = homePath === "/User" || homePath === "C:\\Us" ? 4000 : 5000;

server.listen(port, async () => {
    console.log(`Server is running on port ${port}`);
    console.log("Hello from TS Express server :)")
});
