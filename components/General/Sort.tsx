import { useState } from "react";
import { View, Text, TouchableNativeFeedback } from "react-native";

export default function Sort() {
  const [sort, setSort] = useState("A-Z");
  const [open, setOpen] = useState(false);
  const sortOptions = ["A-Z", "Z-A", "Newest", "Oldest"];
  return (
    <View className="w-auto relative">
      <TouchableNativeFeedback
        onPress={() => setOpen(!open)}
        className="px-4 rounded dark:text-white"
      >
        <Text className="dark:text-white text-sm">Sort: {sort}</Text>
      </TouchableNativeFeedback>

      <View
        className={`${open ? "block" : "hidden"} border rounded border-gray-700 bg-gray-200 dark:bg-blue-950/90 p-2 absolute right-0 top-8 z-10 w-32`}
      >
        {sortOptions.map((option, index) => (
          <TouchableNativeFeedback
            key={index}
            onPress={()=> {setSort(option), setOpen(false)}}
            className="flex flex-row gap-2 items-center"
          >
            <View className="flex flex-row gap-2 py-2 px-4">
              <Text
                className={`${sort === option ? "dark:text-white" : "dark:text-gray-400"} font-semibold`}
              >
                {option}
              </Text>
              <Text
                className={`${sort === option ? "dark:text-white" : "dark:text-gray-400"} font-semibold`}
              >
                ✔
              </Text>
            </View>
          </TouchableNativeFeedback>
        ))}
      </View>
    </View>
  );
}
