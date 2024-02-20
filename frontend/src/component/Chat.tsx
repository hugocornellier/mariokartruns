import { useEffect, useState } from "react";
import Input from "./common/Input";
import { BsFillSendFill } from "react-icons/bs";
import { GoPaperclip } from "react-icons/go";
import { IoMdCall } from "react-icons/io";
import { IoVideocam } from "react-icons/io5";
// import { useSocket } from "../context/SocketProvider";
import { useUser } from "../context/UserProvider";
import socketIo from "socket.io-client";
import { Socket } from "socket.io-client";
const ENDPOINT = window.location.host.indexOf("localhost") >= 0
    ? "http://127.0.0.1:4000"
    : window.location.host

function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any>([]);
  const [id, setId] = useState<any>();
  const [socket, setSocket] = useState<Socket>();
  // const { sendMessage, messages } = useSocket();
  const { name } = useUser();

  const handleSentMessage = (e: any) => {
    e.preventDefault();
    if (message === "" || !socket) return;
    socket.emit("message", { message, id: socket.id });
    console.log("horar e");
    setMessage("");
  };

  useEffect(() => {

    let _socket = socketIo(ENDPOINT, { transports: ["websocket"] });

    _socket.on("connect", () => {
      // alert("Connected");
      setId(_socket.id);
    });
    setSocket(_socket);
    _socket.emit("setup", { user: name });

    _socket.on("welcome", (data) => {
      setMessages([...messages, data]);
      console.log(data.user, data.message);
    });

    _socket.on("userJoined", (data) => {
      setMessages([...messages, data]);
      console.log(data.user, data.message);
    });

    _socket.on("leave", (data) => {
      setMessages([...messages, data]);
      console.log(data.user, data.message);
    });

    return () => {
      _socket.off();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (!socket) return;

    socket.on("sendMessage", (data: any) => {
      setMessages([...messages, data]);
      console.log(data.user, data.message, data.id);
    });
    return () => {
      socket.off();
    };
  }, [messages, socket]);
  return (
    <div className="sm:w-4/5 w-11/12 min-h-screen mx-auto  md:pt-20 pt-16 ">
      <div className="flex  h-full flex-col  bg-zinc-900  rounded-lg">
        <div className=" h-[600px]       flex flex-col">
          {/* header */}
          <div className="px-4 pt-3 flex  justify-between  items-center">
            <div className="flex gap-4 items-center h-full ">
              <div className=" relative rounded-full overflow-hidden ">
                <img
                  src="/profile/group2.png"
                  alt="profile_picture"
                  className="rounded-full w-12 h-12 object-cover"
                />
              </div>
              <div>
                <p className="text-lg">Chat group</p>
                <p className="text-zinc-400">last seen recently</p>
              </div>
            </div>
            <div className=" gap-5 pr-4 p-4 md:flex hidden">
              <div className="p-3 rounded-full hover:bg-zinc-700 transition-all ease-in-out duration-500 cursor-pointer">
                <IoMdCall size={24} className=" " />
              </div>
              <div className="p-3 rounded-full hover:bg-zinc-700 transition-all ease-in-out duration-500 cursor-pointer">
                <IoVideocam size={24} className="hover:bg-zinc-600 " />
              </div>
            </div>
          </div>
          {/* Messages */}
          <div className=" h-[510px] p-4">
            <div className="w-full h-full flex flex-col gap-4 items-start	overflow-y-auto">
              {messages?.map((message: any, index: number) => {
                console.log(message);

                return (
                  <div
                    key={index}
                    className={`flex gap-2 first:mt-auto ${
                      message.id === id ? "self-end  " : "self-start "
                    }`}
                  >
                    {message.id !== id && message.user !== "Admin" && (
                      <div className="bg-black text-white p-2 rounded-full w-10 h-10 flex items-center justify-center">
                        <span className="uppercase">{message?.user[0]}</span>
                      </div>
                    )}

                    <div
                      className={`px-4 py-2 rounded-lg     rounded-br-none  ${
                        message.id === id ? "  bg-zinc-950" : " bg-primary"
                      }`}
                    >
                      <span>{message.message}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        {/* Action  */}
        <form
          className="  flex items-center pl-4 pr-8 border-transparent  border-t-black border-2  bg-inherit"
          onSubmit={handleSentMessage}
        >
          <div className="flex-1 flex items-center gap-5">
            <GoPaperclip className="text-zinc-400 " size={24} />
            <Input
              name="message"
              className="border-none focus:border-none bg-transparent"
              type="text"
              placeholder="Type something..."
              fullWidth
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <button
            className="p-3 rounded-full bg-black cursor-pointer"
            onClick={handleSentMessage}
          >
            <BsFillSendFill className="text-yellow-400" size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chat;
