import MK8 from "./component/MK8"
import RaceTitle from "./component/RaceTitle"
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
        <RaceTitle />
      )
    }
  ])

  return (
    <div className="flex flex-row h-full w-full text-white">
      <Sidebar />
      <div className="pl-10 pt-5 w-full">
        <RouterProvider router={router} />
      </div>
    </div>
  )
}