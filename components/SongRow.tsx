import { usePlayer } from "@/utils/contexts/PlayerContext";
import type { musicDelta } from "@ohene/flow-player";
import { useEffect, useState } from "react";
import { Image, View, Text } from "react-native";

function SongRow({ song }: { song: musicDelta }) {
  const player = usePlayer();
  const [metadata, setMetadata] = useState<musicDelta["metadata"]>();

  useEffect(() => {
    async function loadMetadata() {
      const meta = await player?.getExpoSongMetadata(song);
      setMetadata({
        name: meta?.metadata.name as any,
        album: meta?.metadata.album as any,
        artist: meta?.metadata.artist as any,
        image: meta?.metadata.artwork as any,
        dateModified: "",
        duration: 0,
        genre: ""
      });
    }

    loadMetadata();
  }, []);
  return (
    <View className="flex flex-row justify-between px-4">
      <Text>{metadata?.name}</Text>
      <Text>{metadata?.image}</Text>
    </View>
  );
}
export default SongRow;
