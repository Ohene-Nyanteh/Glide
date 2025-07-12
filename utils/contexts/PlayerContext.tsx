import { createContext, useContext, useEffect, useState } from "react";
import { MobilePlayer, type musicDelta } from "@ohene/flow-player";
import { checkStorage } from "@/Functions/checkStorage";
import { mediaPermissionsRequest } from "@/Functions/mediaPermissionsRequest";
import { createStorageFile } from "@/Functions/createStorageFile";

const PlayerContext = createContext<MobilePlayer | null>(null);

export function usePlayer(): MobilePlayer | null {
  return useContext(PlayerContext);
}

function PlayerContextProvider({ children }: any) {
  const [player, setPlayer] = useState(new MobilePlayer([]));

  async function loadSongs(): Promise<musicDelta[] | null> {
    const { content, isDataAvailable } = await checkStorage();

    if (!isDataAvailable) {
      const { granted, media } = await mediaPermissionsRequest();
      if (!granted) {
        return null;
      }

      const data: musicDelta[] = media.map((asset, index) => {
        return {
          music_path: asset.uri,
          duration: asset.duration,
          id: index,
          stats: { ...asset },
        };
      });
      const stored = await createStorageFile(JSON.stringify(data));
      if (!stored) {
        return null;
      }
      return data;
    }

    return content;
  }

  useEffect(() => {
    loadSongs().then((songs) => {
      if (songs) {
        setPlayer(new MobilePlayer(songs));
      }
    });
  }, []);

  return (
    <PlayerContext.Provider value={player}>{children}</PlayerContext.Provider>
  );
}
export default PlayerContextProvider;
