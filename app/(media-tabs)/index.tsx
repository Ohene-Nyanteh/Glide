import SongRow from "@/components/General/SongRow";
import Sort from "@/components/General/Sort";
import { usePlayer } from "@/utils/contexts/PlayerContext";
import { View, Text, ActivityIndicator } from "react-native";
import { FlashList } from "@shopify/flash-list";
import SongMiniModal from "@/components/General/SongMiniModal";

function Songs() {
  const playerContext = usePlayer();
  return (
    <View className="w-full dark:bg-black relative flex-1">
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
          ItemSeparatorComponent={() => <View style={{ height: 5 }} />}
          renderItem={({ item }) => <SongRow song={item} />}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: 20,
          }}
        />
      )}
    </View>
  );
}
export default Songs;
