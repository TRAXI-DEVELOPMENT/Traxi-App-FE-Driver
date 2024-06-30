import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Pressable,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getDriverProfile, changeAvatar } from "@/api/Driver/Driver";
import useAuth from "@/hooks/useAuth";
import { DriverProfile as DriverProfileType } from "@/types/Driver";
import { FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { uploadImage } from "@/api/Upload/UpLoadImage";
import { useRouter } from "expo-router";

export default function DriverProfile() {
  const [driverProfile, setDriverProfile] = useState<DriverProfileType | null>(
    null
  );
  const [userExists, setUserExists] = useState(true);
  const { logout } = useAuth();
  const router = useRouter();
  const goToProfile = () => {
    router.push("/(tabs)/profile/DriverProfileDetail");
  };

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

  const handleEditAvatar = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Permission to access camera roll is required!");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (
      !pickerResult.canceled &&
      pickerResult.assets &&
      pickerResult.assets.length > 0
    ) {
      const { uri } = pickerResult.assets[0];
      try {
        const uploadResponse = await uploadImage(uri);
        console.log("Upload response:", uploadResponse);

        if (driverProfile) {
          const changeAvatarResponse = await changeAvatar(
            driverProfile.Id,
            uploadResponse.link_img
          );
          console.log("Change avatar response:", changeAvatarResponse);

          setDriverProfile(changeAvatarResponse.result);
        }
      } catch (error) {
        console.error("Lỗi khi thay đổi avatar:", error);
      }
    }
  };

  if (!userExists) {
    return (
      <View style={styles.container}>
        <Text>No user information found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity>
        {driverProfile && (
          <View style={styles.profileHeader}>
            <Image
              source={{ uri: driverProfile.ImageUrl }}
              style={styles.avatar}
            />
            <TouchableOpacity
              style={styles.editIcon}
              onPress={handleEditAvatar}
            >
              <FontAwesome name="edit" size={17} color="white" />
            </TouchableOpacity>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{driverProfile.FullName}</Text>
              <Text style={styles.profilePhone}>{driverProfile.Phone}</Text>
            </View>
          </View>
        )}
      </TouchableOpacity>
      <View style={styles.profileOptions}>
        <Pressable onPress={goToProfile} style={styles.optionItem}>
          <FontAwesome name="address-card" size={17} color="#12aae2" />
          <Text style={styles.optionText}>Hồ sơ người dùng</Text>
        </Pressable>
        <TouchableOpacity style={styles.optionItem}>
          <FontAwesome name="support" size={17} color="#12aae2" />
          <Text style={styles.optionText}>Trợ giúp</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionItem} onPress={logout}>
          <FontAwesome name="sign-out" size={17} color="#12aae2" />
          <Text style={styles.optionText}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    marginTop: 20,
    padding: 20,
  },
  profileHeader: {
    flexDirection: "row",
    backgroundColor: "#12aae2",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    alignItems: "center", // Align items vertically centered
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 10, // Adjusted margin
    backgroundColor: "#fff",
  },
  editIcon: {
    borderRadius: 20,
    padding: 5,
    marginRight: 10, // Adjusted margin
  },
  profileInfo: {
    justifyContent: "center",
    marginLeft: 10, // Adjusted margin
  },
  profileName: {
    fontSize: 20,
    fontFamily: "Averta",
    color: "#fff",
  },
  profilePhone: {
    fontSize: 18,
    color: "#fff",
    fontFamily: "AvertaRegular",
  },
  profileOptions: {
    marginTop: 20,
  },
  optionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    flexDirection: "row",
    alignItems: "center",
  },
  optionText: {
    fontSize: 16,
    marginLeft: 10,
  },
});
