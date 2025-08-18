import { createContext, useContext, useMemo, useState } from "react";
import { MobilePlayer, type musicDelta } from "@ohene/flow-player";

const PlayerContext = createContext<{
  player: MobilePlayer;
  isloading: boolean;
  setPlayer: (player: MobilePlayer) => void;
  setIsloading: (isloading: boolean) => void;
} | null>(null);

export function usePlayer(): {
  player: MobilePlayer;
  isloading: boolean;
  setPlayer: (player: MobilePlayer) => void;
  setIsloading: (isloading: boolean) => void;
} | null {
  return useContext(PlayerContext);
}

function PlayerContextProvider({ children }: any) {
  const [player, setPlayer] = useState<MobilePlayer>(new MobilePlayer([]));
  const [isloading, setIsloading] = useState<boolean>(true);

  const value = useMemo(
    () => ({ player, isloading, setPlayer, setIsloading }),
    [player, isloading]
  );

  return (
    <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
  );
}
export default PlayerContextProvider;
