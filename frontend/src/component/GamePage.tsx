import RaceTable from "./Race/RaceTable";
import RaceTitle from "./Race/RaceTitle";

export default function GamePage(props: any) {
    return (
        <div className="h-full w-full text-black">
            <RaceTitle game={props.game} raceName={"Track List"} />
            <RaceTable game={props.game} raceName={""} />
        </div>
    );
}