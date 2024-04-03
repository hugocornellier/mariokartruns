import React, { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { SocketHelper } from "./context/SocketHelper";
import Router from "./component/Router";

function App() {
    const [socket, setSocket] = useState<Socket | undefined>();

    useEffect(() => {
        const initializedSocket: Socket = SocketHelper.init();
        setSocket(initializedSocket);

        return () => {
            if (socket) {
                socket.off();
            }
        };
    }, []);

    return (
        <Router socket={socket} />
    );
}

export default App;
