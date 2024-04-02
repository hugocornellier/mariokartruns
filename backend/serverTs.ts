import express = require("express");
const db = require("./db/db");
const scraper = require("./scrape/scrape_tools");

const app = express();
const port = 3000;

app.get('/', (req: express.Request, res: express.Response) => {
    res.send('Hello, this is a basic Express server written in TypeScript!');
});

app.listen(port, async () => {
    console.log(`Server running!`)
    await scraper.scrapeAllRacesByGame(
        'mk8dx',
        false,
        1
    )
});
