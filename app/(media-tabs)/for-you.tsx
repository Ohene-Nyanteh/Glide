import RecommendedSection from "@/components/ui/for-you/Albums";
import Artists from "@/components/ui/for-you/Artists";
import SongsSnippets from "@/components/ui/for-you/SongsSnippets";
import React from "react";
import { ScrollView, View } from "react-native";

export default function ForMe() {
  return (
    <View className="flex-1">
      <ScrollView className="w-full h-full dark:bg-black" contentContainerStyle={{ paddingBottom: 150, display: "flex", flexDirection: "column", gap: 20 }}>
        <RecommendedSection />
        <SongsSnippets />
        <Artists />
      </ScrollView>
    </View>
  );
}
