import RaceTitle from "./RaceTitle"
import RaceTable from "./RaceTable"
import { Socket } from "socket.io-client"
import { SocketHelper } from "../context/SocketHelper"
import { 
  useEffect, 
  useState 
} from "react"

export default function Race() {

    // Socket.io setup & calls
    const [socket, setSocket] = useState<Socket>()
    useEffect(() => { setSocket(SocketHelper.init()) }, [])
    useEffect(() => {
      if (!socket) return
      socket.emit("get_race_data")
      return () => { 
        socket.off() 
      }
    }, [socket])

    return (
      <>
        <RaceTitle />
        <RaceTable />
      </>
    )
  }
  