export default function RaceTitle(props: any) {
    let game: string = props.game.toString().toUpperCase()
    return (
        <div className="race-title text-black">
            <span
                className={props.game + " game-id mr-5 rounded-md "}
                style={{
                    display: "inline-block",
                    padding: "5px 10px"
                }}
            >
                {game}
            </span>
            <span style={{ fontSize: "20px", display: "inline-block" }}>
                {props.raceName.length > 0 ? props.raceName : "..."}
            </span>
        </div>
    );
}
