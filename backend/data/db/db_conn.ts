import { existsSync } from "fs";
import { join } from "path";
import { Database } from "sqlite3";

const filepath: string = join(__dirname, "../db/records.db");

const createDbConnection = (): Database => {
    if (existsSync(filepath)) return new Database(filepath);
    else {
        return new Database(filepath, (error) => {
            if (error) {
                console.error(error.message);
            }
        });
    }
};

export default createDbConnection();
