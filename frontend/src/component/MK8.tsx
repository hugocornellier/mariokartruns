import { useEffect, useState } from "react";
import socketIo from "socket.io-client";
import { Socket } from "socket.io-client";
import {
  Route,
  Link,
} from "react-router-dom";

const ENDPOINT = window.location.host.indexOf("localhost") >= 0
    ? "http://127.0.0.1:4000"
    : window.location.host

export default function MK8() {

  const [unique, setUnique] = useState<any[]>();
  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    let socket = socketIo(ENDPOINT, { 
      transports: ["websocket"] 
    })
    setSocket(socket)
    socket.emit("setup")
    return () => { 
      socket.off() 
    }
  }, []);

  useEffect(() => {
    if (!socket) {
      return
    }
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
  }, [socket]);

  return (
    <div className=" h-full w-full text-black">
      {!unique 
        ? <div>Loading...</div> 
        : (
        <div>
          <div className="mb-5">
            Select a Mario Kart 8 race:
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
  );
}
