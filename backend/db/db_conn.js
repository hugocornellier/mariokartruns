const fs = require("fs")
const path = require("path");
const sqlite3 = require("sqlite3").verbose()
const filepath = path.join(__dirname, "../db/mk8.db")

function createDbConnection() {
    console.log("Connection with SQLite has been established. Filepath:")

    console.log(filepath)
    if (fs.existsSync(filepath))
        return new sqlite3.Database(filepath)
    else {
        const db = new sqlite3.Database(filepath, (error) => {
            if (error)
                return console.error(error.message)
            createTable(db)
        })
        return db
    }
}

function createTable(db) {
    db.exec(`
        CREATE TABLE mk8 (
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
        )
    `)
}

module.exports = createDbConnection()