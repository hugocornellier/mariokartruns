import express = require('express');
const app = express();
import { Server, Socket } from "socket.io";
import * as http from 'http'
const server = http.createServer();
const io = new Server(server);
const db = require("./db/db");
import { scrapeAllRacesByGame } from "./scrape/scrape_tools_ts";

app.get('*', (req: express.Request, res: express.Response) => {
    res.send('Hello, this is a basic Express server written in TypeScript!');
});

io.on("connection", (socket: Socket) => {
    console.log("Socket.io connection made successfully.");
    socket.on("get_race_data", async (race, game, cc) => {
        io.emit("get_race_data_ret", await db.getAllEntriesByRace(race, game, cc));
    })
    socket.on("get_player_data", async (player, game) => {
        io.emit("get_player_data_ret", await db.getAllEntriesByPlayer(decodeURI(player), game), await db.getRecords(game));
    })
    socket.on("get_records", async (table, cc) => {
        io.emit("get_records_ret", await db.getRecords(table, cc));
    })
    socket.on("get_latest_records", async (table, cc) => {
        io.emit("get_latest_records_ret", await db.getLatestRecords());
    })
});

let home_path = app.settings['views'].substring(0, 5)
const port = home_path === "/User" || home_path === "C:\\Us"
    ? 4000
    : 5000
server.listen(port, async () => {
    console.log(`Server running on port ${port}!`)
    // try {
    //     await scrapeAllRacesByGame('mkwii', false, 1);
    // } catch (error) {
    //     console.error('An error occurred while scraping races:', error);
    // }

});