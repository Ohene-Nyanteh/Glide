import { createContext, useContext, useMemo, useState } from "react";
import { Delta, MobilePlayer, musicDelta } from "@ohene/flow-player";
import { useSQLiteContext } from "expo-sqlite";
import { music, musicDB } from "@/types/music";

const PlayerContext = createContext<{
  player: MobilePlayer;
  isloading: boolean;
  queue: Delta;
  refresh: () => void;
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
  refresh: () => void;
  setIsloading: (isloading: boolean) => void;
} | null {
  return useContext(PlayerContext);
}

function PlayerContextProvider({ children }: any) {
  const [player, setPlayer] = useState<MobilePlayer>(new MobilePlayer([]));
  const [queue, setQueue] = useState<Delta>(new Delta([]));
  const db = useSQLiteContext();
  const [isloading, setIsloading] = useState<boolean>(true);

  const refresh = async () => {
    const results: musicDB[] | undefined = await db.getAllAsync(
      "SELECT * FROM songs ORDER BY dateModified DESC"
    );

    if (results) {
      const newResults: musicDelta[] = results.map((item) => {
        return {
          music_path: item.music_path,
          file_name: item.file_name,
          duration: item.duration,
          id: item.id,
          name: item.name,
          metadata: {
            album: item.album,
            artist: item.artist,
            genre: item.genre,
            duration: item.duration,
            image: item.image,
            name: item.name,
            dateModified: item.dateModified,
          },
        };
      });

      setPlayer(new MobilePlayer(newResults));
    }
  };

  const value = useMemo(
    () => ({
      player,
      isloading,
      setPlayer,
      setIsloading,
      queue,
      setQueue,
      refresh,
    }),
    [player, isloading, queue]
  );

  return (
    <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
  );
}
export default PlayerContextProvider;
