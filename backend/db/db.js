const db_conn = require("./db_conn")

module.exports = {
    insertEntry: async function insertEntry(date, player, days, lap1, lap2, lap3, coins, shrooms, character, kart,
                                            tires, glider, time, video_url, controller, nation, race) {
        return new Promise(async (resolve, reject) => {
            console.log("Attempting to insert entry...")
            const existingEntry = await this.getEntry(date, player, days, lap1, lap2, lap3, coins, shrooms, character, kart,
                tires, glider, time, video_url, controller, nation, race)
            if (existingEntry.length === 0) {
                db_conn.run(
                    `INSERT INTO mk8 (date, player, days, lap1, lap2, lap3, coins, shrooms, character, kart, 
                                                   tires, glider, time, video_url, controller, nation, race) 
                          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [date, player, days, lap1, lap2, lap3, coins, shrooms, character, kart, tires, glider, time,
                        video_url, controller, nation, race],
                    (err) => {
                        if (err)
                            reject(err)
                        else {
                            console.log(`Inserted a row.`)
                            resolve()
                        }
                    }
                )
            } else {
                reject("Row already exists.")
            }
        })
    },

    getEntry: async function getEntry(date, player, days, lap1, lap2, lap3, coins, shrooms, character, kart,
                                      tires, glider, time, video_url, controller, nation, race) {
        return new Promise((resolve, reject) => {
            db_conn.all(
                `SELECT * 
                FROM mk8 
                WHERE date = ? 
                AND player = ? 
                AND days = ? 
                AND lap1 = ? 
                AND lap2 = ? 
                AND lap3 = ? 
                AND coins = ? 
                AND shrooms = ? 
                AND character = ? 
                AND kart = ? 
                AND tires = ? 
                AND glider = ? 
                AND time = ? 
                AND video_url = ? 
                AND controller = ? 
                AND nation = ? 
                AND race = ?`,
                [date, player, days, lap1, lap2, lap3, coins, shrooms, character, kart,
                    tires, glider, time, video_url, controller, nation, race],
                (err, rows) => {
                    if (err) reject(err)
                    else resolve(rows)
                }
            )
        })
    },

    getAllEntries: async function getAllEntries() {
        return new Promise((resolve, reject) => {
            db_conn.all(
                `SELECT * 
                     FROM mk8 
                     ORDER BY date DESC`,
                (err, rows) => {
                    if (err)
                        reject(err)
                    else {
                        resolve(rows)
                    }
                }
            )
        })
    },

    getAllEntriesByRace: async function getAllEntriesByRace(race) {
        return new Promise((resolve, reject) => {
            db_conn.all(
                `SELECT * 
                FROM mk8 
                WHERE race = ?
                ORDER BY time ASC`,
                [race],
                (err, rows) => {
                    if (err) reject(err)
                    else resolve(rows)
                }
            )
        })
    },

    getAllEntriesByPlayer: async function getAllEntriesByPlayer(player) {
        return new Promise((resolve, reject) => {
            db_conn.all(
                `SELECT * 
                FROM mk8 
                WHERE player = ?
                ORDER BY date DESC, time ASC`,
                [player],
                (err, rows) => {
                    if (err) reject(err)
                    else resolve(rows)
                }
            )
        })
    },

    getMK8Records: async function getMK8Records() {
        return new Promise((resolve, reject) => {
            db_conn.all(
                `SELECT * 
                FROM mk8 
                ORDER BY race, time ASC`,
                [],
                (err, rows) => {
                    if (err) reject(err)
                    else {
                        let tracks_seen = [], individual_records = []
                        for (const record of rows) {
                            if (!tracks_seen.includes(record.race)) {
                                tracks_seen.push(record.race)
                                individual_records.push(record)
                            }
                        }
                        resolve(individual_records)
                    }
                }
            )
        })
    },

    getDistinctRaceNamesMK8: async function getDistinctRaceNamesMK8() {
        return new Promise((resolve, reject) => {
            db_conn.all(
                `SELECT DISTINCT race 
                FROM mk8 
                ORDER BY date DESC`,
                (err, rows) => {
                    if (err)
                        reject(err)
                    else {
                        resolve(rows)
                    }
                }
            )
        })
    }
}