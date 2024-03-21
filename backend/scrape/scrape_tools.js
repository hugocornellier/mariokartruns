const fetch = require("cross-fetch");
const parser = require("node-html-parser");
const db = require("../db/db");

const formatDate = date => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const removeYouTubeLinksFromArray = a => a.filter(i => !i.includes("youtube.com/") && !i.includes("youtu.be/"));
const removeDuplicatesFromArray = arr => arr.filter((value, index) => arr.indexOf(value) === index);

async function fetchHTML(url) {
    try {
        const res = await fetch(url);
        if (res.status >= 400)
            throw new Error("Bad response from server");
        const html = await res.text();
        if (html)
            return html;
        throw new Error("Error getting HTML.");
    } catch (error) {
        throw new Error(error.message);
    }
}

async function getRaceRecords(race_url, game, race_id) {
    try {
        const rows = [];
        const html = await fetchHTML(race_url);
        let cup = ""
        const needle = "&cup="
        if (race_url.includes(needle)) {
            cup = race_url.split(needle)[1]
        }
        if (!html) {
            throw new Error("Error getting HTML.");
        }
        const cc = race_url.includes("&m=200") ? "200cc" : "150cc";
        const table = parser.parse(html).querySelectorAll('table')[2];
        let atFirstRow = true;
        for (const r of table.querySelectorAll('tr')) {
            if (!atFirstRow) {
                const row = {};
                row['cup'] = cup
                let cell_count = 0;
                for (const c of r.querySelectorAll('td')) {
                    row['race'] = parser.parse(html).querySelectorAll('h2')[0].textContent;
                    row['race_id'] = race_id;
                    row['cc'] = cc;
                    row['date'] = (cell_count === 0) ? c.textContent.trim() : row['date'];
                    row['player'] = (cell_count === 2) ? c.textContent.trim() : row['player'];
                    row['days'] = (cell_count === 4) ? c.textContent.trim() : row['days'];
                    row['lap1'] = (cell_count === 5) ? c.textContent.trim() : row['lap1'];
                    row['lap2'] = (cell_count === 6) ? c.textContent.trim() : row['lap2'];
                    row['lap3'] = (cell_count === 7) ? c.textContent.trim() : row['lap3'];
                    if (row['race'] === "GCN Baby Park") {
                        console.log("BABY PARK!");
                    }
                    row['coins'] = (cell_count === 8) ? c.textContent.trim() : row['coins'];
                    row['shrooms'] = (cell_count === 9) ? c.textContent.trim() : row['shrooms'];
                    row['character'] = (cell_count === 10) ? c.textContent.trim() : row['character'];
                    row['kart'] = (cell_count === 11) ? c.textContent.trim() : row['kart'];
                    row['tires'] = (cell_count === 12) ? c.textContent.trim() : row['tires'];
                    row['glider'] = (cell_count === 13) ? c.textContent.trim() : row['glider'];
                    if (cell_count === 1) {
                        const el = parser.parse(c.innerHTML);
                        const a_el = el.querySelector('a');
                        const img_el = el.querySelector('img');
                        const rawAttrs = a_el ? a_el.rawAttrs : null;
                        const rawAttrsImg = img_el ? img_el.rawAttrs : null;
                        row['time'] = c.textContent.trim();
                        row['video_url'] = rawAttrs ? rawAttrs.split('"')[1].trim() : 0;
                        row['controller'] = rawAttrsImg ? rawAttrsImg.split('"')[1].trim() : "default";
                    } else if (cell_count === 3) {
                        const el = parser.parse(c.innerHTML);
                        const img_el = el.querySelector('img');
                        const rawAttrsImg = img_el ? img_el.rawAttrs : null;
                        row['nation'] = rawAttrsImg ? rawAttrsImg.split('"')[1].trim() : 0;
                    }
                    cell_count++;
                }
                const d = new Date(row['date']);
                row['date'] = (!isNaN(d.getTime())) ? formatDate(d) : '0: ' + row['date'];
                rows.push(row);
            } else {
                atFirstRow = !atFirstRow;
            }
        }
        return rows.filter(value => Object.keys(value).length !== 0);
    } catch (error) {
        console.error(error);
        throw error;
    }
}

module.exports = {
    getAndInsertRecords: async function getAndInsertRecords(race_url, table, race_id) {
        try {
            console.log("Fetching records at URL: " + race_url);
            const rows = await getRaceRecords(race_url, table, race_id);
            console.log("Race records received! Attempting to insert all rows.");
            console.log(rows);
            const tableExists = await db.checkIfTableExists(table);
            if (!tableExists) {
                await db.createTable(table);
            }
            for (const row of rows) {
                try {
                    await db.insertEntry(row, table);
                } catch (e) {
                    // Handle insertion error if needed
                }
            }
            console.log("Done inserting...");
        } catch (error) {
            throw new Error(error.message);
        }
    },

    scrapeAllRacesByGame: async function scrapeAllRacesByGame(game, deleteTable, startingRaceID) {
        if (deleteTable) {
            await db.deleteTable(game)
        }
        let race_id = game === 'mk8dx' ? 1.01 : 1
        for (var url of await this.getRaceURLs(game)) {
            if (race_id >= startingRaceID) {
                await this.getAndInsertRecords(url, game, Math.floor(race_id))
            }
            race_id = race_id + (game === 'mk8dx' ? 0.5 : 1)
        }
    },

    getRaceURLs: async function getRaceURLs(game) {
        return new Promise(async (resolve, reject) => {
            race_urls = []
            base_url = `https://mkwrs.com/${game}/`
            let cup = null
            const html = await fetchHTML(base_url)
            if (!html)
                reject("Error getting HTML.")
            const tables = parser.parse(html).querySelectorAll('table')
            const table_els = [tables[0], tables[1]]
            for (var table of table_els) {
                let tr_count = 0
                for (var tr of table.querySelectorAll('tr')) {
                    const track_cell = tr.querySelectorAll('td')[0]
                    if (track_cell) {
                        a_el = track_cell.querySelector('center')
                        if (a_el) {
                            let cup_data= a_el.innerHTML.split('src="cups/')[1].trim()
                            cup_data = cup_data.split(".webp")[0].trim()
                            const cup_first_letter_capitalized = cup_data.charAt(0).toUpperCase() + cup_data.slice(1)
                            cup = cup_first_letter_capitalized + ' '
                            console.log(cup)
                        }
                        a_el = track_cell.querySelector('a')
                        if (a_el) {
                            race_urls.push(base_url + a_el.rawAttrs.split('"')[1].trim() + "&cup=" + cup)
                        }
                    }
                }
            }
            if (!Array.isArray(race_urls)) {
                reject("Not array")
            }
            resolve(removeYouTubeLinksFromArray(removeDuplicatesFromArray(race_urls)))
        })
    }
}