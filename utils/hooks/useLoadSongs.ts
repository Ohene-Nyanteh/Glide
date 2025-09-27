import { checkStorage } from "@/Functions/checkStorage";
import clearDB from "@/Functions/clearDB";
import { mediaPermissionsRequest } from "@/Functions/mediaPermissionsRequest";
import { processAndCacheMetadata } from "@/Functions/metadataCache";
import { musicDB } from "@/types/music";
import { MobilePlayer, musicDelta } from "@ohene/flow-player";
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
  const { content, isDataAvailable } = await checkStorage(db);
  if (!isDataAvailable) {
    const { granted, media } = await mediaPermissionsRequest();
    if (!granted) {

      return null;
    }

    const data: musicDelta[] = media.map((asset, index) => {
      return {
        music_path: asset.uri,
        duration: asset.duration,
        file_name: asset.filename,
        id: index + 1,
        metadata: {
          name: asset.filename,
          album: "",
          artist: "",
          image: asset.uri,
          dateModified: asset.modificationTime.toString(),
          duration: asset.duration,
          genre: "",
        },
      };
    });

    setTotalCount(data.length);
    await processAndCacheMetadata(db, data, player, setCurrentCount);
    const songs: musicDB[] = await db.getAllAsync("SELECT * FROM songs");
    const music: musicDelta[] = songs.map((song) => {
      return {
        music_path: song.music_path,
        duration: song.duration,
        file_name: song.music_path,
        isFavorite: song.favourite === 1 ? true : false,
        id: song.id,
        metadata: {
          name: song.name,
          album: song.album,
          artist: song.artist,
          image: song.image,
          dateModified: song.dateModified,
          duration: song.duration,
          genre: song.genre,
        },
      };
    });

    return music;
  }

  setCurrentCount(0);
  return content;
}
