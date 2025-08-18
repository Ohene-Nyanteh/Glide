export type music = {
  name: string;
  album: string;
  artist: string;
  dateModified: string;
  duration: number;
  genre: string;
  image: string;
};


export type musicDB = {
  id: number;
  music_path: string;
  file_name: string;
  name: string;
  album: string;
  artist: string;
  image: string;
  dateModified: string;
  duration: number;
  genre: string;
}