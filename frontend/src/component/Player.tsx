import {useEffect, useState} from "react";
import {Util} from "../utils/Util";
import {Socket} from "socket.io-client";
import {SocketHelper} from "../context/SocketHelper";
import {Link} from "react-router-dom";

export default function Player() {
    const [playerName, setPlayerName] = useState("")
    const [playerData, setPlayerData] = useState<any[]>();
    const [socket, setSocket] = useState<Socket>();
    useEffect(() => {
        setPlayerName(Util.getPageLocation())
        setSocket(SocketHelper.init())
    }, []);
    useEffect(() => {
        if (!socket) return;
        socket.emit("get_player_data", playerName);
        socket.on("get_player_data_ret", (data: any) => {
            console.log(data);
            setPlayerData(data)
        });
        return () => {
            socket.off();
        };
    }, [socket]);

    return (
        <div className={"text-black"}>
            {playerName}'s records
            <div>
                {!playerData ? (
                    <div>Loading...</div>
                ) : (
                    <div>
                        {playerData.map((record, i) => (
                            <div>
                                <span className={"inline-block mr-5"}>
                                    <Link key={i} to={ "/mk8/" + record.race.replace(/ /g, "+") }>
                                        { record.race }
                                    </Link>
                                </span>
                                <span className={"inline-block mr-5"}>
                                    {record.video_url != 0 && record.video_url != "0" ?
                                        <Link target="_blank" to={record.video_url}>
                                            { record.time }
                                        </Link> :
                                        <>
                                            { record.time }
                                        </>
                                    }
                                </span>
                                <span className={"inline-block mr-5"}>
                                    { record.date }
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
