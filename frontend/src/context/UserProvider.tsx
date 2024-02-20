import { FC, ReactNode, createContext, useContext, useState } from "react";

interface UserProviderProps {
  children?: ReactNode;
}

interface IUserContext {
  name: string;
  setName: (msg: string) => void;
}
const UserContext = createContext<IUserContext | null>(null);

export const useUser = () => {
  const state = useContext(UserContext);
  if (!state) throw new Error("State is undefined");
  return state;
};

export const UserProvider: FC<UserProviderProps> = ({ children }) => {
  const [name, setName] = useState<string>("");
  return (
    <UserContext.Provider value={{ name, setName }}>
      {children}
    </UserContext.Provider>
  );
};
