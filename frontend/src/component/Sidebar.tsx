import React, { Component } from "react";
import {Link} from "react-router-dom";

interface SidebarProps {
    isActive: boolean;
}

export default class Sidebar extends Component<SidebarProps> {
    render() {
        const { isActive } = this.props;

        const games = [
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
                                <Link to={game.path}>
                                    <div className="link" key={index} >
                                        {game.name}
                                    </div>
                                </Link>
                        ))}
                    </div>
                )}
            </>
        );
    }
}
