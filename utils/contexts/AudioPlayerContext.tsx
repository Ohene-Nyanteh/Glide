import {
  createContext,
  useContext,
  useEffect,
} from "react";
import {
  AudioModule,
  AudioPlayer,
  useAudioPlayer,
} from "expo-audio";

const MediaAudioPlayer = createContext<{
  player: AudioPlayer | null;
}>({
  player: null,
});

export function useMediaAudio(): {
  player: AudioPlayer | null;
} {
  return useContext(MediaAudioPlayer);
}

function MediaAudioPlayerProvider({ children }: any) {
    const player = useAudioPlayer();

  useEffect(() => {
    const configureAudio = async () => {
      await AudioModule.setAudioModeAsync({
        shouldPlayInBackground: true,
        interruptionMode: "doNotMix",
        interruptionModeAndroid: "doNotMix",
        playsInSilentMode: true,
      });
    };

    configureAudio();
  }, []);

  return (
    <MediaAudioPlayer.Provider
      value={{ player}}
    >
      {children}
    </MediaAudioPlayer.Provider>
  );
}
export default MediaAudioPlayerProvider;
