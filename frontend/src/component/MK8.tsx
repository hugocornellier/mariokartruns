import { Socket } from "socket.io-client"
import { SocketHelper } from "../context/SocketHelper"
import { 
  useEffect, 
  useState 
} from "react"
import {
  Route,
  Link,
} from "react-router-dom";

export default function MK8() {
  const [unique, setUnique] = useState<any[]>()

  // Socket.io setup
  const [socket, setSocket] = useState<Socket>()
  useEffect(() => { setSocket(SocketHelper.init()) }, [])

  useEffect(() => {
    if (!socket) {
      return
    }
    socket.emit("setup")
    socket.on("sendMessage", (data: any) => {
      let u = []
      for (const d of data) {
        u.push(d.race)
      }
      setUnique(u)
    });
    return () => { 
      socket.off() 
    }
  }, [socket])

  return (
    <div className=" h-full w-full text-black">
      {!unique 
        ? <div>Loading...</div> 
        : (
        <div>
          <div style={{ fontSize: "1.7rem" }} className="mb-5">
            Races
          </div>
          {unique.map((x, i) =>
            <div>
              <Link key={i} to={ "/mk8/" + x.replace(/ /g, "+") }>
                {x}
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
