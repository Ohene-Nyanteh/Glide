
import * as FileSystem from "expo-file-system";

export const createStorageFile = async (content: string) => {
  const fileUri = FileSystem.documentDirectory + "data.json";
  try {
    await FileSystem.writeAsStringAsync(fileUri, content, {
      encoding: FileSystem.EncodingType.UTF8,
    });
    return true;
  } catch (error) {
    return false;
  }
};
