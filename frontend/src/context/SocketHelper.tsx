import socketIo from "socket.io-client"

export module SocketHelper {
    export const init = () => {
        return socketIo(SocketHelper.getEndPoint(), { 
            transports: ["websocket"] 
        })
    }

    export const getEndPoint = () => {
        return window.location.host.indexOf("localhost") >= 0
            ? "http://127.0.0.1:4000"
            : window.location.host
    }
}