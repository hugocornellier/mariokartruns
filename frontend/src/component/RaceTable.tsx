import { Socket } from "socket.io-client";
import { SocketHelper } from "../context/SocketHelper";
import { useEffect, useState } from "react";
import {Link} from "react-router-dom";

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
            console.log(data);
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
                <th>Shrooms</th>
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
                                <td data-label="Time">
                                    <Link className={"cursor-pointer"} to={record.video_url}>
                                        {record.time}
                                    </Link>
                                </td>
                                <td data-label="Player">
                                    <Link className={"cursor-pointer"} to={"/mk8/player/" + record.player.replace(/ /g, "+")}>
                                        {record.player}
                                    </Link>
                                </td>
                                <td data-label="Date">
                                    {record.date}
                                </td>
                                <td data-label="Shrooms">
                                    {record.shrooms}
                                </td>
                                <td data-label="Country">
                                    {record.nation}
                                </td>
                                <td data-label="Length">
                                    {record.days}
                                </td>
                            </tr>
                        ))}
                    </>
                )}
                </tbody>
            </table>
        </div>
    );
}
