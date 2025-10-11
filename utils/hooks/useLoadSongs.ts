import { checkStorage } from "@/Functions/checkStorage";
import clearDB from "@/Functions/clearDB";
import { dbRowToDelta } from "@/Functions/dbRowToDelta";
import { detectNewSongs } from "@/Functions/detectNewSongs";
import { mediaPermissionsRequest } from "@/Functions/mediaPermissionsRequest";
import { processAndCacheMetadata } from "@/Functions/metadataCache";
import { processAllSongs } from "@/Functions/processAllSongs";
import { musicDB } from "@/types/music";
import { MobilePlayer, musicDelta } from "@ohene/flow-player";
import { Directory, Paths } from "expo-file-system";
import { SQLiteDatabase } from "expo-sqlite";

export interface IuseLoadSongs {
  content: musicDelta[];
}

async function useLoadSongs(
  player: MobilePlayer,
  db: SQLiteDatabase,
  setCurrentCount: (currentCount: number) => void,
  setTotalCount: (totalCount: number) => void
): Promise<IuseLoadSongs | null> {
  // clearDB(db);

  const songs = await loadSongs(db, player, setCurrentCount, setTotalCount);

  if (!songs) {
    return null;
  }

  return {
    content: songs,
  };
}

export default useLoadSongs;

async function loadSongs(
  db: SQLiteDatabase,
  player: MobilePlayer,
  setCurrentCount: (currentCount: number) => void,
  setTotalCount: (totalCount: number) => void
): Promise<musicDelta[] | null> {
  const { isDataAvailable } = await checkStorage(db);

  const { granted, media } = await mediaPermissionsRequest();
  if (!granted) return null;

  // If DB is empty → full scan
  if (!isDataAvailable) {
    return await processAllSongs(
      db,
      player,
      media,
      setCurrentCount,
      setTotalCount
    );
  }

  const newSongs = await detectNewSongs(db, media);

  if (newSongs.length > 0) {
    setTotalCount(newSongs.length);
    await processAndCacheMetadata(db, newSongs, player, setCurrentCount);
  }

  const songs: musicDB[] = await db.getAllAsync("SELECT * FROM songs");
  const music: musicDelta[] = songs.map(dbRowToDelta);
  return music;
}
