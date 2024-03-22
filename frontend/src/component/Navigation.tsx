import {createBrowserRouter, RouterProvider} from "react-router-dom";
import GamePage from "./GamePage";
import Race from "./Race/Race";
import Player from "./Player";

export default function Navigation() {
    const createGameRoutes = (game: string) => [
        {
            path: `/${game}`,
            element: <GamePage game={game} />,
        },
        {
            path: `/${game}/200cc`,
            element: <GamePage game={game} />,
        },
        {
            path: `/${game}/:race`,
            element: <Race cc={'150cc'} game={game} />,
        },
        {
            path: `/${game}/:race/200cc`,
            element: <Race cc={'200cc'} game={game} />,
        },
        {
            path: `/${game}/player/:player`,
            element: <Player game={game} />,
        },
    ];

    const router = createBrowserRouter([
        {
            path: "/",
            element: (
                <div className="text-black">
                    <h1>Welcome to MarioKartRuns!</h1>
                </div>
            ),
        },
        ...createGameRoutes("mk8"),
        ...createGameRoutes("mk8dx"),
    ]);

    return (
        <>
            <div className="bcontent p-7 w-full">
                <RouterProvider router={router} />
            </div>
        </>
    )
}
