import React, { useRef, useEffect, useState, useMemo, useCallback } from "react";
import { View, FlatList, Animated, Easing } from "react-native";
import { ParsedLyricLine } from "@/lib/parseLyrics";
import { useMediaAudio } from "@/utils/contexts/AudioPlayerContext";

export interface LyricsPlayerProps {
  lyrics: ParsedLyricLine[];
}

const LyricsPlayer: React.FC<LyricsPlayerProps> = ({ lyrics }) => {
  const audioPlayer = useMediaAudio();
  const listRef = useRef<FlatList<any>>(null);

  const [currentTime, setCurrentTime] = useState(
    audioPlayer.player?.currentTime ?? 0
  );

  const playbackStartTime = useRef<number | null>(null);
  const playbackStartPosition = useRef<number>(0);
  const lastKnownPosition = useRef<number>(0);
  const lastUpdate = useRef<number>(0);

  const hasTimestamps = useMemo(
    () => lyrics.some((line) => line.time !== null),
    [lyrics]
  );

  useEffect(() => {
    const newPosition = audioPlayer.player?.currentTime ?? 0;

    // Update last known position and reset interpolation on significant jumps
    if (Math.abs(newPosition - lastKnownPosition.current) > 0.5) {
      playbackStartTime.current = performance.now();
      playbackStartPosition.current = newPosition;
    }
    
    // Always track the last known position
    lastKnownPosition.current = newPosition;
  }, [audioPlayer.player?.currentTime]);

  useEffect(() => {
    if (!hasTimestamps) return;
    
    const isPlaying = audioPlayer.player?.playing;
    
    // Stop RAF loop when paused
    if (!isPlaying) {
      playbackStartTime.current = null;
      setCurrentTime(audioPlayer.player?.currentTime ?? 0);
      return;
    }

    let rafId: number;

    const updateTime = () => {
      if (playbackStartTime.current === null) {
        playbackStartTime.current = performance.now();
        playbackStartPosition.current = audioPlayer.player?.currentTime ?? 0;
      }

      const elapsedMs = performance.now() - playbackStartTime.current;
      const interpolatedTime = playbackStartPosition.current + elapsedMs / 1000;

      if (Math.abs(interpolatedTime - lastUpdate.current) > 0.05) {
        setCurrentTime(interpolatedTime);
        lastUpdate.current = interpolatedTime;
      }

      rafId = requestAnimationFrame(updateTime);
    };

    rafId = requestAnimationFrame(updateTime);
    return () => cancelAnimationFrame(rafId);
  }, [audioPlayer.player?.playing, hasTimestamps, audioPlayer.player?.currentTime]);

  /** 🎯 Determine active lyric line */
  const currentIndex = useMemo(() => {
    if (!hasTimestamps) return -1;

    const lookAheadTime = currentTime + 0.4;
    for (let i = lyrics.length - 1; i >= 0; i--) {
      if (lookAheadTime >= (lyrics[i].time ?? 0)) {
        return i;
      }
    }
    return 0;
  }, [currentTime, hasTimestamps, lyrics]);

  const prevIndexRef = useRef(-1);

  /** 🧭 Smooth scrolling to active line (debounced) */
  useEffect(() => {
    if (!hasTimestamps || currentIndex < 0 || !listRef.current) return;
    if (currentIndex === prevIndexRef.current) return;

    const timeout = setTimeout(() => {
      try {
        listRef.current?.scrollToIndex({
          index: currentIndex,
          animated: prevIndexRef.current !== -1,
          viewPosition: 0.35,
        });
      } catch {
        // Avoid FlatList out-of-range errors
      }
      prevIndexRef.current = currentIndex;
    }, 80);

    return () => clearTimeout(timeout);
  }, [currentIndex, hasTimestamps]);

  /** 🎨 Animated fade values (reset when lyrics change) */
  const fadeAnims = useMemo(
    () => lyrics.map(() => new Animated.Value(0.15)),
    [lyrics]
  );

  /** 💡 Animate opacity around current line */
  useEffect(() => {
    if (!hasTimestamps || currentIndex < 0) return;

    const startIdx = Math.max(0, currentIndex - 2);
    const endIdx = Math.min(lyrics.length - 1, currentIndex + 2);

    for (let i = startIdx; i <= endIdx; i++) {
      const target = i === currentIndex ? 1 : i < currentIndex ? 0.5 : 0.2;

      fadeAnims[i].stopAnimation(() => {
        Animated.timing(fadeAnims[i], {
          toValue: target,
          duration: 200,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }).start();
      });
    }
  }, [currentIndex, fadeAnims, hasTimestamps, lyrics.length]);

  /** 🧩 Render lyric line */
  const renderItem = useCallback(
    ({ item, index }: { item: ParsedLyricLine; index: number }) => {
      const isCurrent = index === currentIndex;

      return (
        <Animated.Text
          style={{
            opacity: fadeAnims[index],
            fontSize: isCurrent ? 24 : 17,
            color: isCurrent ? "#1E90FF" : "#FFFFFF",
            textAlign: "center",
            fontWeight: isCurrent ? "700" : "400",
            paddingVertical: 6,
            lineHeight: isCurrent ? 32 : 26,
          }}
        >
          {item.text}
        </Animated.Text>
      );
    },
    [currentIndex, fadeAnims]
  );

  return (
    <View className="flex-1 w-full h-full items-center justify-center">
      <FlatList
        ref={listRef}
        data={lyrics}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingVertical: 120 }}
        getItemLayout={(_, index) => ({
          length: 38,
          offset: 38 * index,
          index,
        })}
        windowSize={15}
        maxToRenderPerBatch={15}
        initialNumToRender={20}
        updateCellsBatchingPeriod={30}
        removeClippedSubviews
        onScrollToIndexFailed={(info) => {
          setTimeout(() => {
            listRef.current?.scrollToIndex({
              index: info.index,
              animated: false,
              viewPosition: 0.35,
            });
          }, 100);
        }}
      />
    </View>
  );
};

export default LyricsPlayer;