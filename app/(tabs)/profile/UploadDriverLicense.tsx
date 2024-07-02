import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { uploadImage } from "@/api/Upload/UpLoadImage";
import { useNavigation, useRouter } from "expo-router";
import { postDriverDegree } from "@/api/Driver/DriverDegree";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";

export default function UploadDriverLicense() {
  const [licenseNumber, setLicenseNumber] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [issuedBy, setIssuedBy] = useState("");
  const [licenseClass, setLicenseClass] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [degreeName, setDegreeName] = useState("");
  const navigation = useNavigation();
  const router = useRouter();

  React.useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);

  const handlePickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Cần có quyền truy cập vào cuộn camera!");
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
      setSelectedImage(pickerResult.assets[0].uri);
    }
  };

  const handleLicenseClassChange = (value: string) => {
    setLicenseClass(value);
    switch (value) {
      case "A1":
        setDegreeName("Bằng lái A1");
        break;
      case "B1":
        setDegreeName("Bằng lái B1");
        break;
      case "B2":
        setDegreeName("Bằng lái B2");
        break;
      default:
        setDegreeName("");
    }
  };

  const handleSubmit = async () => {
    if (!selectedImage || !licenseNumber || !issueDate || !licenseClass) {
      Alert.alert("Vui lòng điền đầy đủ tất cả thông tin");
      return;
    }

    try {
      const userInfo = await AsyncStorage.getItem("USER_INFO");
      const driverInfo = userInfo ? JSON.parse(userInfo) : null;
      const driverId = driverInfo?.id;

      // Upload image and get the image URL
      const uploadResponse = await uploadImage(selectedImage);
      const imageUrl = uploadResponse.link_img;

      // Prepare data to post
      const driverDegreeData = {
        DriverId: driverId,
        Expires: issueDate,
        DegreeName: degreeName,
        Type: licenseClass,
        ImageUrl: imageUrl,
        No: licenseNumber,
        IssuedBy: issuedBy,
      };

      // Post driver degree data
      const response = await postDriverDegree(driverDegreeData);
      console.log("Post response:", response);

      Alert.alert("Giấy phép lái xe đã được tải lên thành công!");
      router.back();
    } catch (error) {
      console.error("Error uploading driver license:", error);
      Alert.alert("Error uploading driver license.");
    }
  };

  return (
    <View style={styles.outerContainer}>
      <View style={styles.titleWrapper}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Tải lên Giấy phép lái xe</Text>
      </View>

      <View style={styles.container}>
        <Text style={styles.label}>Số giấy phép (*)</Text>
        <TextInput
          style={styles.input}
          value={licenseNumber}
          onChangeText={setLicenseNumber}
          placeholder="Nhập số giấy phép"
        />
        <Text style={styles.label}>Ngày cấp: (dd/mm/yyyy) (*)</Text>
        <TextInput
          style={styles.input}
          value={issueDate}
          onChangeText={setIssueDate}
          placeholder="Nhập ngày cấp"
        />
        <Text style={styles.label}>Nơi cấp: (*)</Text>
        <TextInput
          style={styles.input}
          value={issuedBy}
          onChangeText={setIssuedBy}
          placeholder="Nhập nơi cấp"
        />
        <Text style={styles.label}>Hạng: (*)</Text>
        <Picker
          selectedValue={licenseClass}
          style={styles.picker}
          onValueChange={handleLicenseClassChange}
        >
          <Picker.Item label="Chọn hạng" value="" />
          <Picker.Item label="Bằng lái A1" value="A1" />
          <Picker.Item label="Bằng lái B1" value="B1" />
          <Picker.Item label="Bằng lái B2" value="B2" />
        </Picker>
        <TouchableOpacity style={styles.imagePicker} onPress={handlePickImage}>
          <Text style={styles.imagePickerText}>Chọn ảnh</Text>
        </TouchableOpacity>
        {selectedImage && (
          <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
        )}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Tải lên</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: { flex: 1, backgroundColor: "#f5f5f5" },
  titleWrapper: {},
  backButton: {
    top: 47,
    left: 20,
    zIndex: 1,
  },
  title: {
    fontSize: 22,
    fontFamily: "Averta",
    paddingTop: 20,
    padding: 20,
    width: "100%",
    marginBottom: 20,
    backgroundColor: "#12aae2",
    textAlign: "center",
    color: "#fff",
  },
  container: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: "#555",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  imagePicker: {
    backgroundColor: "#12aae2",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  imagePickerText: {
    color: "#fff",
    fontSize: 16,
  },
  imagePreview: {
    width: "100%",
    height: 200,
    marginBottom: 20,
    borderRadius: 5,
  },
  submitButton: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
