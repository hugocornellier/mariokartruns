import React, { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import GamePage from "./GamePage";
import Race from "./Race/Race";
import Player from "./Player";
import Home from "./Home";
import ContentLayout from "./ContentLayout";
import {Socket} from "socket.io-client";
import {DefaultEventsMap} from "socket.io/dist/typed-events";

interface RouteConfig {
    path: string;
    element: JSX.Element;
}

interface RouterProps {
    socket: Socket<DefaultEventsMap, DefaultEventsMap> | undefined; // Type should be adjusted according to the actual type of socket
}

const Router: React.FC<RouterProps> = ({ socket }) => {
    const [activeSidebar, setActiveSidebar] = useState(true);

    const toggleSidebar = () => setActiveSidebar(prevState => !prevState);

    const createRouteElement = (
        component: JSX.Element,
        game: string,
        cc: string = '150cc'
    ): JSX.Element => (
        <ContentLayout activeSidebar={activeSidebar} toggleSidebar={toggleSidebar}>
            {React.cloneElement(component, { game, cc, socket })}
        </ContentLayout>
    );

    const routes: RouteConfig[] = [
        { path: "/", element: createRouteElement(<Home socket={socket} />, '') },
        ...['mk8dx', 'mk8', 'mk7'].flatMap(game => [
            { path: `/${game}`, element: createRouteElement(<GamePage />, game) },
            { path: `/${game}/200cc`, element: createRouteElement(<GamePage />, game, '200cc') },
            { path: `/${game}/:race`, element: createRouteElement(<Race />, game) },
            { path: `/${game}/:race/200cc`, element: createRouteElement(<Race />, game, '200cc') },
            { path: `/${game}/player/:player`, element: createRouteElement(<Player />, game) }
        ])
    ];

    const router = createBrowserRouter(routes);

    return (
        <RouterProvider router={router} />
    );
}

export default Router;
