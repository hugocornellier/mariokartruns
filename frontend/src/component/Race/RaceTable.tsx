import { Socket } from "socket.io-client";
import { SocketHelper } from "../../context/SocketHelper";
import { useEffect, useState } from "react";
import { Util } from "../../utils/Util";
import RaceTableHeader from "./RaceTableHeader";
import RaceTableBody from "./RaceTableBody";

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
        if (Util.pageDirIsMK8() || Util.pageDirIsMK8DX()) {
            socket.emit("get_race_data", props.raceName, props.game);
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
        }
        else if (Util.pageDirIsPlayer()) {
            console.log(`Fetching data for ${playerName}`)
            socket.emit("get_player_data", playerName, props.game);
            socket.on("get_player_data_ret", (data: any, records: any) => {
                for (const wr of data) {
                    wr.active_wr = false
                }
                for (const wr of data) {
                    for (const record of records) {
                        if (wr.video_url === record.video_url) {
                            wr.active_wr = true
                            console.log(wr)
                        }
                    }
                }
                setRaceData(data);
                console.log(data)
            });
            setTableLabelCol2("Race");
            setLabels([
                "",
                "Time",
                "Race",
                "Character",
                "Shrooms",
                "Country",
                "Date",
                "Length",
            ]);
        }
        else if (Util.onMK8RaceList()) {
            socket.emit("get_mk8_records");
            socket.on("get_mk8_records_ret", (data: any) => setRaceData(data));
            setIsTrackList(true);
            setLabels(["Track", "Record", "Player"]);
        }
        else if (Util.onMK8DXRaceList()) {
            socket.emit("get_mk8dx_records");
            socket.on("get_mk8dx_records_ret", (data: any) => setRaceData(data));
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
            {!raceData ? (
                <div>Loading...</div>
            ) : (
                <table className="table">
                    <RaceTableHeader labels={labels} />
                    <RaceTableBody game={props.game} raceData={raceData} isTrackList={isTrackList} tableLabelCol2={tableLabelCol2} />
                </table>
            )}
        </div>
    );
}
