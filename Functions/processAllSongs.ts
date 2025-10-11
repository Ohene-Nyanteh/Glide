import { MobilePlayer, musicDelta } from "@ohene/flow-player";
import { SQLiteDatabase } from "expo-sqlite";
import { processAndCacheMetadata } from "./metadataCache";
import { musicDB } from "@/types/music";
import { dbRowToDelta } from "./dbRowToDelta";

export async function processAllSongs(
  db: SQLiteDatabase,
  player: MobilePlayer,
  media: any[],
  setCurrentCount: (currentCount: number) => void,
  setTotalCount: (totalCount: number) => void
) {
  const data: musicDelta[] = media.map((asset, index) => ({
    music_path: asset.uri,
    duration: asset.duration,
    file_name: asset.filename,
    id: index + 1,
    metadata: {
      name: asset.filename,
      album: "",
      artist: "",
      image: asset.uri,
      dateModified: asset.modificationTime?.toString() ?? "",
      duration: asset.duration,
      genre: "",
    },
  }));

  setTotalCount(data.length);
  await processAndCacheMetadata(db, data, player, setCurrentCount);

  const songs: musicDB[] = await db.getAllAsync("SELECT * FROM songs");
  return songs.map(dbRowToDelta);
}
