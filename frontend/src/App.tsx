import MK8 from "./component/MK8"
import Race from "./component/Race"
import Player from "./component/Player"
import Sidebar from "./Sidebar"
import {
  createBrowserRouter,
  RouterProvider,
  useParams
} from "react-router-dom"

export default function App() {
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
      element: ( <MK8 /> ),
    },
    {
      path: "/mk8/:race",
      element: ( 
        <Race />
      )
    },
    {
      path: "/mk8/player/:player",
      element: (
          <Player />
      )
    }
  ])

  return (
    <div className="flex flex-row h-full w-full text-white">
      <Sidebar />
      <div className="bcontent pl-10 pt-5 w-full">
        <RouterProvider router={router} />
      </div>
    </div>
  )
}