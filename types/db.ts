export type extras = {
    id: number;
    name: string;
    songs: string;
}

export type playlists = {
    id: string;
    name: string;
    about: string;
    length: number
}

export type settings = {
    repeat: "all" | "single" | "none" | "repeatBy",
    shuffle: boolean,
    currentPlayingID: number | null,
    id: number
}

export type playlist_songs = {
    id: number;
    playlist_id: string;
    song_id: number;
    position: number;
}

export type thumbnails = {
    id: number;
    playlist_id: string;
    image_data: string;
}

export type songs = {
    id: number;
    file_name: string;
    music_path: string;
    name: string;
    album: string;
    artist: string;
    image: string;
    dateModified: string;
    duration: number;
    genre: string;
}