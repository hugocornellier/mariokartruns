import { Socket } from 'socket.io';
import db from '../db/db';

async function handleGetRaceData(socket: Socket, race: string, game: string, cc: string){
    try {
        const raceData = await db.getAllEntriesByRace(race, game, cc);
        socket.emit("get_race_data_ret", raceData);
    } catch (error) {
        console.error("Error getting race data:", error);
    }
}

async function handleGetPlayerData(socket: Socket, player: string, game: string) {
    try {
        const [playerData, records] = await Promise.all([
            db.getAllEntriesByPlayer(decodeURI(player), game),
            db.getRecords(game, 'all')
        ]);
        socket.emit("get_player_data_ret", playerData, records);
    } catch (error) {
        console.error("Error getting player data:", error);
    }
}

async function handleGetRecords(socket: Socket, table: string, cc: string) {
    try {
        const records = await db.getRecords(table, cc);
        socket.emit("get_records_ret", records);
    } catch (error) {
        console.error("Error getting records:", error);
    }
}

async function handleGetLatestRecords(socket: Socket) {
    try {
        const latestRecords = await db.getLatestRecords();
        socket.emit("get_latest_records_ret", latestRecords);
    } catch (error) {
        console.error("Error getting latest records:", error);
    }
}

export default function handleConnection(socket: Socket) {
    console.log("Socket.io connection made successfully.");

    socket.on("get_race_data", async function  (race: string, game: string, cc: string) {
        await handleGetRaceData(socket, race, game, cc);
    });

    socket.on("get_player_data", async function  (player: string, game: string) {
        await handleGetPlayerData(socket, player, game);
    });

    socket.on("get_records", async function  (table: string, cc: string)  {
        await handleGetRecords(socket, table, cc);
    });

    socket.on("get_latest_records", async function  ()  {
        await handleGetLatestRecords(socket);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
}