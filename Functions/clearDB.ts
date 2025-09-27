import { SQLiteDatabase } from "expo-sqlite";

export default async function clearDB(db: SQLiteDatabase) {
  await db.execAsync(`DELETE FROM songs`);
  await db.execAsync(`DELETE FROM playlists`);
  await db.execAsync(`DELETE FROM playlist_songs`);
  await db.execAsync(`DELETE FROM thumbnails`);
  await db.execAsync(`DELETE FROM settings`);
}
