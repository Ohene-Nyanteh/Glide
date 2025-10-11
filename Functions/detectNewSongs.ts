import { musicDelta } from "@ohene/flow-player";
import { SQLiteDatabase } from "expo-sqlite";

export async function detectNewSongs(db: SQLiteDatabase, media: any[]): Promise<musicDelta[]> {
  const existing: { music_path: string }[] = await db.getAllAsync("SELECT music_path FROM songs");
  const existingPaths = new Set(existing.map((s) => s.music_path));

  const newFiles = media.filter((asset) => !existingPaths.has(asset.uri));

  const newSongs: musicDelta[] = newFiles.map((asset, index) => ({
    music_path: asset.uri,
    duration: asset.duration,
    file_name: asset.filename,
    id: Date.now() + index, // temporary ID until DB assigns one
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

  return newSongs;
}
