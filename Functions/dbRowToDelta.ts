import { musicDB } from "@/types/music";
import { musicDelta } from "@ohene/flow-player";

export function dbRowToDelta(song: musicDB): musicDelta {
  return {
    music_path: song.music_path,
    file_name: song.music_path,
    isFavorite: song.favourite === 1,
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
}
