import RaceTable from "./Race/RaceTable";
import RaceTitle from "./Race/RaceTitle";
import {Util} from "../utils/Util";

export default function Player(props: any) {
    return (
        <div className="h-full w-full text-black p-7 ">
            <RaceTitle game={props.game} raceName={decodeURI(Util.getPageLocation())} />
            <RaceTable socket={props.socket} cc={props.cc} game={props.game} raceName={""} />
        </div>
    )
}
