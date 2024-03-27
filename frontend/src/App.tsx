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

export default function App() {
    const [activeSidebar, setActiveSidebar] = useState(true);

    const onToggleSidebar = () => setActiveSidebar(!activeSidebar);

    const createRouteElement = (
        component: JSX.Element,
        game: string,
        cc: string = '150cc'
    ): JSX.Element => (
        <ContentLayout activeSidebar={activeSidebar} onToggleSidebar={onToggleSidebar}>
            {React.cloneElement(component, { game, cc })}
        </ContentLayout>
    );

    const routes: RouteConfig[] = [
        { path: "/", element: createRouteElement(<Home />, '') },
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
        <div className="bcontent w-full">
            <RouterProvider router={router} />
        </div>
    );
}
