import {createBrowserRouter, RouterProvider} from "react-router-dom";
import GamePage from "./GamePage";
import Race from "./Race/Race";
import Player from "./Player";
import Home from "./Home";

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
                <>
                    <Home />
                </>
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
