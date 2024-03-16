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

  const goToHome = () => window.location.href = "/"

  return (
    <>
      <div className="mkr-header items-center p-4 flex flex-row w-full text-white">
        <div className={"flex flex-row items-center cursor-pointer"} onClick={goToHome}>
          <img src={require('./img/logo.png')} className="logo mr-3" alt={"MarioKartRecords Logo"}/>
          MarioKartRecords.io
        </div>
      </div>
      <div className="flex flex-row h-full w-full text-white">
        <Sidebar />
        <div className="bcontent p-7 w-full">
          <RouterProvider router={router} />
        </div>
      </div>
    </>
  )
}