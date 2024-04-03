const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const filepath = path.join(__dirname, "../db/records.db");

const createDbConnection = () => {
    if (fs.existsSync(filepath)) return new sqlite3.Database(filepath);
    else {
        return new sqlite3.Database(filepath, (error) => {
            if (error) {
                console.error(error.message);
            }
        });
    }
};

module.exports = createDbConnection();
