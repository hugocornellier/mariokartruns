import React from "react";
import Input from "./common/Input";
import Button from "./common/Button";
import { useUser } from "../context/UserProvider";

interface JoinModalProps {
  setIsChatting: (state: boolean) => void;
}
function JoinModal({ setIsChatting }: JoinModalProps) {
  const onSubmit = () => {
    if (name !== "") {
      setIsChatting(true);
    }
  };

  const { name, setName } = useUser();
  return (
    <div className="relative w-full h-screen m-auto flex items-center justify-center">
      <form
        className=" bg-zinc-900 w-[500px] h-[250px]  rounded-2xl  px-8 flex flex-col justify-around"
        onSubmit={onSubmit}
      >
        <div className="flex flex-col gap-2">
          <span className="text-sm text-zinc-400 ">Enter your username</span>
          <Input
            fullWidth
            name="name"
            placeholder="Ex: John Smith"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <Button variant="primary" fullWidth onClick={onSubmit}>
          <span className="text-lg">Let's Chat</span>
        </Button>
      </form>
    </div>
  );
}

export default JoinModal;
