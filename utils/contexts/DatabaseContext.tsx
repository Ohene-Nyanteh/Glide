import { MobilePlayer, PlaylistDelta } from "@ohene/flow-player";
import { SQLiteProvider, type SQLiteDatabase } from "expo-sqlite";
import { Suspense } from "react";
import { Text } from "react-native";

function DatabaseContextProvider({ children }: { children: React.ReactNode }) {
  const migrate = async (db: SQLiteDatabase) => {
    try {
      await db.execAsync(`PRAGMA foreign_keys = ON`);

      // Songs table
      await db.execAsync(`CREATE TABLE IF NOT EXISTS songs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            file_name TEXT,
            music_path TEXT,
            name TEXT,
            album TEXT,
            artist TEXT,
            image TEXT,
            favourite INTEGER DEFAULT 0,
            dateModified TEXT,
            duration INTEGER,
            genre TEXT
        )`);

      // Playlists table
      await db.execAsync(`
            CREATE TABLE IF NOT EXISTS playlists (
                id TEXT PRIMARY KEY,
                name TEXT,
                length INTEGER,
                about TEXT
            );
            `);

      // Playlist songs table
      await db.execAsync(`CREATE TABLE IF NOT EXISTS playlist_songs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            playlist_id TEXT,
            song_id INTEGER,
            position INTEGER,
            FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE CASCADE,
            FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE
            );`);

      // Thumbnails table
      await db.execAsync(`CREATE TABLE IF NOT EXISTS thumbnails (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            playlist_id TEXT,
            image_data TEXT,
            FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE CASCADE
        )`);

      // General settings table
      await db.execAsync(`CREATE TABLE IF NOT EXISTS settings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            repeat TEXT,
            shuffle TEXT,
            currentPlayingID INTEGER,
            FOREIGN KEY (currentPlayingID) REFERENCES songs(id) ON DELETE SET NULL
        )`);

    } catch (error) {
      console.error("Migration error:", error);
    }
  };

  return (
    <Suspense fallback={<Text>Loading...</Text>}>
      <SQLiteProvider
        databaseName="glide.db"
        onInit={migrate}
        useSuspense
        options={{ useNewConnection: true }}
      >
        {children}
      </SQLiteProvider>
    </Suspense>
  );
}

export default DatabaseContextProvider;
