import React, { useEffect, useState } from "react";

interface RaceTitleProps {
    game: string;
    raceName: string;
}

const RaceTitle: React.FC<RaceTitleProps> = ({ game, raceName }) => {
    const [gameState, setGameState] = useState<string>("");

    useEffect(() => {
        if (game !== undefined) {
            const gameStylized: string = game === 'mkwii' ? 'MKWii' : game.toUpperCase();
            setGameState(gameStylized);
        }
    }, [game]);

    return (
        <div className="race-title text-black">
            <span
                className={gameState.toLowerCase() + " game-id mr-5 rounded-md"}
                style={{
                    display: "inline-block",
                    padding: "5px 10px"
                }}
            >
                {gameState}
            </span>
            <span style={{ fontSize: "20px", display: "inline-block" }}>
                {raceName.length > 0 ? raceName : "..."}
            </span>
        </div>
    );
}

export default RaceTitle;
