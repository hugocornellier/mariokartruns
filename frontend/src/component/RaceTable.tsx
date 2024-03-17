import { Socket } from "socket.io-client";
import { SocketHelper } from "../context/SocketHelper";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Util } from "../utils/Util"

export default function RaceTable(props: any) {
    const [socket, setSocket] = useState<Socket>();
    useEffect(() : void => setSocket(SocketHelper.init()), []);
    const [raceData, setRaceData] = useState<any[]>();
    const [raceList, setRaceList] = useState<any[]>();
    const [tableLabelCol2, setTableLabelCol2] = useState<string>("Player");
    useEffect(() => {
        const playerName : string = Util.getPageLocation()
        if (!socket || playerName.length === 0)
            return;
        if (Util.pageDirIsMK8()) {
            socket.emit("get_race_data", props.raceName);
            socket.on("get_race_data_ret", (data: any) => setRaceData(data));
        }
        else if (Util.pageDirIsPlayer()) {
            socket.emit("get_player_data", playerName);
            socket.on("get_player_data_ret", (data: any) => setRaceData(data));
            setTableLabelCol2("Race")
        }
        console.log()
        return () => {
            socket.off();
        };
    }, [socket]);

    return (
        <div className="mkr-table-wrapper">
            <table className="table">
                <thead>
                <>
                    {['Time', tableLabelCol2, 'Date', 'Shrooms', 'Country', 'Length'].map(
                        (record, i : number) => (
                            <th key={i}>
                                {record.toString()}
                            </th>
                        )
                    )}
                </>
                </thead>
                <tbody>
                {!raceData ? (
                    <div>Loading...</div>
                ) : (
                    <>
                        {raceData.map((record, i : number) => (
                            <tr key={i}>
                                <td data-label="time">
                                    <Link target={"_blank"} className={"cursor-pointer"} to={record.video_url}>
                                        {record.time}
                                    </Link>
                                </td>
                                <td data-label={tableLabelCol2}>
                                    <Link
                                        className={"cursor-pointer"}
                                        to={tableLabelCol2 === "Player"
                                            ? "/mk8/player/" + record.player.replace(/ /g, "+")
                                            : "/mk8/" + record.race.replace(/ /g, "+")}
                                    >
                                        {tableLabelCol2 === "Player" ? record.player : record.race}
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
