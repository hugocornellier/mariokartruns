const db_conn = require("./db_conn")

module.exports = {

    createTable: function createTable(tableName) {
        db_conn.exec(`
            CREATE TABLE ${tableName} (
                date VARCHAR(50) NOT NULL,
                player VARCHAR(50) NOT NULL,
                days VARCHAR(50) NOT NULL,
                lap1 VARCHAR(50) NOT NULL,
                lap2 VARCHAR(50) NOT NULL,
                lap3 VARCHAR(50) NOT NULL,
                coins VARCHAR(50) NOT NULL,
                shrooms VARCHAR(50) NOT NULL,
                character VARCHAR(250) NOT NULL,
                kart VARCHAR(250) NOT NULL,
                tires VARCHAR(250) NOT NULL,
                glider VARCHAR(250) NOT NULL,
                time VARCHAR(250) NOT NULL,
                video_url VARCHAR(250) NOT NULL,
                controller VARCHAR(250) NOT NULL,
                nation VARCHAR(250) NOT NULL,
                race VARCHAR(250) NOT NULL
                ${tableName === "mk8dx" ? ", cc VARCHAR(50)" : ""}
            )
        `)
    },

    deleteTable: async function deleteTable(table) {
        if (await this.checkIfTableExists(table)) {
            db_conn.exec(`
                DROP TABLE ${table}
            `)
        }
    },

    insertEntry: async function insertEntry(date, player, days, lap1, lap2, lap3, coins, shrooms, character, kart,
                                            tires, glider, time, video_url, controller, nation, race, cc, table) {
        return new Promise(async (resolve, reject) => {
            const existingEntry = await this.getEntry(date, player, days, lap1, lap2, lap3, coins, shrooms, character, kart,
                tires, glider, time, video_url, controller, nation, race, cc, table)
            if (existingEntry.length === 0) {
                db_conn.run(
                    `INSERT INTO ${table} (date, player, days, lap1, lap2, lap3, coins, shrooms, character, kart, 
                                                   tires, glider, time, video_url, controller, nation, race, cc) 
                          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [date, player, days, lap1, lap2, lap3, coins, shrooms, character, kart, tires, glider, time,
                        video_url, controller, nation, race, cc],
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
                                      tires, glider, time, video_url, controller, nation, race, cc, table) {
        return new Promise((resolve, reject) => {
            db_conn.all(
                `SELECT * 
                FROM ${table} 
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
                AND race = ? 
                AND cc = ?`,
                [date, player, days, lap1, lap2, lap3, coins, shrooms, character, kart,
                    tires, glider, time, video_url, controller, nation, race, cc],
                (err, rows) => {
                    if (err) reject(err)
                    else resolve(rows)
                }
            )
        })
    },

    checkIfTableExists: async function checkIfTableExists(tableName) {
        return new Promise((resolve, reject) => {
            db_conn.all(
                `SELECT name FROM sqlite_master WHERE type='table' AND name='${tableName}';`,
                (err, rows) => {
                    if (err)
                        reject(err)
                    else {
                        if (rows.length > 0)
                            resolve(true)
                        else {
                            resolve(false)
                        }
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

    getRecords: async function getRecords(table) {
        return new Promise((resolve, reject) => {
            db_conn.all(
                `SELECT * 
                FROM ${table} 
                ORDER BY race, time ASC`,
                [], (err, rows) => {
                    if (err)
                        reject(err)
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
    }
}