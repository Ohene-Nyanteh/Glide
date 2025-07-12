import SongRow from "@/components/SongRow";
import { usePlayer } from "@/utils/contexts/PlayerContext";
import { FlatList, Text, View } from "react-native";
import { useEffect } from "react";

function Home() {
  const player = usePlayer();
  return (
    <FlatList
      data={player?.getSongs()}
      keyExtractor={(_, index) => index.toString()}
      // refreshControl={
      //   <RefreshControl refreshing={refresh} onRefresh={refreshData} />
      // }
      renderItem={({ item, index }) => <SongRow song={item} key={index} />}
      contentContainerStyle={{ paddingHorizontal: 16 }}
    />
  );
}
export default Home;
