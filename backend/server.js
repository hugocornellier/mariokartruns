const http = require("http")
const express = require("express")
const socketIO = require("socket.io")
const app = express()
const path = require('path')
const server = http.createServer(app)
const io = socketIO(server)
const db = require("./db/db")
const scraper = require("./scrape/scrape_tools")

app.use(express.static(path.join(__dirname, "../frontend/build")))
app.get("*", (req, res) => {
    res.send("")
})

io.on("connection", (socket) => {
    console.log("Socket.io connection made successfully.");
    socket.on("get_race_data", async (race, game) => {
        console.log("Getting race data...")
        io.emit("get_race_data_ret", await db.getAllEntriesByRace(race, game));
    })
    socket.on("get_player_data", async (player, game) => {
        io.emit("get_player_data_ret", await db.getAllEntriesByPlayer(decodeURI(player), game), await db.getRecords(game));
    })
    socket.on("get_mk8_records", async () => {
        io.emit("get_mk8_records_ret", await db.getRecords('mk8'));
    })
    socket.on("get_mk8dx_records", async () => {
        io.emit("get_mk8dx_records_ret", await db.getRecords('mk8dx'));
    })
})

let home_path = app.settings['views'].substring(0, 5)
server.listen(
    home_path === "/User" || home_path === "C:\\Us"
        ? 4000
        : 5000,
    async () => {
        return new Promise(async (resolve) => {
            console.log(`Server running!`)
            //await db.deleteTable('mk8dx')
            //const game = 'mk8dx'
            //for (var url of await scraper.getRaceURLs(game)) {
            //    await scraper.getAndInsertRecords(url, game)
            //}
            resolve()
        })
    }
)