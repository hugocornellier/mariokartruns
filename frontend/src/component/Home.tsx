import React from "react";
import Race from "./Race/Race";

interface HomeProps {
    socket: any; // Adjust the type according to the actual type of socket
}

const Home: React.FC<HomeProps> = ({ socket }) => (
    <div className="text-black h-full w-full p-7">
        <h1 className="mb-5 text-2xl">
            Welcome to MarioKartRuns!
        </h1>
        <p>
            This website aims to provide a full record of world records for the Mario Kart series.
        </p>
        <h1 className="mb-5 text-xl mt-5">
            Latest Records
        </h1>
        <Race socket={socket} cc="all" game="all" />
    </div>
);

export default Home;
