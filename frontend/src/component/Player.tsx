import {useEffect, useState} from "react";
import {Util} from "../utils/Util";
import {Socket} from "socket.io-client";
import {SocketHelper} from "../context/SocketHelper";
import {Link} from "react-router-dom";
import RaceTable from "./RaceTable";

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
        <RaceTable raceName={""} />
    )
}
