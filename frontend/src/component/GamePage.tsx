import RaceTable from "./Race/RaceTable";
import RaceTitle from "./Race/RaceTitle";
import {useState} from "react";

export default function GamePage(props: any) {
    const [cc, setCC] = useState<string>("150cc");

    return (
        <div className="h-full w-full text-black">
            {props.game === "mk8dx" && (
                <div className={"tabs flex flex-row mb-6 h-10"}>
                    <div className={(cc === "150cc" && "active ") + "mr-5"}>
                        150cc
                    </div>
                    <div className={(cc === "200cc" && "active ") + ""}>
                        200cc
                    </div>
                </div>
            )}
            <RaceTitle game={props.game} raceName={"Track List"}/>
            <RaceTable cc={cc} game={props.game} raceName={""} />
        </div>
    );
}