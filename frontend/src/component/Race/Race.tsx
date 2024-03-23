import React from "react";
import RaceTitle from "./RaceTitle";
import RaceTable from "./RaceTable";
import { Util } from "../../utils/Util";
import Tabs from "../Tabs";

interface RaceProps {
    game: string;
    cc: string;
}

export default (props: RaceProps): JSX.Element => {
    const raceName: string = Util.getRaceName();

    return (
        <div className={"h-full w-full text-black " + (!Util.pathIs('/') ? 'p-7' : '')}>
            {props.game === "mk8dx" && <Tabs cc={props.cc} />}
            {props.cc !== "all" && <RaceTitle game={props.game} raceName={raceName} />}
            <RaceTable cc={props.cc} game={props.game} raceName={raceName} />
        </div>
    );
}
