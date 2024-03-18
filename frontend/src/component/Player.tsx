import RaceTable from "./Race/RaceTable";
import RaceTitle from "./Race/RaceTitle";
import {useEffect, useState} from "react";
import {Util} from "../utils/Util";

export default function Player() {
    const [playerName, sePlayerName] = useState("");
    useEffect(() => {
        sePlayerName(Util.getPageLocation());
    }, []);

    return (
        <>
            <RaceTitle raceName={playerName} />
            <RaceTable raceName={""} />
        </>
    )
}
