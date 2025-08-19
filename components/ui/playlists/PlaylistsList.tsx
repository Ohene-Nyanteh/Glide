import { View, Text, Image, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { playlists, thumbnails } from "@/types/db";
import { Entypo, FontAwesome } from "@expo/vector-icons";
import { shortenText } from "@/lib/shortenText";
import { useTheme } from "@/utils/contexts/ThemeContext";
import { Link } from "expo-router";

interface RenderedPlaylist extends playlists {
  thumbnail: string | undefined;
}

export default function PlaylistsList() {
  const db = useSQLiteContext();
  const { theme } = useTheme();
  const [playlists, setPlaylists] = useState<RenderedPlaylist[]>([]);

  const fetchPlaylists = async () => {
    try {
      const plays: playlists[] = await db.getAllAsync(
        "SELECT * FROM playlists"
      );


      const thumbnails: thumbnails[] = await db.getAllAsync(
        "SELECT * FROM thumbnails"
      );

      const playlistsArray: RenderedPlaylist[] = [];
      plays.map((play, index) => {
        const thumbnail = thumbnails.find(
          (thumbnail) => thumbnail.playlist_id === play.id
        );
        playlistsArray.push({
          ...plays[index],
          thumbnail: thumbnail?.image_data,
        });
      });

      setPlaylists(playlistsArray);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPlaylists();
    
  }, []);

  
  return (
    <View className="w-full h-auto">
      <ScrollView
        className="w-full h-auto flex flex-col gap-10"
        scrollEnabled
        showsVerticalScrollIndicator={false}
      >
        {playlists.length > 0 ? (
          playlists.map((playlist, index) => (
            <Link
              href={`/playlist/${playlist.id}/view`}
              id={playlist.id}
              key={index}
              className="mb-2"
            >
              <View
                key={index}
                className="w-full flex flex-row justify-between items-center"
              >
                <View className="flex flex-row gap-4 items-center">
                  {playlist.thumbnail ? (
                    <Image
                      source={{
                        uri: `${playlist.thumbnail}`,
                      }}
                      resizeMode="cover"
                      className="w-16 h-14 rounded"
                    />
                  ) : (
                    <View className="flex flex-row justify-center items-center w-16 h-14 rounded bg-gray-500/40">
                      <FontAwesome name="music" size={20} color="gray" />
                    </View>
                  )}

                  <View className="flex flex-col gap-1">
                    <Text className="dark:text-white text-black font-semibold">
                      {playlist.name}
                    </Text>
                    <Text className="dark:text-gray-300 text-black text-sm">
                      {playlist.length} songs
                    </Text>
                  </View>
                </View>

                <Entypo
                  name="dots-three-vertical"
                  size={20}
                  color={theme.theme === "dark" ? "white" : "black"}
                />
              </View>
            </Link>
          ))
        ) : (
          <Text className="dark:text-white text-black">No Playlists Found</Text>
        )}
      </ScrollView>
    </View>
  );
}
