import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getDriverProfile } from "@/api/Auth/Driver/Driver";
import useAuth from "@/hooks/useAuth";

export default function DriverProfile() {
  const [driverProfile, setDriverProfile] = useState(null);
  const [userExists, setUserExists] = useState(true);
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
    return (
      <View style={styles.container}>
        <Text>No user information found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Thông tin cá nhân</Text>
      <TouchableOpacity>
        {driverProfile && (
          <View style={styles.profileHeader}>
            <Image
              source={{ uri: driverProfile?.avatar }}
              style={styles.avatar}
            />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{driverProfile.FullName}</Text>
              <Text style={styles.profilePhone}>{driverProfile.Phone}</Text>
            </View>
          </View>
        )}
      </TouchableOpacity>
      <View style={styles.profileOptions}>
        <TouchableOpacity style={styles.optionItem}>
          <Text style={styles.optionText}>Thông tin ứng dụng</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionItem}>
          <Text style={styles.optionText}>Trợ giúp</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionItem}>
          <Text style={styles.optionText} onPress={logout}>
            Đăng xuất
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 20,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  profileHeader: {
    flexDirection: "row",
    backgroundColor: "#12aae2",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
    backgroundColor: "#fff",
  },
  profileInfo: {
    justifyContent: "center",
  },
  profileName: {
    fontSize: 18,
    fontFamily: "Averta",
    color: "#fff",
  },
  profilePhone: {
    fontSize: 16,
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
  },
  optionText: {
    fontSize: 16,
  },
});
