import RaceTable from "./Race/RaceTable";
import RaceTitle from "./Race/RaceTitle";
import {useEffect, useState} from "react";
import {Util} from "../utils/Util";
import Tabs from "./Tabs";

export default function GamePage(props: any) {
    const [cc, setCC] = useState<string>("150cc");

    useEffect(() => {
       const pageLoc: string = Util.getPageLocation()
        if (pageLoc === "200cc") {
            setCC("200cc")
        }
    });

    return (
        <div className="h-full w-full text-black">
            {props.game === "mk8dx" && <Tabs cc={cc} />}
            <RaceTitle game={props.game} raceName={"Track List"}/>
            <RaceTable cc={cc} game={props.game} raceName={""} />
        </div>
    );
}