import { Image, StyleSheet, Platform, Button } from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import { getDriverProfile } from "@/api/Auth/Driver/Driver";
import { DriverProfile } from "@/types/Driver";
import useAuth from "@/hooks/useAuth";

export default function HomeScreen() {
  const [userExists, setUserExists] = useState(true);
  const [driverProfile, setDriverProfile] = useState<DriverProfile | null>(null);
  const { logout } = useAuth();

  useEffect(() => {
    const checkUserInfo = async () => {
      const userInfo = await AsyncStorage.getItem("USER_INFO");
      const driverInfo = userInfo ? JSON.parse(userInfo) : null;
      const driverId = driverInfo?.id;

      if (driverId) {
        getDriverProfile(driverId)
          .then((data) => {
            setDriverProfile(data.result);
          })
          .catch((error) => {
            console.error("Không thể lấy thông tin tài xế:", error);
          });
      }

      if (!userInfo) {
        setUserExists(false);
      }
    };

    checkUserInfo();
  }, []);

  if (!userExists) {
    return <Redirect href="/signin" />;
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        {driverProfile && (
          <ThemedText type="title" style={styles.driverName}>
            Welcome! {driverProfile.FullName}
          </ThemedText>
        )}
        <HelloWave />
        <Button title="Đăng xuất" onPress={logout} color="#D9534F" />
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    justifyContent: "space-between",
  },
  driverName: {
    fontSize: 14,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
