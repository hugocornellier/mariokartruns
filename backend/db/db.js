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
                lap4 VARCHAR(50),
                lap5 VARCHAR(50),
                lap6 VARCHAR(50),
                lap7 VARCHAR(50),
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
                race VARCHAR(250) NOT NULL, 
                race_id INTEGER NOT NULL,
                cup VARCHAR(50),
                cc VARCHAR(50)
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

    insertEntry: async function insertEntry(row, table) {
        return new Promise(async (resolve, reject) => {
            const existingEntry = await this.getEntry(row, table);
            if (existingEntry.length === 0) {
                const columns = ['date', 'player', 'days', 'lap1', 'lap2', 'lap3', 'coins', 'shrooms', 'character',
                    'kart', 'tires', 'glider', 'time', 'video_url', 'controller', 'nation', 'race', 'race_id', 'cc', 'cup'];
                const babyParkColumns = (row.race !== "GCN Baby Park") ? ['lap4', 'lap5', 'lap6', 'lap7'] : [];
                const allColumns = [...columns, ...babyParkColumns];
                const insertQuery = `
                    INSERT INTO ${table} (${allColumns.join(', ')}) 
                    VALUES (${Array(allColumns.length).fill('?').join(', ')})
                `;
                const insertValues = allColumns.map(col => row[col]);
                db_conn.run(insertQuery, insertValues, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        console.log(`Inserted a row.`);
                        resolve();
                    }
                });
            } else {
                reject("Row already exists.");
            }
        })
    },

    getEntry: async function getEntry(row, table) {
        return new Promise((resolve, reject) => {
            db_conn.all(
                `SELECT * 
                    FROM ${table} 
                    WHERE date = ? 
                    AND player = ? 
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
                [row['date'], row['player'], row['lap1'], row['lap2'], row['lap3'], row['coins'],
                    row['shrooms'], row['character'], row['kart'], row['tires'], row['glider'], row['time'],
                    row['video_url'], row['controller'], row['nation'], row['race'], row['cc']],
                (err, rows) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(rows);
                }
            )
        })
    },

    checkIfTableExists: async function checkIfTableExists(tableName) {
        return new Promise((resolve, reject) => {
            db_conn.all(
                `SELECT name FROM sqlite_master WHERE type='table' AND name='${tableName}';`,
                (err, rows) => {
                    if (err) {
                        reject(err);
                    }
                    resolve((rows.length > 0));
                }
            )
        })
    },

    getAllEntriesByRace: async function getAllEntriesByRace(race, table, cc) {
        return new Promise((resolve, reject) => {
            db_conn.all(
                `SELECT * 
                FROM ${table} 
                WHERE race = ?
                AND cc = ? 
                ORDER BY time ASC`,
                [race, cc],
                (err, rows) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(rows);
                }
            )
        })
    },

    deleteAllByRaceId: async function deleteAllByRaceId(race_id, table) {
        return new Promise((resolve, reject) => {
            db_conn.exec(
                `DELETE 
                FROM ${table} 
                WHERE race_id = '${race_id}'`,
                (err, rows) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(rows);
                }
            )
        })
    },

    getAllEntriesByPlayer: async function getAllEntriesByPlayer(player, table) {
        return new Promise((resolve, reject) => {
            db_conn.all(
                `SELECT * 
                FROM ${table} 
                WHERE player = ?
                ORDER BY date DESC, time ASC`,
                [player],
                (err, rows) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(rows);
                }
            )
        })
    },

    getRecords: async function getRecords(table, cc) {
        return new Promise((resolve, reject) => {
            db_conn.all(
                `SELECT * 
                FROM ${table} 
                WHERE cc = '${cc}'
                ORDER BY race_id, time`,
                [], (err, rows) => {
                    if (err) {
                        reject(err)
                    } else {
                        const tracksSeen = new Set();
                        const individualRecords = [];
                        for (const record of rows) {
                            if (!tracksSeen.has(record.race)) {
                                tracksSeen.add(record.race);
                                individualRecords.push(record);
                            }
                        }
                        resolve(individualRecords)
                    }
                }
            )
        })
    }
}