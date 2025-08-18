// utils/metadataCache.ts
import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MobilePlayer, musicDelta } from "@ohene/flow-player";
import { SQLiteDatabase, useSQLiteContext } from "expo-sqlite";

const METADATA_KEY = "cachedMetadata";

export async function processAndCacheMetadata(
  db: SQLiteDatabase,
  songList: musicDelta[],
  player: MobilePlayer,
  setCurrentCount: (currentCount: number) => void
) {
  const cache: Record<string, any> = {};
  let index = 0;
  for (const song of songList) {
    const id = song.id || `song-${index}`; // or however you uniquely identify songs

    try {
      
      const meta = await player.getExpoSongMetadata(song);
      let imagebase64 = "";

      if (meta?.metadata.artwork) {
        imagebase64 = meta.metadata.artwork.toString();
      }


      await db.runAsync(
        `INSERT INTO songs (id, file_name, music_path, name, album, artist, image, dateModified, duration, genre) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          index,
          song.file_name ?? "Unknown Name",
          song.music_path ?? "Unknown Path",
          meta?.metadata.name ?? song.file_name ?? "Unknown Name",
          meta?.metadata.album ?? "Unknown Album",
          meta?.metadata.artist ?? "Unknown Artist",
          imagebase64,
          song.metadata?.dateModified ?? "Unknown Date Modified",
          song.metadata?.duration ?? 0,
          meta?.metadata.name ?? "",
        ]
      );

      cache[id] = {
        name: meta?.metadata.name ?? song.file_name ?? "Unknown Name",
        album: meta?.metadata.album ?? "Unknown Album",
        artist: meta?.metadata.artist ?? "Unknown Artist",
        duration: song.metadata?.duration ?? 0,
        dateModified: song.metadata?.dateModified ?? "Unknown Date Modified",
        genre: meta?.metadata.name ?? "",
        image: imagebase64,
      };
    } catch (err) {
      console.warn("Metadata parse error:", err);
    }

    index++;
    setCurrentCount(index);
  }
}
