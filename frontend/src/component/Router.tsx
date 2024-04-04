import React, { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import GamePage from "./GamePage";
import Race from "./Race/Race";
import Player from "./Player";
import Home from "./Home";
import ContentLayout from "./ContentLayout";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { games } from '../utils/constants';

interface RouteConfig {
    path: string;
    element: React.ReactElement | null;
}

interface RouterProps {
    socket: Socket<DefaultEventsMap, DefaultEventsMap> | undefined;
}

const Router: React.FC<RouterProps> = ({ socket }) => {
    const [activeSidebar, setActiveSidebar] = useState(true);

    const toggleSidebar = () => setActiveSidebar(prevState => !prevState);

    const createRouteElement = (
        component: React.ReactElement,
        game: string,
        cc: string = '150cc'
    ): React.ReactElement | null => (
        <ContentLayout activeSidebar={activeSidebar} toggleSidebar={toggleSidebar}>
            {React.cloneElement(component, { game, cc, socket })}
        </ContentLayout>
    );

    const routes: RouteConfig[] = [
        { path: "/", element: createRouteElement(<Home socket={socket} />, '') },
        ...games.flatMap(game => [
            {
                path: `/${game}`,
                element: createRouteElement(<GamePage />, game)
            },
            {
                path: `/${game}/200cc`,
                element: createRouteElement(<GamePage />, game, '200cc')
            },
            {
                path: `/${game}/:race`,
                element: createRouteElement(<Race />, game)
            },
            {
                path: `/${game}/:race/200cc`,
                element: createRouteElement(<Race />, game, '200cc')
            },
            {
                path: `/${game}/player/:player`,
                element: createRouteElement(<Player />, game)
            }
        ])
    ];

    const router = createBrowserRouter(routes);

    return <RouterProvider router={router} />;
}

export default Router;
