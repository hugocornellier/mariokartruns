import db_conn from "./db_conn";

interface Row {
    [key: string]: string | number | null;
}

interface Record {
    race: string;
    time: string;
    player: string;
    cc: string;
    date: string;
}

export default {

    createTable(tableName: string): void {
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
        `);
    },

    async getLatestRecords(): Promise<Record[]> {
        const tables: string[] = ['mk7', 'mk8', 'mk8dx'];
        const sqlQuery: string = `
            SELECT * FROM (
                ${tables.map(table => `
                    SELECT '${table}' AS table_name, race, time, player, cc, date FROM ${table}
                `).join(' UNION ALL ')}
            ) AS combined_data
            ORDER BY date DESC, time
            LIMIT 50
        `;

        return new Promise<Record[]>((resolve, reject) => {
            db_conn.all(sqlQuery, [], (err: any, rows: Record[] | PromiseLike<Record[]>) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    },

    async deleteTable(table: string): Promise<void> {
        if (await this.checkIfTableExists(table)) {
            db_conn.exec(`DROP TABLE ${table}`);
        }
    },

    async insertEntry(row: Row, table: string): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            console.log("Attempting to insert entry.");
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
                console.log("Row already exists.");
                reject("Row already exists.");
            }
        });
    },

    async getEntry(row: Row, table: string): Promise<Row[]> {
        return new Promise<Row[]>((resolve, reject) => {
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
                (err: any, rows: Row[] | PromiseLike<Row[]>) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(rows);
                }
            )
        })
    },

    async checkIfTableExists(tableName: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            db_conn.all(
                `SELECT name FROM sqlite_master WHERE type='table' AND name='${tableName}';`,
                (err: any, rows: string | any[]) => {
                    if (err) {
                        reject(err);
                    }
                    resolve((rows.length > 0));
                }
            )
        })
    },

    async getRaceIdByRaceName(game: string, raceName: string): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            db_conn.all(
                `SELECT * 
                FROM ${game} 
                WHERE race = ? 
                ORDER BY date ASC 
                LIMIT 1`,
                [raceName],
                (err: any, rows: { race_id: number | PromiseLike<number>; }[]) => {
                    if (err) {
                        reject(err);
                    }
                    if (rows[0] && rows[0].race_id) {
                        resolve(rows[0].race_id);
                    } else {
                        reject("An error happened fetching raceID.")
                    }
                }
            )
        })
    },

    async getAllEntriesByRace(race: string, table: string, cc: string): Promise<Record[]> {
        return new Promise<Record[]>((resolve, reject) => {
            db_conn.all(
                `SELECT * 
                FROM ${table} 
                WHERE race = ?
                AND cc = ? 
                ORDER BY time ASC`,
                [race, cc],
                (err: any, rows: Record[] | PromiseLike<Record[]>) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(rows);
                }
            )
        })
    },

    async getAllEntriesByPlayer(player: string, table: string): Promise<Record[]> {
        return new Promise<Record[]>((resolve, reject) => {
            db_conn.all(
                `SELECT * 
                FROM ${table} 
                WHERE player = ?
                ORDER BY date DESC, time ASC`,
                [player],
                (err: any, rows: Record[] | PromiseLike<Record[]>) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(rows);
                }
            )
        })
    },

    async getRecords(table: string, cc: string): Promise<Record[]> {
        return new Promise<Record[]>((resolve, reject) => {
            db_conn.all(
                `SELECT * 
                FROM ${table} 
                WHERE cc = '${cc}'
                ORDER BY race_id, time`,
                [], (err: any, rows: any) => {
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
};
