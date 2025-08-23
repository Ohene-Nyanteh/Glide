import { createContext, useContext, useMemo, useState } from "react";
import { Delta, MobilePlayer } from "@ohene/flow-player";

const PlayerContext = createContext<{
  player: MobilePlayer;
  isloading: boolean;
  queue: Delta;
  setQueue: (queue: Delta) => void;
  setPlayer: (player: MobilePlayer) => void;
  setIsloading: (isloading: boolean) => void;
} | null>(null);

export function usePlayer(): {
  player: MobilePlayer;
  isloading: boolean;
  queue: Delta;
  setQueue: (queue: Delta) => void;
  setPlayer: (player: MobilePlayer) => void;
  setIsloading: (isloading: boolean) => void;
} | null {
  return useContext(PlayerContext);
}

function PlayerContextProvider({ children }: any) {
  const [player, setPlayer] = useState<MobilePlayer>(new MobilePlayer([]));
  const [queue, setQueue] = useState<Delta>(new Delta([]));
  const [isloading, setIsloading] = useState<boolean>(true);

  const value = useMemo(
    () => ({ player, isloading, setPlayer, setIsloading, queue, setQueue }),
    [player, isloading, queue]
  );

  return (
    <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
  );
}
export default PlayerContextProvider;
