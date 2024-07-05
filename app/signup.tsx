import { EvilIcons, Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Modal,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router"; // Import useRouter để điều hướng
import { Picker } from "@react-native-picker/picker";
import Dialog from "@/components/Dialog"; // Import Dialog component
import { uploadImage } from "@/api/Upload/UpLoadImage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { postDriverDegree } from "@/api/Driver/DriverDegree";
import { applyJob } from "@/api/Auth/Auth"; // Import applyJob API

export default function Signup() {
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [temporaryAddress, setTemporaryAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [issuedBy, setIssuedBy] = useState("");
  const [licenseClass, setLicenseClass] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [degreeName, setDegreeName] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogType, setDialogType] = useState<"success" | "error">("success");
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogMessage, setDialogMessage] = useState("");
  const [showDriverProfile, setShowDriverProfile] = useState(true);
  const [showDriverDegree, setShowDriverDegree] = useState(true);
  const [phoneError, setPhoneError] = useState("");
  const [nameError, setNameError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [licenseNumberError, setLicenseNumberError] = useState("");
  const [issueDateError, setIssueDateError] = useState("");
  const [issuedByError, setIssuedByError] = useState("");
  const [imageError, setImageError] = useState("");
  const [birthday, setBirthday] = useState(""); // Thêm state cho Birthday
  const [birthdayError, setBirthdayError] = useState(""); // Thêm state cho lỗi Birthday
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const router = useRouter(); // Sử dụng useRouter để điều hướng

  const validateStep1 = () => {
    let hasError = false;

    if (!/^[0-9]{10}$/.test(phoneNumber) || phoneNumber[0] !== "0") {
      setPhoneError("Số điện thoại phải có 10 số và bắt đầu bằng số 0");
      hasError = true;
    } else {
      setPhoneError("");
    }

    if (!name.trim()) {
      setNameError("Tên không được bỏ trống");
      hasError = true;
    } else {
      setNameError("");
    }

    if (!address.trim()) {
      setAddressError("Địa chỉ không được bỏ trống");
      hasError = true;
    } else {
      setAddressError("");
    }

    if (!/^\d{2}\-\d{2}\-\d{4}$/.test(birthday)) {
      setBirthdayError("Ngày sinh phải đúng định dạng dd/mm/yyyy");
      hasError = true;
    } else {
      setBirthdayError("");
    }

    return !hasError;
  };

  const validateStep2 = () => {
    let hasError = false;

    if (!/^[0-9]+$/.test(licenseNumber)) {
      setLicenseNumberError(
        "Số giấy phép chỉ được nhập số và không được để trống"
      );
      hasError = true;
    } else {
      setLicenseNumberError("");
    }

    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(issueDate)) {
      setIssueDateError("Ngày cấp phải đúng định dạng dd/mm/yyyy");
      hasError = true;
    } else {
      setIssueDateError("");
    }

    if (!issuedBy.trim()) {
      setIssuedByError("Nơi cấp không được bỏ trống");
      hasError = true;
    } else {
      setIssuedByError("");
    }

    if (!selectedImage) {
      setImageError("Hình ảnh phải được chọn");
      hasError = true;
    } else {
      setImageError("");
    }

    return !hasError;
  };

  const [isStep1Valid, setIsStep1Valid] = useState(false);
  const [isStep2Valid, setIsStep2Valid] = useState(false);

  useEffect(() => {
    setIsStep1Valid(validateStep1());
  }, [phoneNumber, name, address, birthday]);

  useEffect(() => {
    setIsStep2Valid(validateStep2());
  }, [licenseNumber, issueDate, issuedBy, selectedImage]);

  useEffect(() => {
    setIsPasswordValid(password === confirmPassword && password.length > 0);
  }, [password, confirmPassword]);

  const nextStep = () => {
    if (step === 1 && isStep1Valid) {
      setStep(step + 1);
    } else if (step === 2 && isStep2Valid) {
      setStep(step + 1);
    } else if (step === 3) {
      setStep(step + 1);
    } else if (step === 4 && isPasswordValid) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handlePickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      setDialogTitle("Lỗi");
      setDialogMessage("Cần có quyền truy cập vào cuộn camera!");
      setDialogType("error");
      setDialogVisible(true);
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
      setDialogTitle("Lỗi");
      setDialogMessage("Vui lòng xác nhận tất cả các thông tin trên là đúng");
      setDialogType("error");
      setDialogVisible(true);
      return;
    }

    if (!selectedImage || !licenseNumber || !issueDate || !licenseClass) {
      setDialogTitle("Lỗi");
      setDialogMessage("Vui lòng điền đầy đủ tất cả thông tin");
      setDialogType("error");
      setDialogVisible(true);
      return;
    }

    setIsLoading(true);

    try {
      // Call applyJob API
      const applyJobData = {
        Phone: phoneNumber,
        Birthday: birthday,
        Fullname: name, // Corrected from FullName to Fullname
        Address: address,
        Password: password,
      };
      const applyJobResponse = await applyJob(applyJobData);
      console.log("Apply Job response:", applyJobResponse);

      if (applyJobResponse.result) {
        const driverId = applyJobResponse.result.DriverId;

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

        if (typeof response.result === "string") {
          setDialogTitle("Lỗi");
          setDialogMessage(response.result);
          setDialogType("error");
          setDialogVisible(true);
        } else {
          setDialogTitle("Thành công");
          setDialogMessage("Đăng ký thành công!");
          setDialogType("success");
          setDialogVisible(true);
        }
      } else {
        setDialogTitle("Lỗi");
        setDialogMessage(applyJobResponse.error ?? "Đã xảy ra lỗi");
        setDialogType("error");
        setDialogVisible(true);
      }
    } catch (error) {
      console.error("Error uploading driver license:", error);
      setDialogTitle("Lỗi");
      setDialogMessage("Error uploading driver license.");
      setDialogType("error");
      setDialogVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return "Nhập thông tin cá nhân";
      case 2:
        return "Tải lên Bằng lái xe (mặt trước)";
      case 3:
        return "Tải lên hình ảnh Khuôn mặt";
      case 4:
        return "Tạo mật khẩu";
      case 5:
        return "Xác nhận thông tin";
      default:
        return "";
    }
  };

  return (
    <View style={styles.container}>
      {step > 1 && (
        <TouchableOpacity style={styles.backButton} onPress={prevStep}>
          <EvilIcons name="arrow-left" size={40} color="#12aae2" />
          <Text style={styles.backButtonText}>{getStepTitle()}</Text>
        </TouchableOpacity>
      )}
      {step === 1 && (
        <ImageBackground
          source={require("../assets/images/bg_register.png")}
          style={styles.bgContainer}
        >
          <View style={styles.stepContainer}>
            <ScrollView contentContainerStyle={styles.scrollview}>
              <Text style={styles.stepTitle}>{getStepTitle()}</Text>
              <Text style={styles.label}>
                Nhập số điện thoại <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="Nhập số điện thoại:"
              />
              {phoneError ? (
                <Text style={styles.errorText}>{phoneError}</Text>
              ) : null}
              <Text style={styles.label}>
                Họ & tên đầy đủ <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Nhập họ & tên đầy đủ"
              />
              {nameError ? (
                <Text style={styles.errorText}>{nameError}</Text>
              ) : null}
              <Text style={styles.label}>
                Ngày sinh (Ví dụ: 01-01-1970)
                <Text style={styles.required}> *</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={birthday}
                onChangeText={setBirthday}
                placeholder="Nhập ngày sinh (dd-mm-yyyy)"
              />
              {birthdayError ? (
                <Text style={styles.errorText}>{birthdayError}</Text>
              ) : null}
              <Text style={styles.label}>
                Địa chỉ <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={address}
                onChangeText={setAddress}
                placeholder="Nhập địa chỉ"
              />
              {addressError ? (
                <Text style={styles.errorText}>{addressError}</Text>
              ) : null}

              <TouchableOpacity
                style={[
                  styles.button,
                  !isStep1Valid ? styles.disabledButton : {},
                ]}
                onPress={nextStep}
                disabled={!isStep1Valid}
              >
                <Text style={styles.buttonText}>Tiếp tục</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </ImageBackground>
      )}

      {step === 2 && (
        <ImageBackground
          source={require("../assets/images/bg_register.png")}
          style={styles.bgContainer}
        >
          <View style={styles.stepContainer}>
            <ScrollView contentContainerStyle={styles.scrollview}>
              <Text style={styles.label}>
                Số giấy phép <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={licenseNumber}
                onChangeText={setLicenseNumber}
                placeholder="Nhập số giấy phép"
              />
              {licenseNumberError ? (
                <Text style={styles.errorText}>{licenseNumberError}</Text>
              ) : null}
              <Text style={styles.label}>
                Ngày cấp (dd/mm/yyyy) <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={issueDate}
                onChangeText={setIssueDate}
                placeholder="Nhập ngày cấp"
              />
              {issueDateError ? (
                <Text style={styles.errorText}>{issueDateError}</Text>
              ) : null}
              <Text style={styles.label}>
                Nơi cấp <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={issuedBy}
                onChangeText={setIssuedBy}
                placeholder="Nhập nơi cấp"
              />
              {issuedByError ? (
                <Text style={styles.errorText}>{issuedByError}</Text>
              ) : null}
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
              {imageError ? (
                <Text style={styles.errorText}>{imageError}</Text>
              ) : null}

              <Modal visible={isLoading} transparent>
                <View style={styles.loadingModalContainer}>
                  <ActivityIndicator
                    size="large"
                    color="#12aae2"
                    style={styles.loadingIndicator}
                  />
                </View>
              </Modal>
              <TouchableOpacity
                style={[
                  styles.button,
                  !isStep2Valid ? styles.disabledButton : {},
                ]}
                onPress={nextStep}
                disabled={!isStep2Valid}
              >
                <Text style={styles.buttonText}>Tiếp tục</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </ImageBackground>
      )}

      {step === 3 && (
        <ImageBackground
          source={require("../assets/images/bg_register.png")}
          style={styles.bgContainer}
        >
          <View style={styles.stepContainer}>
            <Text style={styles.label}>Chụp hình mặt người đăng ký:</Text>
            <TouchableOpacity style={styles.button} onPress={nextStep}>
              <Text style={styles.buttonText}>Tiếp tục</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      )}

      {step === 4 && (
        <ImageBackground
          source={require("../assets/images/bg_register.png")}
          style={styles.bgContainer}
        >
          <View style={styles.stepContainer}>
            <Text style={styles.label}>Tạo mật khẩu:</Text>
            <TextInput
              secureTextEntry={true}
              style={styles.input}
              value={password}
              onChangeText={setPassword}
            />
            <Text style={styles.label}>Xác nhận mật khẩu:</Text>
            <TextInput
              secureTextEntry={true}
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            {password !== confirmPassword && (
              <Text style={styles.errorText}>Mật khẩu không trùng khớp</Text>
            )}
            <TouchableOpacity
              style={[
                styles.button,
                !isPasswordValid ? styles.disabledButton : {},
              ]}
              onPress={nextStep}
              disabled={!isPasswordValid}
            >
              <Text style={styles.buttonText}>Tiếp tục</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      )}

      {step === 5 && (
        <ImageBackground
          source={require("../assets/images/bg_register.png")}
          style={styles.bgContainer}
        >
          <ScrollView contentContainerStyle={styles.scrollview}>
            <View style={styles.stepContainer}>
              <TouchableOpacity
                onPress={() => setShowDriverProfile(!showDriverProfile)}
              >
                <View style={styles.titleRow}>
                  <Text style={styles.sectionTitle}>Thông tin cá nhân</Text>
                  <Ionicons
                    name={showDriverProfile ? "chevron-up" : "chevron-down"}
                    size={24}
                    color="#12aae2"
                  />
                </View>
              </TouchableOpacity>
              {showDriverProfile && (
                <View style={styles.driverProfile}>
                  <View style={styles.infoRow}>
                    <Ionicons name="phone-portrait" size={24} color="#12aae2" />
                    <Text style={styles.infoText}>
                      Số điện thoại: {phoneNumber}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <EvilIcons name="user" size={24} color="#12aae2" />
                    <Text style={styles.infoText}>Tên: {name}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <EvilIcons name="location" size={24} color="#12aae2" />
                    <Text style={styles.infoText}>Địa chỉ: {address}</Text>
                  </View>
                </View>
              )}

              <TouchableOpacity
                onPress={() => setShowDriverDegree(!showDriverDegree)}
              >
                <View style={styles.titleRow}>
                  <Text style={styles.sectionTitle}>Thông tin bằng lái</Text>
                  <Ionicons
                    name={showDriverDegree ? "chevron-up" : "chevron-down"}
                    size={24}
                    color="#12aae2"
                  />
                </View>
              </TouchableOpacity>
              {showDriverDegree && (
                <View style={styles.driverDegree}>
                  {selectedImage && (
                    <Image
                      source={{ uri: selectedImage }}
                      style={styles.imagePreview}
                    />
                  )}
                  <View style={styles.infoRow}>
                    <EvilIcons name="credit-card" size={24} color="#12aae2" />
                    <Text style={styles.infoText}>
                      Số giấy phép: {licenseNumber}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <EvilIcons name="calendar" size={24} color="#12aae2" />
                    <Text style={styles.infoText}>Ngày cấp: {issueDate}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <EvilIcons name="location" size={24} color="#12aae2" />
                    <Text style={styles.infoText}>Nơi cấp: {issuedBy}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Ionicons name="list" size={24} color="#12aae2" />
                    <Text style={styles.infoText}>Hạng: {licenseClass}</Text>
                  </View>
                </View>
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
              <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Xác nhận và Đăng ký</Text>
              </TouchableOpacity>
              <Dialog
                visible={dialogVisible}
                type={dialogType}
                title={dialogTitle}
                message={dialogMessage}
                onClose={() => setDialogVisible(false)}
              />
            </View>
          </ScrollView>
        </ImageBackground>
      )}

      <View style={styles.footer}>
        <Text style={styles.footerText}>Bạn đã có tài khoản? </Text>
        <TouchableOpacity onPress={() => router.push("/signin")}>
          <Text style={styles.footerLink}>Đăng nhập</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    padding: 20,
    backgroundColor: "#e1fffe",
  },
  stepContainer: {
    marginBottom: 20,
    width: "100%",
  },
  bgContainer: {
    marginTop: 40,
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#e1fffe",
  },
  label: {
    marginTop: 20,
    fontFamily: "Averta",
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    justifyContent: "flex-start",
    fontFamily: "Averta",
    width: "100%",
    backgroundColor: "white",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    borderColor: "#12aae2",
    borderWidth: 1,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
    paddingBottom: 50,
    flexDirection: "row",
    alignItems: "center",
  },
  backButtonText: {
    marginLeft: 10,
    fontFamily: "Averta",
    fontSize: 17,
    color: "#12aae2",
  },
  button: {
    padding: 15,
    width: "100%",
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
    backgroundColor: "#12aae2",
    marginTop: 10, // Add margin to the button
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  footerText: {
    fontFamily: "Averta",
    fontSize: 16,
  },
  footerLink: {
    fontFamily: "Averta",
    fontSize: 16,
    color: "#12aae2",
    textDecorationLine: "underline",
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
  disabledButton: {
    backgroundColor: "#ccc",
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
  loadingIndicator: {
    marginTop: 20,
  },
  loadingModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  required: {
    color: "red",
  },
  scrollview: { padding: 0 },
  infoText: {
    fontFamily: "Averta",
    fontSize: 16,
    marginLeft: 10,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  driverProfile: {},
  driverDegree: {},
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: "Averta",
    fontSize: 18,
    fontWeight: "bold",
    color: "#12aae2",
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#12aae2",
  },
});
