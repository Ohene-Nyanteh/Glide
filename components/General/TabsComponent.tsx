import { usePathname, Link } from "expo-router";
import { View, Text } from "react-native";

function TabsComponent() {
  const tabs = [
    {
      tab: "For you",
      link: "/for-you",
    },
    {
      tab: "Songs",
      link: "/",
    },
    {
      tab: "Playlists",
      link: "/playlist",
    },
    {
      tab: "Albums",
      link: "/albums",
    },
    {
      tab: "Artists",
      link: "/artists",
    },
  ] as const;

  const pathname = usePathname();
  return (
    <View className="w-full flex flex-row gap-2 px-4 py-2 relative dark:bg-black">
      {tabs.map((tab, index) => (
        <Link href={tab.link} asChild key={index}>
          <Text
            className={`w-fit h-full text-lg p-1 ${tab.link === pathname ? "text-blue-500 border-b border-blue-500" : "text-black dark:text-gray-400"} font-semibold`}
          >
            {tab.tab}
          </Text>
        </Link>
      ))}
    </View>
  );
}

export default TabsComponent;
