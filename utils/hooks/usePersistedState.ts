import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Response<T> = [T, React.Dispatch<React.SetStateAction<T>>];

export function usePersistedState<T extends object>(
  key: string,
  initialState: T
): Response<T> {
  const [state, setState] = useState<T>(initialState);

  useEffect(() => {
    (async () => {
      try {
        const storageValue = await AsyncStorage.getItem(key);
        if (storageValue !== null) {
          const parsed = JSON.parse(storageValue);
          if (parsed && typeof parsed === "object" && Object.keys(parsed).length > 0) {
            setState({ ...initialState, ...parsed });
          }
        }
      } catch (error) {
        console.error("Failed to parse AsyncStorage item:", error);
      }
    })();
  }, [key]);

  useEffect(() => {
    AsyncStorage.setItem(key, JSON.stringify(state)).catch((error) =>
      console.error("Failed to save to AsyncStorage:", error)
    );
  }, [key, state]);

  return [state, setState];
}
