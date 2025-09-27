import AlbumTile from "@/components/ui/albums/AlbumTile";
import { music } from "@/types/music";
import { FlashList } from "@shopify/flash-list";
import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function Albums() {
  const [loading, setLoading] = useState<boolean>(true);
  const [albums, setAlbums] = useState<{ album: string; image: string }[]>([]);
  const db = useSQLiteContext();

  const getAlbums = async () => {
    const res: { album: string; image: string }[] | null = await db.getAllAsync(
      "SELECT id, album, image FROM songs GROUP BY album ORDER BY COUNT(id) DESC"
    );
    if (res) {
      setAlbums(res);
      setLoading(false);
    }
  };

  useEffect(() => {
    getAlbums();
  }, []);

  if (loading) {
    return (
      <View className="w-full h-full flex-1 dark:bg-black p-6">
        <ActivityIndicator size={"small"} hidesWhenStopped />
      </View>
    );
  }

  return (
    <View className="w-full h-full flex-1 dark:bg-black">
      <View className="w-full h-full flex gap-4 flex-1 py-2 p-2">
        <FlashList
          ListHeaderComponent={() => (
            <Text className="dark:text-white text-2xl px-2">
              Albums ({albums.length})
            </Text>
          )}
          data={albums}
          numColumns={2}
          keyExtractor={(_, index) => index.toString()}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          renderItem={({ item }) => (
            <AlbumTile album={item.album} image={item.image} />
          )}
          contentContainerStyle={{
            paddingBottom: 20,
          }}
        />
      </View>
    </View>
  );
}
