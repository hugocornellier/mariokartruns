import express = require("express");
import { createServer } from "http";
import { Server, Socket } from "socket.io";
const app = express();
const db = require("./db/db")
const scraper = require("./scrape/scrape_tools")
const httpServer = createServer();
const io = new Server(httpServer);

app.use(express.static("frontend/build"));
app.get('/', (req: express.Request, res: express.Response) => {
    res.sendFile("index.html", {root: "frontend/build"});
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
httpServer.listen(port, async () => {
    console.log(`Server running => port ${port}! `)
    // await scraper.scrapeAllRacesByGame(
    //     'mk8dx',
    //     false,
    //     1
    // )
});
