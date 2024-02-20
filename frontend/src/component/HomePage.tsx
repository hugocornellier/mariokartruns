import React, { useState } from "react";
import JoinModal from "./JoinModal";
import Chat from "./Chat";

function HomePage() {
  const [isChat, setIsChatting] = useState<boolean>(false);
  return (
    <div className=" h-full w-full text-white">
      {!isChat ? <JoinModal setIsChatting={setIsChatting} /> : <Chat />}
    </div>
  );
}

export default HomePage;
