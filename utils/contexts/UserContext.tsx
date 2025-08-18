import { createContext, useContext } from "react";
import { usePersistedState } from "../hooks/usePersistedState";
import { User } from "@/types/user";

const UserContext = createContext<{
  user: User | null;
  setUser: (user: User) => void;
}>({ user: {    name: "Anonymous",
    email: "unknown@gmail.com",
    avatar: "https://i.pravatar.cc/150?img=1",}, setUser: () => {} });

export function useUser() {
  if (useContext(UserContext).user === null) {
    throw new Error("UserContext not found");
  }
  return useContext(UserContext);
}

function UserContextProvider({ children }: any) {
  const [user, setUser] = usePersistedState<User>("user", {
    name: "Anonymous",
    email: "unknown@gmail.com",
    avatar: "https://i.pravatar.cc/150?img=1",
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
export default UserContextProvider;
