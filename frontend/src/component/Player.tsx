import RaceTable from "./Race/RaceTable";
import RaceTitle from "./Race/RaceTitle";
import {Util} from "../utils/Util";

export default function Player(props: any) {
    return (
        <>
            <RaceTitle game={props.game} raceName={decodeURI(Util.getPageLocation())} />
            <RaceTable game={props.game} raceName={""} />
        </>
    )
}
