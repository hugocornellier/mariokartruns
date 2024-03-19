import {createBrowserRouter, RouterProvider} from "react-router-dom";
import GamePage from "./GamePage";
import Race from "./Race/Race";
import Player from "./Player";

export default function Navigation() {
    const router = createBrowserRouter([
        {
            path: "/",
            element: (
                <div className="text-black">
                    <h1>Welcome to Mario Kart Records!</h1>
                </div>
            ),
        },
        {
            path: "/mk8",
            element: <GamePage game={"mk8"} />,
        },
        {
            path: "/mk8/:race",
            element: <Race game={"mk8"} />,
        },
        {
            path: "/mk8/player/:player",
            element: <Player game={"mk8"} />,
        },
        {
            path: "/mk8dx",
            element: <GamePage game={"mk8dx"} />,
        },
    ]);

    return (
        <>
            <div className="bcontent p-7 w-full">
                <RouterProvider router={router} />
            </div>
        </>
    )
}
