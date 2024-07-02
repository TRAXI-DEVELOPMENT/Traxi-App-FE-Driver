import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getDriverProfile } from "@/api/Driver/Driver";
import useAuth from "@/hooks/useAuth";
import { DriverProfile as DriverProfileType } from "@/types/Driver";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { formatBirthday } from "@/utils/format";

export default function DriverProfile() {
  const [driverProfile, setDriverProfile] = useState<DriverProfileType | null>(
    null
  );
  const [userExists, setUserExists] = useState(true);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();
  const navigation = useNavigation();

  const router = useRouter();
  const goToProfile = () => {
    router.push("/(tabs)/profile/DriverProfileDetail");
  };

  useEffect(() => {
    navigation.setOptions({ headerShown: false });

    const checkUserInfo = async () => {
      try {
        const userInfo = await AsyncStorage.getItem("USER_INFO");
        const driverInfo = userInfo ? JSON.parse(userInfo) : null;

        const driverId = driverInfo?.id;

        if (driverId) {
          const data = await getDriverProfile(driverId);
          setDriverProfile(data);
        }

        if (!userInfo) {
          setUserExists(false);
        }
      } catch (error) {
        console.error("Không thể lấy thông tin tài xế:", error);
      } finally {
        setLoading(false);
      }
    };

    checkUserInfo();
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#12aae2" />
      </View>
    );
  }

  if (!userExists) {
    return (
      <View style={styles.container}>
        <Text>No user information found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.outerContainer}>
      <View style={styles.profileHeader}>
        {driverProfile && (
          <View style={{ flexDirection: "row" }}>
            <Image
              source={{
                uri:
                  driverProfile.ImageUrl ||
                  "https://res.cloudinary.com/dtl7s29go/image/upload/v1719893155/soic9qbgyyxlso3uhmcr.png",
              }}
              style={styles.avatar}
            />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{driverProfile.FullName}</Text>
              <Text style={styles.profileBirthDay}>
                {formatBirthday(driverProfile.Birthday)}
              </Text>
            </View>
          </View>
        )}
      </View>
      <View style={styles.container}>
        <View style={styles.profileOptions}>
          <Pressable onPress={goToProfile} style={styles.optionItem}>
            <FontAwesome name="address-card" size={20} color="#12aae2" />
            <Text style={styles.optionText}>Hồ sơ người dùng</Text>
          </Pressable>
          <TouchableOpacity style={styles.optionItem}>
            <FontAwesome name="support" size={20} color="#12aae2" />
            <Text style={styles.optionText}>Trợ giúp</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionItem} onPress={logout}>
            <FontAwesome name="sign-out" size={20} color="#12aae2" />
            <Text style={styles.optionText}>Đăng xuất</Text>
          </TouchableOpacity>
          <View style={styles.versionContainer}>
            <Text style={styles.versionText}>Phiên bản</Text>
            <Text style={styles.versionNumber}>1.0.0</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  container: {
    flex: 1,
    padding: 20,
  },
  profileHeader: {
    flexDirection: "row",
    backgroundColor: "#12aae2",
    paddingTop: 50,
    paddingBottom: 30,
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    alignItems: "center",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 10,
    backgroundColor: "#fff",
  },
  profileInfo: {
    justifyContent: "center",
    marginLeft: 10,
  },
  profileName: {
    fontSize: 20,
    fontFamily: "Averta",
    color: "#fff",
  },
  profileBirthDay: { fontSize: 16, color: "#fff", fontFamily: "AvertaRegular" },
  profileOptions: {},
  optionItem: {
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    flexDirection: "row",
    alignItems: "center",
  },
  optionText: {
    fontSize: 18,
    marginLeft: 10,
  },
  versionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  versionText: {
    fontSize: 18,
  },
  versionNumber: {
    fontSize: 18,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
