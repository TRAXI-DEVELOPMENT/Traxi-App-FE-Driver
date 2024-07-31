import { Tabs } from "expo-router";
import React, { useCallback } from "react";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useFocusEffect } from "@react-navigation/native";

function useRefreshOnFocus(callback: () => void) {
  useFocusEffect(
    useCallback(() => {
      callback();
    }, [callback])
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Làm việc",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? "car" : "car-outline"} color={color} />
          ),
        }}
        listeners={({ navigation }) => ({
          focus: () => {
            navigation.addListener("focus", () => {
              navigation.navigate("index", { refresh: true });
            });
          },
        })}
      />

      <Tabs.Screen
        name="History"
        options={{
          title: "Lịch sử cuốc",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "time" : "time-outline"}
              color={color}
            />
          ),
        }}
        listeners={({ navigation }) => ({
          focus: () => {
            navigation.addListener("focus", () => {
              navigation.navigate("history", { refresh: true });
            });
          },
        })}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Hồ sơ",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "person" : "person-outline"}
              color={color}
            />
          ),
        }}
        listeners={({ navigation }) => ({
          focus: () => {
            navigation.addListener("focus", () => {
              navigation.navigate("profile", { refresh: true });
            });
          },
        })}
      />
    </Tabs>
  );
}
