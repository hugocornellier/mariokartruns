import RaceTitle from "./RaceTitle";
import RaceTable from "./RaceTable";
import { Util } from "../../utils/Util";
import { useEffect, useState } from "react";

export default function Race(props: any) {
    const [cc, setCC] = useState<string>("150cc");

    return (
        <>
            <RaceTitle game={props.game} raceName={Util.getPageLocation()} />
            <RaceTable cc={cc} game={props.game} raceName={Util.getPageLocation()} />
        </>
    );
}