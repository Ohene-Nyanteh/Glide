import SongRow from "@/components/General/SongRow";
import Sort from "@/components/General/Sort";
import { usePlayer } from "@/utils/contexts/PlayerContext";
import { FlatList, View, Text, ActivityIndicator } from "react-native";
import { FlashList } from "@shopify/flash-list";

function Songs() {
  const playerContext = usePlayer();

  return (
    <View className="flex flex-col w-full h-full  dark:bg-black">
      <View className="w-full flex flex-row justify-between items-center px-4 py-1">
        <Text className="text-sm dark:text-white">Songs</Text>
        <Sort />
      </View>

      {playerContext?.isloading ? (
        <ActivityIndicator size="large" color="white" hidesWhenStopped />
      ) : (
        <FlashList
          data={playerContext?.player.getSongs()}
          keyExtractor={(_, index) => index.toString()}
          // refreshControl={
          //   <RefreshControl refreshing={refresh} onRefresh={refreshData} />
          // }
          ItemSeparatorComponent={() => <View style={{ height: 3 }} />}
          renderItem={({ item }) => <SongRow song={item} />}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 120 }}
          estimatedItemSize={58}
        />
      )}
    </View>
  );
}
export default Songs;
