import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  ImageBackground,
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
  const [isConfirmed, setIsConfirmed] = useState(false);

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
    if (!isConfirmed) {
      Alert.alert("Vui lòng xác nhận tất cả các thông tin trên là đúng");
      return;
    }

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
      <ImageBackground
        source={require("../../../assets/images/bg_register.png")}
        style={styles.bgContainer}
      >
        <View style={styles.titleWrapper}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.title}>Tải lên Giấy phép lái xe</Text>
        </View>

        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.label}>
            Số giấy phép <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            value={licenseNumber}
            onChangeText={setLicenseNumber}
            placeholder="Nhập số giấy phép"
          />
          <Text style={styles.label}>
            Ngày cấp (dd/mm/yyyy) <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            value={issueDate}
            onChangeText={setIssueDate}
            placeholder="Nhập ngày cấp"
          />
          <Text style={styles.label}>
            Nơi cấp <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            value={issuedBy}
            onChangeText={setIssuedBy}
            placeholder="Nhập nơi cấp"
          />
          <Text style={styles.label}>
            Hạng <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.pickerContainer}>
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
          </View>
          <TouchableOpacity
            style={styles.imagePicker}
            onPress={handlePickImage}
          >
            <Text style={styles.imagePickerText}>Chọn ảnh</Text>
          </TouchableOpacity>
          {selectedImage && (
            <Image
              source={{ uri: selectedImage }}
              style={styles.imagePreview}
            />
          )}
          <TouchableOpacity onPress={() => setIsConfirmed(!isConfirmed)}>
            <View style={styles.checkboxContainer}>
              <View style={styles.checkbox}>
                {isConfirmed && <View style={styles.checkboxTick} />}
              </View>
              <Text style={styles.checkboxText}>
                Tôi xác nhận tất cả các thông tin trên là đúng
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Tải lên</Text>
          </TouchableOpacity>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: { flex: 1, backgroundColor: "#f5f5f5" },
  titleWrapper: {},
  bgContainer: {
    backgroundColor: "#f0f4f7",
  },
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
    fontFamily: "Averta",
    fontSize: 16,
    marginBottom: 10,
    color: "#555",
  },
  required: {
    color: "red",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  picker: {
    width: "100%",
    height: 50,
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
    fontFamily: "Averta",
    fontSize: 16,
  },
  imagePreview: {
    width: "100%",
    height: 200,
    marginBottom: 20,
    borderRadius: 5,
  },
  submitButton: {
    backgroundColor: "#12aae2",
    fontFamily: "Averta",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: "white",
    fontFamily: "Averta",
    fontSize: 16,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    fontFamily: "AvertaRegular",
    padding: 18,
    backgroundColor: "#F5F3F4",
    borderRadius: 5,
    marginBottom: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxTick: {
    width: 14,
    height: 14,
    backgroundColor: "#12aae2",
  },
  checkboxText: {
    fontSize: 16,
    color: "#555",
  },
});
