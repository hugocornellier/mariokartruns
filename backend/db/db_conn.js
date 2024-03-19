const fs = require("fs")
const path = require("path");
const sqlite3 = require("sqlite3").verbose()
const filepath = path.join(__dirname, "../db/records.db")

function createDbConnection() {
    if (fs.existsSync(filepath))
        return new sqlite3.Database(filepath)
    else {
        const db = new sqlite3.Database(filepath, (error) => {
            if (error)
                return console.error(error.message)
        })
        return db
    }
}

module.exports = createDbConnection()