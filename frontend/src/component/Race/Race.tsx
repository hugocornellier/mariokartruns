import RaceTitle from "./RaceTitle";
import RaceTable from "./RaceTable";
import { Util } from "../../utils/Util";
import Tabs from "../Tabs";

export default function Race(props: any) {
    const raceName = Util.getRaceName()
    return (
        <>
            {props.game === "mk8dx" && <Tabs cc={props.cc} />}
            <RaceTitle game={props.game} raceName={raceName} />
            <RaceTable cc={props.cc} game={props.game} raceName={raceName} />
        </>
    );
}