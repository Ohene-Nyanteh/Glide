// utils/metadataCache.ts
import { MobilePlayer, musicDelta } from "@ohene/flow-player";
import { Directory, Paths, File, FileHandle } from "expo-file-system";
import * as FileSystem from "expo-file-system/legacy";
import { SQLiteDatabase } from "expo-sqlite";

export async function processAndCacheMetadata(
  db: SQLiteDatabase,
  songList: musicDelta[],
  player: MobilePlayer,
  setCurrentCount: (currentCount: number) => void
) {
  let index = 0;

  for (const song of songList) {
    const id = song.id || `song-${index}`;
    const meta = await player.getExpoSongMetadata(song);
    try {
      let imagebase64 = "";

      if (meta?.metadata.artwork) {
        imagebase64 = meta.metadata.artwork.toString();
      }

      const match = imagebase64.match(/^data:image\/(\w+);base64,(.*)$/);
      let rawBase64: string;
      let format: string;

      if (match) {
        format = match[1];
        rawBase64 = match[2];
      } else {
        format = "png";
        rawBase64 = imagebase64;
      }

      const ext = format === "jpeg" || format === "jpg" ? "jpg" : "png";

      const file = new File(Paths.document, "glideImages", `image-${id}.${ext}`);

      FileSystem.writeAsStringAsync(file.uri, rawBase64, {
        encoding: "base64",
      });

      await db.runAsync(
        `INSERT INTO songs (file_name, music_path, name, album, artist, image, dateModified, duration, genre) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          song.file_name ?? "Unknown Name",
          song.music_path ?? "Unknown Path",
          meta?.metadata.name ?? song.file_name ?? "Unknown Name",
          meta?.metadata.album ?? "Unknown Album",
          meta?.metadata.artist ?? "Unknown Artist",
          file.uri,
          song.metadata?.dateModified ?? "Unknown Date Modified",
          song.metadata?.duration ?? 0,
          "Music",
        ]
      );
    } catch (err) {
      console.warn("Metadata parse error:", err);
    }

    index++;
    setCurrentCount(index);
  }
}
