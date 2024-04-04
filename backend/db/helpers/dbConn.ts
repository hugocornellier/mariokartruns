import { existsSync } from "fs";
import { join } from "path";
import { Database } from "sqlite3";

const dbFilePath: string = join(__dirname, "../records.db");

const createDbConnection = (): Database => {
    const dbExists: boolean = existsSync(dbFilePath);
    const database: Database = new Database(dbFilePath, (err: Error | null): void => {
        if (err) {
            console.error(err.message);
        }
    });

    if (!dbExists) {
        // We could handle table creation here, but it is also handled during insertion
    }

    return database;
};

export default createDbConnection();
