import { musicDelta } from "@ohene/flow-player/dist/types/music";
import * as FileSystem from "expo-file-system";

export const checkStorage = async () => {
  const fileUri = FileSystem.documentDirectory + "data.json";
  const fileInfo = await FileSystem.getInfoAsync(fileUri);

  if (fileInfo.exists) {
    // read file
    const content = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.UTF8, // Read as UTF-8 text
    });

    if (content.length > 0) {
      const parsedContent: musicDelta[] = JSON.parse(content);
      return { isDataAvailable: true, content: parsedContent };
    } else {
      return { isDataAvailable: false, content: [] };
    }
  } else {
    return { isDataAvailable: false, content: [] };
  }
};
