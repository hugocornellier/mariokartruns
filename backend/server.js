const http = require("http")
const express = require("express")
const socketIO = require("socket.io")
const app = express()
const path = require('path')
const server = http.createServer(app)
const io = socketIO(server)
const db = require("./db/db")

app.use(express.static(path.join(__dirname, "../frontend/build")))
app.get("*", (req, res) => {
    res.send("")
})

io.on("connection", (socket) => {
    console.log("Connected to socket.io");
    socket.on("setup", async () => {
        io.emit("sendMessage", await db.getDistinctRaceNamesMK8());
    })
    socket.on("get_race_data", async (race) => {
        io.emit("get_race_data_ret", await db.getAllEntriesByRace(race));
    })
    socket.on("get_player_data", async (player) => {
        io.emit("get_player_data_ret", await db.getAllEntriesByPlayer(player));
    })
})

let home_path = app.settings['views'].substring(0, 5)
server.listen(
    home_path === "/User" || home_path === "C:\\Us"
        ? 4000
        : 5000,
    async () => {
        return new Promise(async (resolve, reject) => {
            console.log(`Server running!`)
            //for (var ru of await scraper.getRaceURLs()) {
            //    await scraper.getAndInsertRecordsMK8(ru)
            //}
            resolve()
        })
    }
)