import React from "react";
import { Link } from "react-router-dom";

interface Game {
    name: string;
    path: string;
}

interface SidebarProps {
    isActive: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isActive }) => {
    const games: Game[] = [
        { name: "Mario Kart 8 Deluxe", path: "/mk8dx" },
        { name: "Mario Kart 8", path: "/mk8" },
        { name: "Mario Kart 7", path: "/mk7" }
    ];

    return (
        <>
            {isActive && (
                <div className="sidebar text-white min-h-screen hide-on-mobile" style={{ width: "300px", background: "rgb(6, 33, 72)" }}>
                    <div className="header">
                        <b>Games</b>
                    </div>
                    {games.map((game, index) => (
                        <Link to={game.path} key={index}>
                            <div className="link">
                                {game.name}
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </>
    );
}

export default Sidebar;
