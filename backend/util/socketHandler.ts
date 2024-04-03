import { Socket } from 'socket.io';
import db from '../db/db';

export default {

    handleConnection(socket: Socket) {
        console.log("Socket.io connection made successfully.");

        socket.on("get_race_data", async (race: string, game: string, cc: string) => {
            await this.handleGetRaceData(socket, race, game, cc);
        });

        socket.on("get_player_data", async (player: string, game: string) => {
            await this.handleGetPlayerData(socket, player, game);
        });

        socket.on("get_records", async (table: string, cc: string) => {
            await this.handleGetRecords(socket, table, cc);
        });

        socket.on("get_latest_records", async () => {
            await this.handleGetLatestRecords(socket);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    },

    async handleGetRaceData(socket: Socket, race: string, game: string, cc: string){
        try {
            const raceData = await db.getAllEntriesByRace(race, game, cc);
            socket.emit("get_race_data_ret", raceData);
        } catch (error) {
            console.error("Error getting race data:", error);
        }
    },

    async handleGetPlayerData(socket: Socket, player: string, game: string) {
        try {
            const [playerData, records] = await Promise.all([
                db.getAllEntriesByPlayer(decodeURI(player), game),
                db.getRecords(game, 'all')
            ]);
            socket.emit("get_player_data_ret", playerData, records);
        } catch (error) {
            console.error("Error getting player data:", error);
        }
    },

    async handleGetRecords(socket: Socket, table: string, cc: string) {
        try {
            const records = await db.getRecords(table, cc);
            socket.emit("get_records_ret", records);
        } catch (error) {
            console.error("Error getting records:", error);
        }
    },

    async handleGetLatestRecords(socket: Socket) {
        try {
            const latestRecords = await db.getLatestRecords();
            socket.emit("get_latest_records_ret", latestRecords);
        } catch (error) {
            console.error("Error getting latest records:", error);
        }
    }

}