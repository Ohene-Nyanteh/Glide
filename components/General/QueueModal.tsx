import { View, Text, Modal, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { musicDelta } from "@ohene/flow-player";
import { usePlayer } from "@/utils/contexts/PlayerContext";
import { FlashList } from "@shopify/flash-list";
import QueueSong from "./QueueSong";
import {
  Gesture,
  Directions,
  GestureDetector,
} from "react-native-gesture-handler";

export default function QueueModal({
  setShow,
}: {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [queueSongs, setQueueSongs] = useState<musicDelta[] | null>(null);
  const PlayerContext = usePlayer();

  const swipeDown3 = Gesture.Fling()
    .runOnJS(true)
    .direction(Directions.DOWN)
    .onEnd(() => {
      setShow(false);
    });

  useEffect(() => {
    const songs = PlayerContext?.queue?.getSongs();
    if (songs) {
      setQueueSongs(songs);
    }
  }, [PlayerContext?.queue]);

  return (
    <Modal className="w-full h-full" transparent animationType="slide">
      <Pressable
        onPress={() => setShow(false)}
        className="w-full h-full bg-black/40 flex flex-col justify-end"
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          className="w-full h-[80%] bg-white dark:bg-zinc-900 rounded-t-xl  flex flex-col gap-5 "
        >
          <GestureDetector gesture={swipeDown3}>
            <View className="flex flex-col py-3 w-full justify-between rounded-t-xl items-center gap-3 bg-gray-200 dark:bg-zinc-900 border-b dark:border-zinc-800">
              <View className="w-10 h-1 rounded-full bg-gray-400" />
              <Text className="dark:text-white text-center">
                Now Playing (Queue)
              </Text>
            </View>
          </GestureDetector>
          <View className="w-full h-full px-4">
            {queueSongs?.length === 0 ? (
              <Text className="dark:text-white text-center">
                Queue is Empty
              </Text>
            ) : (
              <FlashList
                data={queueSongs}
                renderItem={({ item }) => <QueueSong song={item} />}
                keyExtractor={(_, index) => index.toString()}
                ItemSeparatorComponent={() => <View style={{ height: 1 }} />}
                contentContainerStyle={{
                  paddingHorizontal: 16,
                  paddingBottom: 20,
                }}
                estimatedItemSize={50}
              />
            )}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
