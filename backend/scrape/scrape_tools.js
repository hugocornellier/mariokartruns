const fetch = require("cross-fetch");
const parser = require("node-html-parser");
const db = require("../db/db");


const formatDate = date => {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;
    return [year, month, day].join('-');
};

const removeYouTubeLinksFromArray = a => a.filter(i => !i.includes("youtube.com/") && !i.includes("youtu.be/"));
const removeDuplicatesFromArray = arr => {
    return arr.filter((value, index) => arr.indexOf(value) === index);
};

async function fetchHTML(url) {
    return new Promise(async (resolve, reject) => {
        const res = await fetch(url)
        if (res.status >= 400)
            reject("Bad response from server")
        const html = await res.text()
        if (html) {
            resolve(html)
        } else {
            reject("Error getting HTML.")
        }
    })
}

async function getRaceRecords(race_url, game, race_id) {
    return new Promise(async (resolve, reject) => {
        rows = []
        const html = await fetchHTML(race_url)
        if (!html)
            reject("Error getting HTML.")
        const cc = race_url.slice(-5) === "m=200" ? "200cc" : "150cc"
        const table = (parser.parse(html).querySelectorAll('table'))[2]
        atFirstRow = true
        for (var r of table.querySelectorAll('tr')) {
            if (!atFirstRow) {
                var row = {}
                cell_count = 0
                for (var c of r.querySelectorAll('td')) {
                    row['date'] = (cell_count === 0) ? c.textContent.trim() : row['date']
                    row['player'] = (cell_count === 2) ? c.textContent.trim() : row['player']
                    row['days'] = (cell_count === 4) ? c.textContent.trim() : row['days']
                    row['lap1'] = (cell_count === 5) ? c.textContent.trim() : row['lap1']
                    row['lap2'] = (cell_count === 6) ? c.textContent.trim() : row['lap2']
                    row['lap3'] = (cell_count === 7) ? c.textContent.trim() : row['lap3']
                    row['coins'] = (cell_count === 8) ? c.textContent.trim() : row['coins']
                    row['shrooms'] = (cell_count === 9) ? c.textContent.trim() : row['shrooms']
                    row['character'] = (cell_count === 10) ? c.textContent.trim() : row['character']
                    row['kart'] = (cell_count === 11) ? c.textContent.trim() : row['kart']
                    row['tires'] = (cell_count === 12) ? c.textContent.trim() : row['tires']
                    row['glider'] = (cell_count === 13) ? c.textContent.trim() : row['glider']
                    row['race'] = parser.parse(html).querySelectorAll('h2')[0].textContent
                    row['race_id'] = race_id
                    row['cc'] = cc
                    if (cell_count === 1) {
                        el = parser.parse(c.innerHTML)
                        a_el = el.querySelector('a')
                        img_el = el.querySelector('img')
                        rawAttrs = a_el ? a_el.rawAttrs : null
                        rawAttrsImg = img_el ? img_el.rawAttrs : null
                        row['time'] = c.textContent.trim()
                        row['video_url'] = rawAttrs ? rawAttrs.split('"')[1].trim() : 0
                        row['controller'] = rawAttrsImg ? rawAttrsImg.split('"')[1].trim() : "default"
                    } else if (cell_count === 3) {
                        el = parser.parse(c.innerHTML)
                        img_el = el.querySelector('img')
                        rawAttrsImg = img_el ? img_el.rawAttrs : null
                        row['nation'] = rawAttrsImg ? rawAttrsImg.split('"')[1].trim() : 0
                    }
                    cell_count++
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
        return new Promise(async (resolve, reject) => {
            console.log("Fetching records at URL: " + race_url)
            try {
                rows = await getRaceRecords(race_url, table, race_id)
                tableExists = await db.checkIfTableExists(table)
            } catch (err) {
                reject(err)
            }
            console.log("Race records received! Attempting to insert all rows. ")
            if (!tableExists) {
                db.createTable(table)
            }
            for (const row of rows) {
                try {
                    await db.insertEntry(row['date'], row['player'], row['days'], row['lap1'], row['lap2'],
                        row['lap3'], row['coins'], row['shrooms'], row['character'], row['kart'], row['tires'],
                        row['glider'], row['time'], row['video_url'], row['controller'], row['nation'], row['race'],
                        row['race_id'], row['cc'], table)
                } catch (e) {

                }
            }
            console.log("Done inserting...")
            resolve()
        })
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