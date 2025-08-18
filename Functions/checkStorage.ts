import { musicDB } from "@/types/music";
import { musicDelta } from "@ohene/flow-player";
import { SQLiteDatabase, useSQLiteContext } from "expo-sqlite";

export const checkStorage = async (db: SQLiteDatabase) => {
  try {
    const songs: musicDB[] = await db.getAllAsync("SELECT * FROM songs");
    if (songs.length > 0) {
      const content: musicDelta[] = songs.map((song) => {
        return {
          music_path: song.music_path,
          duration: song.duration,
          file_name: song.music_path,
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
      return { isDataAvailable: true, content: content };
    } else {
      return { isDataAvailable: false, content: [] };
    }
  } catch (error) {
    return { isDataAvailable: false, content: [] };
  }
};
