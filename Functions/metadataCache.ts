// utils/metadataCache.ts
import { MobilePlayer, musicDelta } from "@ohene/flow-player";
import { SQLiteDatabase } from "expo-sqlite";

export async function processAndCacheMetadata(
  db: SQLiteDatabase,
  songList: musicDelta[],
  player: MobilePlayer,
  setCurrentCount: (currentCount: number) => void
) {
  const cache: Record<string, any> = {};
  let index = 0;
  const metadataParser = new MobilePlayer([])
  for (const song of songList) {
    const id = song.id || `song-${index}`;

    try {
      const meta = await metadataParser.getExpoSongMetadata(song);
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
          "Music",
        ]
      );

      cache[id] = {
        name: meta?.metadata.name ?? song.file_name ?? "Unknown Name",
        album: meta?.metadata.album ?? "Unknown Album",
        artist: meta?.metadata.artist ?? "Unknown Artist",
        duration: song.metadata?.duration ?? 0,
        dateModified: song.metadata?.dateModified ?? "Unknown Date Modified",
        genre: meta?.metadata.name ?? "Unknown Genre",
        image: imagebase64,
      };
    } catch (err) {
      console.warn("Metadata parse error:", err);
    }

    index++;
    setCurrentCount(index);
  }
}
