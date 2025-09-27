import { createContext, useContext, useEffect } from "react";
import { AudioModule, AudioPlayer, useAudioPlayer } from "expo-audio";

const AudioContext = createContext<{ player: AudioPlayer | null }>({
  player: null,
});

export function useAudioPlayerContext(): { player: AudioPlayer | null } {
  return useContext(AudioContext);
}

function AudioContextProvider({ children }: any) {
  const player = useAudioPlayer("");

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
    <AudioContext.Provider value={{ player }}>{children}</AudioContext.Provider>
  );
}
export default AudioContextProvider;
