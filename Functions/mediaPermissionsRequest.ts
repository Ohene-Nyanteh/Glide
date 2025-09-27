import * as MediaLibrary from "expo-media-library";

export const mediaPermissionsRequest = async (): Promise<{
  granted: boolean;
  media: MediaLibrary.Asset[];
}> => {
  try {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      return { granted: false, media: [] };
    }

    const { assets } = await MediaLibrary.getAssetsAsync({
      mediaType: MediaLibrary.MediaType.audio,
      first: 50,
      sortBy: [MediaLibrary.SortBy.modificationTime],
    });
    return { granted: true, media: assets };
  } catch (error) {
    return { granted: false, media: [] };
  }
};
