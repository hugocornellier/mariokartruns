import { Request, Response } from 'express';
import { Server, Socket } from 'socket.io';
import { createServer } from 'http';
import scraper from './data/scrape/scrape_tools';
import socketHandler from './data/utils/socketHandler';
import serverUtils from './data/utils/serverUtils';

const port: number = serverUtils.getPort();
const app = require('express')();
const server = createServer(app);
const io: Server = new Server(server);

// Middleware to serve index.html
app.use((_req: Request, res: Response) => {
    res.sendFile("index.html", { root: "../frontend/build" }, (err) => {
        if (err) {
            console.log(err);
        }
    });
});

// Socket.io connection handler
const handleSocketConnection = (socket: Socket) => {
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
};

io.on('connection', handleSocketConnection);

server.listen(port, async () => {
    console.log(`Server is running on port ${port}`);
    // await scraper.scrapeAllRacesByGame(
    //     'mk8',
    //     false,
    //     1
    // )
});
