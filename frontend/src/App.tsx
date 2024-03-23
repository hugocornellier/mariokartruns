import React, { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import GamePage from "./component/GamePage";
import Race from "./component/Race/Race";
import Player from "./component/Player";
import Home from "./component/Home";
import ContentLayout from "./component/ContentLayout";

interface RouteConfig {
    path: string;
    element: JSX.Element;
}

interface AppProps {}

export default function App(props: AppProps) {
    const [activeSidebar, setActiveSidebar] = useState(true);

    const onToggleSidebar = () => setActiveSidebar(!activeSidebar);

    const createGameRoutes = (game: string, cc: string = '150cc'): RouteConfig[] => [
        { path: `/${game}`, element: renderGamePage(game, cc) },
        { path: `/${game}/200cc`, element: renderGamePage(game, '200cc') },
        { path: `/${game}/:race`, element: renderRace(game, cc) },
        { path: `/${game}/:race/200cc`, element: renderRace(game, '200cc') },
        { path: `/${game}/player/:player`, element: renderPlayer(game) },
    ];

    const renderGamePage = (game: string, cc: string): JSX.Element => (
        <ContentLayout activeSidebar={activeSidebar} onToggleSidebar={onToggleSidebar}>
            <GamePage game={game} cc={cc} />
        </ContentLayout>
    );

    const renderRace = (game: string, cc: string): JSX.Element => (
        <ContentLayout activeSidebar={activeSidebar} onToggleSidebar={onToggleSidebar}>
            <Race cc={cc} game={game} />
        </ContentLayout>
    );

    const renderPlayer = (game: string): JSX.Element => (
        <ContentLayout activeSidebar={activeSidebar} onToggleSidebar={onToggleSidebar}>
            <Player game={game} />
        </ContentLayout>
    );

    const renderHome = (): JSX.Element => (
        <ContentLayout activeSidebar={activeSidebar} onToggleSidebar={onToggleSidebar}>
            <Home />
        </ContentLayout>
    );

    const routes: RouteConfig[] = [
        { path: "/", element: renderHome() },
        ...createGameRoutes("mk8dx"),
        ...createGameRoutes("mk8"),
        ...createGameRoutes("mk7"),
    ];

    const router = createBrowserRouter(routes);

    return (
        <div className="bcontent w-full">
            <RouterProvider router={router} />
        </div>
    );
}
