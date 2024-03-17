import { Socket } from "socket.io-client";
import { SocketHelper } from "../context/SocketHelper";
import { useEffect, useState } from "react";
import RaceTable from "./RaceTable";

export default function MK8() {
    const [unique, setUnique] = useState<any[]>();
    const [socket, setSocket] = useState<Socket>();
    useEffect((): void => setSocket(SocketHelper.init()), []);
    useEffect(() => {
        if (!socket)
            return;
        socket.emit("get_unique_mk8_races");
        socket.on("get_unique_mk8_races_ret", (data: any) : void => {
            let unique_races : any[] = [];
            for (const race_data of data)
                unique_races.push(race_data.race);
            setUnique(unique_races);
        });
        return () => {
            socket.off();
        };
    }, [socket]);

    return (
        <div className="h-full w-full text-black">
            {!unique ? (
                <>
                    Loading...
                </>
            ) : (
                <>
                    <RaceTable raceName={""} />
                </>
            )}
        </div>
    );
}