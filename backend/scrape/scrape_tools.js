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
    return new Promise(async (resolve, reject) => {
        rows = []
        const html = await fetchHTML(race_url)
        if (!html)
            reject("Error getting HTML.")
        const cc = race_url.slice(-5) === "m=200" ? "200cc" : "150cc"
        const table = (parser.parse(html).querySelectorAll('table'))[2]
        const race = (parser.parse(html).querySelectorAll('h2'))[0].innerText
        atFirstRow = true
        for (var r of table.querySelectorAll('tr')) {
            if (!atFirstRow) {
                var row = {}
                cell_count = 0
                for (const cell of r.querySelectorAll('td')) {
                    row['race'] = race
                    row['race_id'] = race_id;
                    row['cc'] = cc;
                    const properties = ['date', 'player', 'days', 'lap1', 'lap2', 'lap3', 'coins', 'shrooms', 'character', 'kart', 'tires', 'glider'];
                    properties.forEach((property, index) => {
                        row[property] = cell_count === index ? cell.textContent.trim() : row[property];
                    });
                    if (cell_count === 1 || cell_count === 3) {
                        const el = parser.parse(cell.innerHTML);
                        const img_el = el.querySelector('img');
                        const rawAttrsImg = img_el ? img_el.rawAttrs : null;
                        if (cell_count === 1) {
                            const a_el = el.querySelector('a');
                            const rawAttrs = a_el ? a_el.rawAttrs : null;
                            row['time'] = cell.textContent.trim();
                            row['video_url'] = rawAttrs ? rawAttrs.split('"')[1].trim() : 0;
                            row['controller'] = rawAttrsImg ? rawAttrsImg.split('"')[1].trim() : "default";
                        } else {
                            row['nation'] = rawAttrsImg ? rawAttrsImg.split('"')[1].trim() : 0;
                        }
                    }
                    cell_count++;
                }
                const d = new Date(row['date'])
                row['date'] = (!isNaN(d.getTime())) ? formatDate(d) : '0: ' + row['date']
                rows.push(row)
            } else {
                atFirstRow = !atFirstRow
            }
        }
        resolve(rows.filter(value => Object.keys(value).length !== 0))
    })
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
            return;
        } catch (error) {
            throw new Error(error.message);
        }
    },

    getRaceURLs: async function getRaceURLs(game) {
        return new Promise(async (resolve, reject) => {
            race_urls = []
            base_url = `https://mkwrs.com/${game}/`
            const html = await fetchHTML(base_url)
            if (!html)
                reject("Error getting HTML.")
            const tables = parser.parse(html).querySelectorAll('table')
            const table_els = [tables[0], tables[1]]
            for (var table of table_els) {
                for (var tr of table.querySelectorAll('tr')) {
                    const track_cell = tr.querySelectorAll('td')[0]
                    if (track_cell) {
                        a_el = track_cell.querySelector('a')
                        if (a_el) {
                            race_urls.push(base_url + a_el.rawAttrs.split('"')[1].trim())
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