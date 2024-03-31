import React, {useEffect, useState} from "react";
import {Socket} from "socket.io-client";
import {Util} from "../../utils/Util";
import RaceTableHeader from "./RaceTableHeader";
import RaceTableBody from "./RaceTableBody";
import {DefaultEventsMap} from "socket.io/dist/typed-events";

interface RaceTableProps {
    game: string;
    cc: string;
    raceName?: string;
    socket: Socket<DefaultEventsMap, DefaultEventsMap> | undefined;
}

interface RaceData {
    [key: string]: any;
}

export default (props: RaceTableProps): React.ReactElement | null => {
    const [raceData, setRaceData] = useState<RaceData[]>();
    const [labels, setLabels] = useState<string[]>([]);
    const [isTrackList, setIsTrackList] = useState<boolean>(false);
    const [tableLabelCol2, setTableLabelCol2] = useState<string>("Player");
    const socket = props.socket;

    useEffect(() => {
        if (!socket) return;

        const fetchRaceData = () => {
            if (Util.onRacePage()) {
                socket.emit("get_race_data", props.raceName, props.game, props.cc);
                socket.on("get_race_data_ret", (data: RaceData[]) => {
                    setRaceData(data);
                    setLabels(["", "Time", tableLabelCol2, "Character", "Shrooms", "Country", "Date", "Length"]);
                });
            } else if (Util.pageDirIsPlayer()) {
                const playerName: string = Util.getPageLocation();
                socket.emit("get_player_data", playerName, props.game);
                socket.on("get_player_data_ret", (data: RaceData[], records: any[]) => {
                    const updatedData = data.map((wr) => {
                        wr.active_wr = records.some(record => {
                            return wr.video_url === record.video_url;
                        });
                        return wr;
                    });
                    setRaceData(updatedData);
                    setTableLabelCol2("Race");
                    setLabels(["", "Time", "Race", "Character", "Shrooms", "Country", "Date", "Length"]);
                });
            } else if (Util.onTrackList()) {
                socket.emit("get_records", props.game, Util.getPath().endsWith('200cc') ? '200cc' : '150cc');
                socket.on("get_records_ret", (data: RaceData[]) => {
                    setRaceData(data);
                    setIsTrackList(true);
                    setLabels(["Track", "Record", "Player", "Length"]);
                });
            } else if (props.cc === "all") {
                socket.emit("get_latest_records");
                socket.on("get_latest_records_ret", (data: RaceData[]) => {
                    setRaceData(data);
                    setLabels(["Date", "Game", "Track", "Record", "Player"]);
                });
            }
        };

        fetchRaceData();

        return () => {
            socket.off();
        };
    }, [socket, props]);

    return (
        <div className={`mkr-table-wrapper ${Util.pageDirIsMK8() ? "gold" : ""}`}>
            {!raceData ? (
                <div>Loading...</div>
            ) : (
                <table className="table">
                    <RaceTableHeader labels={labels} />
                    <RaceTableBody cc={props.cc} game={props.game} raceData={raceData} isTrackList={isTrackList} tableLabelCol2={tableLabelCol2} />
                </table>
            )}
        </div>
    );
}
