import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ActivityIndicator } from "react-native";
import { getDriverProfile } from "@/api/Driver/Driver";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DriverProfile as DriverProfileType } from "@/types/Driver";

export default function DriverProfileDetail() {
  const [driverProfile, setDriverProfile] = useState<DriverProfileType | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDriverProfile = async () => {
      try {
        const userInfo = await AsyncStorage.getItem("USER_INFO");
        const driverInfo = userInfo ? JSON.parse(userInfo) : null;
        const driverId = driverInfo?.id;

        if (driverId) {
          const data = await getDriverProfile(driverId);
          setDriverProfile(data.result);
        }
      } catch (error) {
        console.error("Error fetching driver profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDriverProfile();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!driverProfile) {
    return (
      <View style={styles.container}>
        <Text>Không thể lấy thông tin tài xế.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: driverProfile.ImageUrl }} style={styles.avatar} />
      <Text style={styles.name}>{driverProfile.FullName}</Text>
      <Text style={styles.phone}>{driverProfile.Phone}</Text>
      <Text style={styles.address}>{driverProfile.Address}</Text>
      <Text style={styles.date}>
        Ngày cập nhật: {new Date(driverProfile.UpDate).toLocaleDateString()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  phone: {
    fontSize: 18,
    marginBottom: 10,
  },
  address: {
    fontSize: 18,
    marginBottom: 10,
  },
  date: {
    fontSize: 16,
    color: "#888",
  },
});
