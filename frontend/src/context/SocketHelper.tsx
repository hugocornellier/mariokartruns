import socketIo from "socket.io-client";

export const SocketHelper = {
    init: () => {
        return socketIo(SocketHelper.getEndPoint(), {
            transports: ["websocket"]
        });
    },

    getEndPoint: () => {
        return window.location.host.indexOf("localhost") >= 0
            ? "http://127.0.0.1:4000"
            : window.location.host;
    }
};
