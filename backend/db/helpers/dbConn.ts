import { join } from "path";
import { Database } from "sqlite3";

const dbFilePath: string = join(__dirname, "../records.db");

const createDbConnection = (): Database => {
    return new Database(dbFilePath, (err: Error | null): void => {
        if (err) {
            console.error(err.message);
        }
    });
};

export default createDbConnection();
