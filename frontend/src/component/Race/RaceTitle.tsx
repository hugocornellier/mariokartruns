import {useEffect, useState} from "react";

export default function RaceTitle(props: any) {
    const [game, setGame] = useState<string>("");
    useEffect(() => {
        if (props.game !== undefined) {
            console.log("props.game = " + props.game)
            setGame(props.game.toString())
        } else {
            console.log("Undefined")
        }
    })
    return (
        <div className="race-title text-black">
            <span
                className={game + " game-id mr-5 rounded-md "}
                style={{
                    display: "inline-block",
                    padding: "5px 10px"
                }}
            >
                {game.toUpperCase()}
            </span>
            <span style={{ fontSize: "20px", display: "inline-block" }}>
                {props.raceName.length > 0 ? props.raceName : "..."}
            </span>
        </div>
    );
}
