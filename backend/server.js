const http = require("http")
const express = require("express")
const socketIO = require("socket.io")
const fetch = require('cross-fetch')
const app = express()
const path = require('path')
const server = http.createServer(app)
const io = socketIO(server)
const db = require("./db/db")
const scraper = require("./scrape/scrape_tools")
const users = [{}];

app.use(express.static(path.join(__dirname, "../frontend/build")))
app.get("*", (req, res) => {
    res.send("")
})

io.on("connection", (socket) => {
    console.log("Connected to socket.io");
    socket.on("setup", ({ user }) => {
        users[socket.id] = user;
        console.log(`${user} has joined `);
        socket.broadcast.emit("userJoined", {
            user: "Admin",
            message: ` ${users[socket.id]} has joined`,
        })
        socket.emit("welcome", {
            user: "Admin",
            message: `Welcome to the convos, ${users[socket.id]} `,
        })
    })
    socket.on("message", ({ message, id }) => {
        io.emit("sendMessage", { user: users[id], message, id });
    })
    socket.on("disconnect", () => {
        socket.broadcast.emit("leave", {
            user: "Admin",
            message: `${users[socket.id]}  has left`,
        });
        console.log(`user left`);
    })
    socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(socket.id);
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
            console.log(await db.getAllEntries())
            //for (var ru of await scraper.getRaceURLs()) {
            //    await scraper.getAndInsertRecordsMK8(ru)
            //}
            resolve()
        })
    }
)