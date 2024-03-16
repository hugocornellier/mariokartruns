import { Socket } from "socket.io-client";
import { SocketHelper } from "../context/SocketHelper";
import { useEffect, useState } from "react";

export default function RaceTable(props: any) {
    const [raceData, setRaceData] = useState<any[]>();

    // Socket.io setup & calls
    const [socket, setSocket] = useState<Socket>();
    useEffect(() => {
        setSocket(SocketHelper.init());
    }, []);
    useEffect(() => {
        if (!socket) return;
        socket.emit("get_race_data", props.raceName);
        socket.on("get_race_data_ret", (data: any) => {
            setRaceData(data);
        });
        return () => {
            socket.off();
        };
    }, [socket]);

    return (
        <div className="mkr-table-wrapper">
            <table className="table">
                <thead>
                <th>Time</th>
                <th>Player</th>
                <th>Date</th>
                <th>Country</th>
                <th>Length</th>
                </thead>
                <tbody>
                {!raceData ? (
                    <div>Loading...</div>
                ) : (
                    <>
                        {raceData.map((record, i) => (
                            <tr>
                                <td data-label="Time">{record.time}</td>
                                <td data-label="Player">{record.player}</td>
                                <td data-label="Date">{record.date}</td>
                                <td data-label="Country">{record.nation}</td>
                                <td data-label="Length">{record.days}</td>
                            </tr>
                        ))}
                    </>
                )}
                </tbody>
            </table>
        </div>
    );
}
