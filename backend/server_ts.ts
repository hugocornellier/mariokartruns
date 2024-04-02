import express = require('express');
import { Server, Socket } from 'socket.io';
import * as http from 'http';
import db = require('./db/db');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use((req, res) => {
    res.sendFile("index.html", {root: "./frontend/build"});
});

io.on('connection', (socket: Socket) => {
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
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

let home_path = app.settings['views'].substring(0, 5)
const port: number = home_path === "/User" || home_path === "C:\\Us"
    ? 4000
    : 5000

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
