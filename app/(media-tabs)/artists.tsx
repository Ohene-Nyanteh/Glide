
import ArtistTile from '@/components/ui/artist/ArtistTile';
import { FlashList } from '@shopify/flash-list';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Text, View } from 'react-native'

export default function Artists() {
  const [loading, setLoading] = useState<boolean>(true);
  const [artists, setartists] = useState<{ artist: string; image: string }[]>([]);
  const db = useSQLiteContext();

  const getartists = async () => {
    const res: { artist: string; image: string }[] | null = await db.getAllAsync(
      "SELECT artist, image FROM songs GROUP BY artist ORDER BY COUNT(id) DESC"
    );
    if (res) {
      setartists(res);
      setLoading(false);
    }
  };

  useEffect(() => {
    getartists();
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
              Artists ({artists.length})
            </Text>
          )}
          data={artists}
          numColumns={2}
          keyExtractor={(_, index) => index.toString()}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          renderItem={({ item }) => (
            <ArtistTile artist={item.artist} image={item.image} />
          )}
          contentContainerStyle={{
            paddingBottom: 20,
          }}
        />
      </View>
    </View>
  );
}
