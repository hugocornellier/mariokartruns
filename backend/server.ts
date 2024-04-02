import express = require("express");
const db = require("./db/db");
const scraper = require("./scrape/scrape_tools");
const app = express();

app.get('*', (req: express.Request, res: express.Response) => {
    res.sendFile("index.html", {root: "frontend/build"});
});

let home_path = app.settings['views'].substring(0, 5)
const port = home_path === "/User" || home_path === "C:\\Us"
    ? 4000
    : 5000
app.listen(port, async () => {
    console.log(`Server running!`)
    // await scraper.scrapeAllRacesByGame(
    //     'mk8dx',
    //     false,
    //     1
    // )
});
