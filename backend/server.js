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
    socket.on("get_race_data", async (race, game, cc) => {
        io.emit("get_race_data_ret", await db.getAllEntriesByRace(race, game, cc));
    })
    socket.on("get_player_data", async (player, game) => {
        io.emit("get_player_data_ret", await db.getAllEntriesByPlayer(decodeURI(player), game), await db.getRecords(game));
    })
    socket.on("get_records", async (table, cc) => {
        io.emit("get_records_ret", await db.getRecords(table, cc));
    })
})

let home_path = app.settings['views'].substring(0, 5)
const port = home_path === "/User" || home_path === "C:\\Us"
    ? 4000
    : 5000
server.listen(
    port,
    async () => {
        return new Promise(async (resolve) => {
            console.log(`Server running!`)
            // await db.deleteAllByRaceId(41, 'mk8')
            // await scraper.getAndInsertRecords(
            //    "https://mkwrs.com/mk8/display.php?track=GCN+Baby+Park",
            //    'mk8',
            //    41
            // )
            const game = 'mk8'
            let race_id = game === 'mk8dx' ? 1.01 : 1
            await db.deleteTable(game)
            for (var url of await scraper.getRaceURLs(game)) {
                await scraper.getAndInsertRecords(url, game, Math.floor(race_id))
                race_id = race_id + (game === 'mk8dx' ? 0.5 : 1)
            }
            resolve()
        })
    }
)