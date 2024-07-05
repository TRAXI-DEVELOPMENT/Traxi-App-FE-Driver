import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
} from "react-native";
import { changeAvatar, getDriverProfile } from "@/api/Driver/Driver";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  DriverDegree,
  DriverProfile as DriverProfileType,
} from "@/types/Driver";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { uploadImage } from "@/api/Upload/UpLoadImage";
import * as ImagePicker from "expo-image-picker";
import { formatBirthday } from "@/utils/format";
import { getDriverDegree } from "@/api/Driver/DriverDegree";
import { useRouter } from "expo-router";

export default function DriverProfileDetail() {
  const [driverProfile, setDriverProfile] = useState<DriverProfileType | null>(
    null
  );
  const [driverDegree, setDriverDegree] = useState<DriverDegree[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const navigation = useNavigation();
  const router = useRouter();

  const fetchDriverProfile = async () => {
    try {
      const userInfo = await AsyncStorage.getItem("USER_INFO");
      const driverInfo = userInfo ? JSON.parse(userInfo) : null;
      const driverId = driverInfo?.id;

      if (driverId) {
        const data = await getDriverProfile(driverId);
        setDriverProfile({ ...data });
        const driverDegreeData = await getDriverDegree(driverId);
        setDriverDegree(driverDegreeData);
      }
    } catch (error) {
      console.error("Error fetching driver profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
    fetchDriverProfile();
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      fetchDriverProfile();
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#12aae2" />
      </View>
    );
  }

  if (!driverProfile) {
    return (
      <View style={styles.container}>
        <Text>Không thể lấy thông tin tài xế.</Text>
      </View>
    );
  }

  const openModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setModalVisible(false);
  };

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

  const handleNavigateToUpload = () => {
    router.push("/(tabs)/profile/UploadDriverLicense");
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.profileHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.avatarContainer}>
          <Image
            source={{
              uri:
                driverProfile.ImageUrl ||
                "https://res.cloudinary.com/dtl7s29go/image/upload/v1719893155/soic9qbgyyxlso3uhmcr.png",
            }}
            style={styles.avatar}
          />
          <TouchableOpacity style={styles.editIcon} onPress={handleEditAvatar}>
            <FontAwesome name="edit" size={20} color="white" />
          </TouchableOpacity>
        </View>
        <Text style={styles.name}>{driverProfile.FullName}</Text>
      </View>

      <View style={styles.container}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Số điện thoại:</Text>
          <Text style={styles.infoValue}>{driverProfile.Phone}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Ngày sinh:</Text>
          <Text style={styles.infoValue}>
            {formatBirthday(driverProfile.Birthday) || "01 / 01 / 1970"}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Địa chỉ:</Text>
          <Text style={styles.infoValue}>{driverProfile.Address}</Text>
        </View>

        <View style={styles.divider} />
        {driverDegree && driverDegree.length > 0 ? (
          <>
            {driverDegree.map((license: DriverDegree, index: number) => (
              <TouchableOpacity
                key={index}
                onPress={() => openModal(license.ImageUrl)}
              >
                <View style={styles.licenseContainer}>
                  <Text style={styles.licenseTitle}>
                    Giấy phép lái xe / Driver's License
                  </Text>
                  <View style={styles.licenseContent}>
                    <Image
                      source={{ uri: license.ImageUrl }}
                      style={styles.licenseImage}
                    />
                    <View style={styles.licenseDetails}>
                      <View style={styles.row}>
                        <Text style={styles.headLicenseTextNumber}>Số/No:</Text>
                        <Text style={styles.licenseTextNumber}>
                          {license.No}
                        </Text>
                      </View>
                      <View style={styles.row}>
                        <Text style={styles.headLicenseText}>Ngày cấp:</Text>
                        <Text style={styles.licenseText}>
                          {license.Expires}
                        </Text>
                      </View>
                      <View style={styles.row}>
                        <Text style={styles.headLicenseText}>Nơi cấp:</Text>
                        <Text style={styles.licenseText}>
                          {license.IssuedBy}
                        </Text>
                      </View>
                      <View style={styles.row}>
                        <Text style={styles.headLicenseText}>Hạng/Class:</Text>
                        <Text style={styles.licenseText}>{license.Type}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.updateButtonContainer}
              onPress={handleNavigateToUpload}
            >
              <Text style={styles.updateButtonText}>Cập nhật bằng lái xe</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={styles.updateButtonContainer}
            onPress={handleNavigateToUpload}
          >
            <Text style={styles.updateButtonText}>Cập nhật bằng lái xe</Text>
          </TouchableOpacity>
        )}
        <Modal visible={modalVisible} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            {selectedImage && (
              <>
                <View style={styles.imageWrapper}>
                  <Image
                    source={{ uri: selectedImage }}
                    style={styles.fullImage}
                  />
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={closeModal}
                  >
                    <Ionicons name="close" size={20} color="white" />
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#f5f5f5",
  },
  container: {
    flexDirection: "column",
    alignItems: "center",
    padding: 20,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 1,
  },
  profileHeader: {
    backgroundColor: "#12aae2",
    paddingTop: 80,
    padding: 20,
    paddingBottom: 20,
    width: "100%",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  editIcon: {
    position: "absolute",
    bottom: 22,
    right: -2,
    borderRadius: 15,
    padding: 5,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#fff",
    fontFamily: "Averta",
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 20,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 16,
    fontFamily: "AvertaRegular",
  },
  infoValue: {
    fontSize: 16,
    fontFamily: "Averta",
    flexWrap: "wrap",
  },
  licenseContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginVertical: 10,
    width: "100%",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  licenseTitle: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Averta",
    marginBottom: 10,
  },
  licenseContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  licenseImage: {
    width: 160,
    height: 100,
    borderRadius: 10,
    marginRight: 20,
  },
  licenseDetails: {
    flex: 1,
    flexShrink: 1, // Added this line to prevent text from overflowing
  },
  headLicenseText: {
    fontSize: 16,
    marginBottom: 5,
    fontFamily: "AvertaRegular",
  },
  headLicenseTextNumber: {
    fontSize: 16,
    marginBottom: 5,
    color: "red",
    fontFamily: "AvertaRegular",
  },
  licenseText: {
    fontSize: 16,
    marginBottom: 5,
    fontFamily: "Averta",
  },
  licenseTextNumber: {
    fontSize: 16,
    marginBottom: 5,
    color: "red",
    fontFamily: "Averta",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  imageWrapper: {
    position: "relative",
    width: "90%",
    height: "auto",
    aspectRatio: 1.5,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: -15,
    zIndex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 15,
    padding: 5,
  },
  fullImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  updateButtonContainer: {
    backgroundColor: "#12aae2",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  updateButtonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
