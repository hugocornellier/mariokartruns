const fetch = require("cross-fetch");
const parser = require("node-html-parser");
const db = require("../db/db");

const formatDate = date => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const removeYouTubeLinksFromArray = a => a.filter(i => !i.includes("youtube.com/") && !i.includes("youtu.be/"));
const removeDuplicatesFromArray = arr => arr.filter((value, index) => arr.indexOf(value) === index);
const isNumber = value => typeof value === 'number' && isFinite(value);

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

const getRaceRecords = async (race_url, game, race_id) => {
    const getCellContent = (cell_count, matchingCell, cell, rowVal) => {
        return (cell_count === matchingCell) ? cell.textContent.trim() : rowVal;
    };

    try {
        const html = await fetchHTML(race_url);
        if (!html) {
            throw new Error("Error getting HTML.");
        }

        const htmlEl = parser.parse(html);
        const race = htmlEl.querySelectorAll('h2')[0].textContent;
        const cup = race_url.includes("&cup=") ? race_url.split("&cup=")[1] : null;
        const cc = race_url.includes("&m=200") ? "200cc" : "150cc";
        const table = htmlEl.querySelectorAll('table')[2];
        const tableRows = table.querySelectorAll('tr');

        const rows = tableRows.slice(1).map(tableRow => {
            let row = { race, race_id, cup, cc };
            let cellCount = 0;
            for (const cell of tableRow.querySelectorAll('td')) {
                row['date'] = getCellContent(cellCount, 0, cell, row.date);
                row['player'] = getCellContent(cellCount, 2, cell, row.player);
                row['days'] = getCellContent(cellCount, 4, cell, row.days);
                row['lap1'] = getCellContent(cellCount, 5, cell, row.lap1);
                row['lap2'] = getCellContent(cellCount, 6, cell, row.lap2);
                row['lap3'] = getCellContent(cellCount, 7, cell, row.lap3);
                row['coins'] = getCellContent(cellCount, 8, cell, row.coins);
                row['shrooms'] = getCellContent(cellCount, 9, cell, row.shrooms);
                row['character'] = getCellContent(cellCount, 10, cell, row.character);
                row['kart'] = getCellContent(cellCount, 11, cell, row.kart);
                row['tires'] = getCellContent(cellCount, 12, cell, row.tires);
                row['glider'] = getCellContent(cellCount, 13, cell, row.glider);

                if (cellCount === 1) {
                    const el = parser.parse(cell.innerHTML);
                    const a_el = el.querySelector('a');
                    const img_el = el.querySelector('img');
                    const rawAttrs = a_el ? a_el.rawAttrs : null;
                    const rawAttrsImg = img_el ? img_el.rawAttrs : null;
                    row['time'] = cell.textContent.trim();
                    row['video_url'] = rawAttrs ? rawAttrs.split('"')[1].trim() : 0;
                    row['controller'] = rawAttrsImg ? rawAttrsImg.split('"')[1].trim() : "default";
                } else if (cellCount === 3) {
                    const el = parser.parse(cell.innerHTML);
                    const img_el = el.querySelector('img');
                    const rawAttrsImg = img_el ? img_el.rawAttrs : null;
                    row['nation'] = rawAttrsImg ? rawAttrsImg.split('"')[1].trim() : 0;
                }
                cellCount++;
            }
            const dateIsNan = isNaN(new Date(row['date']).getTime());
            row['date'] = (!dateIsNan) ? row['date'] : '0: ' + row['date'];
            return row;
        });

        return rows.filter(value => Object.keys(value).length !== 0);
    } catch (error) {
        console.error(error);
        throw error;
    }
};

module.exports = {
    getAndInsertRecords: async function getAndInsertRecords(race_url, table, race_id) {
        try {
            console.log("Fetching records at URL: " + race_url);
            if (race_id === null) {
                let raceName = race_url.split("?track=")[1].split("+").join(' ')
                if (raceName.endsWith('&m=200')) {
                    raceName = raceName.slice(0, -6)
                }
                raceName = decodeURI(raceName.trim())
                const raceID = await db.getRaceIdByRaceName(table, raceName)
                if (isNumber(raceID)) {
                    race_id = raceID;
                    console.log(`Found race ID: ${race_id}`)
                } else {
                    return;
                }
            }
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
                    console.log("Error: " + e.message);
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

    scrapeHomePage: async function scrapeHomePage() {
        return new Promise(async (resolve, reject) => {
            const html = parser.parse(await fetchHTML('https://mkwrs.com/'))
            const wrTable = html.querySelectorAll('.wr')[0];
            const tableRows = wrTable.querySelectorAll('tr').slice(1) // Remove header row
            for (const tableRow of tableRows) {
                console.log()
                const tableDataCells = tableRow.querySelectorAll('td').slice(1) // Removes date row - we won't use it
                let count = 1
                let toScrape = false
                let game = null
                let raceURL = null
                for (const tableDataCell of tableDataCells) {
                    if (count === 1) {
                        game = tableDataCell.querySelector('a')._attrs.href.slice(0, -1).toLowerCase()
                        if (['mk7', 'mk8', 'mk8dx'].includes(game)) {
                            toScrape = true
                        }
                    } else if (count === 2 && toScrape)  {
                        raceURL = tableDataCell.querySelector('a')._attrs.href
                        raceURL = "https://mkwrs.com/" + raceURL
                        await this.getAndInsertRecords(
                            raceURL,
                            game,
                            null
                        )
                    }
                    count += 1
                }
            }
        })
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