import React, { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { SocketHelper } from "../../context/SocketHelper";
import { Util } from "../../utils/Util";
import { useNavigate } from 'react-router-dom'
import RaceTableHeader from "./RaceTableHeader";
import RaceTableBody from "./RaceTableBody";

interface RaceTableProps {
    game: string;
    cc: string;
    raceName?: string;
}

interface RaceData {
    [key: string]: any;
}

export default (props: RaceTableProps): JSX.Element => {
    const pathname = window.location.pathname
    const [currentUrl, setCurrentUrl] = React.useState(pathname)
    useEffect(() => {
        setCurrentUrl(pathname)
    }, [pathname])

    const [socket, setSocket] = useState<Socket>();
    const [raceData, setRaceData] = useState<RaceData[]>();
    const [labels, setLabels] = useState<string[]>([]);
    const [isTrackList, setIsTrackList] = useState<boolean>(false);
    const [tableLabelCol2, setTableLabelCol2] = useState<string>("Player");

    useEffect(() => {
        setSocket(SocketHelper.init());

        return () => {
            if (socket) {
                socket.off();
            }
        };
    }, []);

    useEffect(() => {
        if (!socket) return;

        console.log("Hi")

        const fetchRaceData = () => {
            if (currentUrl && Util.onRacePage()) {
                socket.emit("get_race_data", props.raceName, props.game, props.cc);
                socket.on("get_race_data_ret", (data: RaceData[]) => {
                    setRaceData(data);
                    setLabels(["", "Time", tableLabelCol2, "Character", "Shrooms", "Country", "Date", "Length"]);
                });
            } else if (currentUrl && Util.pageDirIsPlayer()) {
                const playerName: string = Util.getPageLocation();
                socket.emit("get_player_data", playerName, props.game);
                socket.on("get_player_data_ret", (data: RaceData[], records: any[]) => {
                    const updatedData = data.map((wr) => {
                        wr.active_wr = records.some((record) => wr.video_url === record.video_url);
                        return wr;
                    });
                    setRaceData(updatedData);
                    setTableLabelCol2("Race");
                    setLabels(["", "Time", "Race", "Character", "Shrooms", "Country", "Date", "Length"]);
                });
            } else if (currentUrl && Util.onTrackList()) {
                let cc_level: string = Util.pathIs('/mk8dx/200cc') ? '200cc' : '150cc'
                console.log(cc_level)
                socket.emit("get_records", props.game, cc_level);
                socket.on("get_records_ret", (data: RaceData[]) => {
                    setRaceData(data);
                    setIsTrackList(true);
                    setLabels(["Track", "Record", "Player", "Length"]);
                });
            } else if (currentUrl && props.cc === "all") {
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
    }, [socket, props, currentUrl]);

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
