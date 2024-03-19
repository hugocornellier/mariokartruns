import RaceTitle from "./RaceTitle";
import RaceTable from "./RaceTable";
import { Util } from "../../utils/Util";
import { useEffect, useState } from "react";

export default function Race(props: any) {
    const [raceName, setRaceName] = useState("");
    useEffect(() => {
        setRaceName(Util.getPageLocation());
    }, []);

    return (
        <>
            <RaceTitle game={props.game} raceName={raceName} />
            <RaceTable game={props.game} raceName={raceName} />
        </>
    );
}