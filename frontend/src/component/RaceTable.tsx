import { Socket } from "socket.io-client";
import { SocketHelper } from "../context/SocketHelper";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Util } from "../utils/Util";
import RaceTableHeader from "./RaceTableHeader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown as faMyIcon } from "@fortawesome/free-solid-svg-icons";
import RaceTableRow from "./RaceTableRow";

export default function RaceTable(props: any) {
    const [socket, setSocket] = useState<Socket>();
    useEffect((): void => setSocket(SocketHelper.init()), []);
    const [raceData, setRaceData] = useState<any[]>();
    const [labels, setLabels] = useState<any[]>();
    const [isTrackList, setIsTrackList] = useState<boolean>(false);
    const [tableLabelCol2, setTableLabelCol2] = useState<string>("Player");
    useEffect(() => {
        const playerName: string = Util.getPageLocation();
        if (!socket || playerName.length === 0) return;
        if (Util.pageDirIsMK8()) {
            socket.emit("get_race_data", props.raceName);
            socket.on("get_race_data_ret", (data: any) => setRaceData(data));
            setLabels([
                "",
                "Time",
                tableLabelCol2,
                "Character",
                "Shrooms",
                "Country",
                "Date",
                "Length",
            ]);
        } else if (Util.pageDirIsPlayer()) {
            socket.emit("get_player_data", playerName);
            socket.on("get_player_data_ret", (data: any) => setRaceData(data));
            setTableLabelCol2("Race");
            setLabels([
                "Time",
                "Race",
                "Character",
                "Shrooms",
                "Country",
                "Date",
                "Length",
            ]);
        } else if (Util.onMK8RaceList()) {
            socket.emit("get_mk8_records");
            socket.on("get_mk8_records_ret", (data: any) => setRaceData(data));
            setIsTrackList(true);
            setLabels(["Track", "Record", "Player"]);
        }
        console.log();
        return () => {
            socket.off();
        };
    }, [socket]);

    return (
        <div className={(Util.pageDirIsMK8() ? "gold" : "") + " mkr-table-wrapper"}>
            <table className="table">
                {!raceData ? (
                    <div>Loading...</div>
                ) : (
                    <>
                        <RaceTableHeader labels={labels} />
                        <tbody>
                            {isTrackList
                                ? raceData.map((record, i: number) => (
                                    <tr key={i}>
                                        <td data-label="Race">
                                            <Link
                                                className={"cursor-pointer"}
                                                to={"/mk8/" + record.race.replace(/ /g, "+")}
                                            >
                                                {record.race}
                                            </Link>
                                        </td>
                                        <RaceTableRow dataLabel="Record" content={record.time} />
                                        <td data-label="Player">{record.player}</td>
                                    </tr>
                                ))
                                : raceData.map((record, i: number) => (
                                    <tr key={i}>
                                        {Util.pageDirIsMK8() ? (
                                            <td data-label="Crown">
                                                {i === 0 ? (
                                                    <FontAwesomeIcon
                                                        color={"#9a8015"}
                                                        icon={faMyIcon}
                                                    />
                                                ) : (
                                                    ""
                                                )}
                                            </td>
                                        ) : (
                                            ""
                                        )}
                                        <td data-label="Time">
                                            {record.video_url != 0 ? (
                                                <Link
                                                    target={"_blank"}
                                                    className={"cursor-pointer"}
                                                    to={record.video_url}
                                                >
                                                    {record.time}
                                                </Link>
                                            ) : (
                                                <>{record.time}</>
                                            )}
                                        </td>
                                        <td data-label={tableLabelCol2}>
                                            {
                                                <Link
                                                    className={"cursor-pointer"}
                                                    to={
                                                        tableLabelCol2 === "Player"
                                                            ? "/mk8/player/" +
                                                            record.player.replace(/ /g, "+")
                                                            : "/mk8/" + record.race.replace(/ /g, "+")
                                                    }
                                                >
                                                    {tableLabelCol2 === "Player"
                                                        ? record.player
                                                        : record.race}
                                                </Link>
                                            }
                                        </td>
                                        <td data-label="Character">{record.character}</td>
                                        <td data-label="Shrooms">{record.shrooms}</td>
                                        <td data-label="Country">{record.nation}</td>
                                        <td data-label="Date">{record.date}</td>
                                        <td data-label="Length">{record.days}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </>
                )}
            </table>
        </div>
    );
}
