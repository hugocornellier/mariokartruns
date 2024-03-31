import React, { useEffect, useState } from "react";

interface RaceTitleProps {
    game: string;
    raceName: string;
}

const RaceTitle: React.FC<RaceTitleProps> = ({ game, raceName }) => {
    const [gameState, setGameState] = useState<string>("");

    useEffect(() => {
        if (game !== undefined) {
            setGameState(game.toString());
        }
    }, [game]);

    return (
        <div className="race-title text-black">
            <span
                className={gameState + " game-id mr-5 rounded-md"}
                style={{
                    display: "inline-block",
                    padding: "5px 10px"
                }}
            >
                {gameState.toUpperCase()}
            </span>
            <span style={{ fontSize: "20px", display: "inline-block" }}>
                {raceName.length > 0 ? raceName : "..."}
            </span>
        </div>
    );
}

export default RaceTitle;
