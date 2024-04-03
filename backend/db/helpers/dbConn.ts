import { existsSync } from "fs";
import { join } from "path";
import { Database } from "sqlite3";

const dbFilePath: string = join(__dirname, "../records.db");

const createDbConnection = (): Database => {
    const dbExists: boolean = existsSync(dbFilePath)
    if (dbExists) {
        return new Database(dbFilePath);
    }

    // .db file doesn't exist.
    // Attempt to create new .db file
    return new Database(dbFilePath, (error: Error | null): void => {
        if (error) {
            console.error(error.message);
        }
    });
};

export default createDbConnection();
