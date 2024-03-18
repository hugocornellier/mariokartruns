import {createBrowserRouter, RouterProvider} from "react-router-dom";
import MK8 from "./MK8";
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
            element: <MK8 />,
        },
        {
            path: "/mk8/:race",
            element: <Race />,
        },
        {
            path: "/mk8/player/:player",
            element: <Player />,
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
