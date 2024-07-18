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
import { postDriverDegree } from "@/api/Driver/DriverDegree";
import { applyJob } from "@/api/Auth/Auth"; // Import applyJob API
import { Camera } from "expo-camera";
import * as Notifications from "expo-notifications";
import { formatBirthday, formatDateString } from "@/utils/format";

export default function Signup() {
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [address, setAddress] = useState("");
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
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const router = useRouter(); // Sử dụng useRouter để điều hướng

  const validateStep1 = () => {
    let hasError = false;

    if (!/^[0-9]{10}$/.test(phoneNumber) || phoneNumber[0] !== "0") {
      setPhoneError("Số điện thoại chưa chính xác");
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

    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthday)) {
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
      setLicenseNumberError("Số giấy phép chưa chính xác");
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
      setImageError("Hình ảnh phải được tải lên");
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
    if (step === 1) {
      setStep(step + 1);
    } else if (step === 2 && isStep2Valid) {
      setStep(step + 1);
    } else if (step === 3 && isImageUploaded) {
      setStep(step + 1);
    } else if (step === 4 && isStep1Valid) {
      setStep(step + 1);
    } else if (step === 5 && isPasswordValid) {
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

  const handleCaptureAvatar = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Notifications.scheduleNotificationAsync({
        content: {
          title: "Lỗi",
          body: "Cần có quyền truy cập vào camera!",
        },
        trigger: null,
      });
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      setCapturedImage(imageUri);
      try {
        const uploadResponse = await uploadImage(imageUri);
        const imageUrl = uploadResponse.link_img;
        console.log("Image URL:", imageUrl);
        setAvatar(imageUrl);
        setIsImageUploaded(true);
      } catch (error) {
        console.error("Lỗi khi upload ảnh:", error);
        setIsImageUploaded(false);
      }
    } else {
      Notifications.scheduleNotificationAsync({
        content: {
          title: "Lỗi",
          body: "Hình ảnh chưa được chụp thành công hoặc chưa được chụp.",
        },
        trigger: null,
      });
    }
  };

  const handleCaptureLicense = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Notifications.scheduleNotificationAsync({
        content: {
          title: "Lỗi",
          body: "Cần có quyền truy cập vào camera!",
        },
        trigger: null,
      });
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      try {
        const uploadResponse = await uploadImage(imageUri);
        const imageUrl = uploadResponse.link_img;
        console.log("Image URL:", imageUrl);
        setSelectedImage(imageUrl); // Cập nhật selectedImage với URL của ảnh đã tải lên
        setIsImageUploaded(true);
      } catch (error) {
        console.error("Lỗi khi upload ảnh:", error);
        setIsImageUploaded(false);
      }
    } else {
      Notifications.scheduleNotificationAsync({
        content: {
          title: "Lỗi",
          body: "Hình ảnh chưa được chụp thành công hoặc chưa được chụp.",
        },
        trigger: null,
      });
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
        ImageUrl: avatar,
        Fullname: name,
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
          setTimeout(() => {
            router.replace("/signin");
          }, 2000);
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
      case 2:
        return "Tải lên Bằng lái xe (mặt trước)";
      case 3:
        return "Tải lên hình ảnh khuôn mặt";
      case 4:
        return "Nhập thông tin cá nhân";
      case 5:
        return "Tạo mật khẩu";
      case 6:
        return "Xác nhận thông tin";
      default:
        return "";
    }
  };

  const Step1 = () => {
    return (
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>Hướng dẫn tải lên tài liệu</Text>
        <View style={styles.imageRow}>
          <Image
            source={{
              uri: "https://res.cloudinary.com/dtl7s29go/image/upload/v1720818071/eo7se5dpgdg0n0nrqm0z.jpg",
            }}
            style={styles.sampleImage}
            onError={(error) =>
              console.error("Error loading image:", error.nativeEvent.error)
            }
          />
          <Image
            source={{
              uri: "https://res.cloudinary.com/dtl7s29go/image/upload/v1720818096/erhmdbqydiayhsk8psjz.jpg",
            }}
            style={styles.sampleImage}
            onError={(error) =>
              console.error("Error loading image:", error.nativeEvent.error)
            }
          />
        </View>
        <Text style={styles.sampleTitle}>Sample Document</Text>
        <View style={styles.requirementContainer}>
          <Ionicons name="checkmark-circle" size={24} color="green" />
          <Text style={styles.requirementTextTitle}>Yêu cầu:</Text>
        </View>
        <View style={styles.requirementDetailContainer}>
          <Ionicons
            name="ellipse"
            size={8}
            color="black"
            style={styles.bulletIcon}
          />
          <Text style={styles.requirementDetail}>
            Giấy phép lái xe còn hạn. Bằng lái bắt buộc có dấu mộc
          </Text>
        </View>
        <View style={styles.requirementDetailContainer}>
          <Ionicons
            name="ellipse"
            size={8}
            color="black"
            style={styles.bulletIcon}
          />
          <Text style={styles.requirementDetail}>
            Mặt trước là mặt có ảnh và thông tin cá nhân (Tên, ngày tháng năm
            sinh, địa chỉ...)
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.requirementContainer}>
          <Ionicons name="close-circle" size={24} color="red" />
          <Text style={styles.requirementTextTitle}>
            Hãy đảm bảo tài liệu không:
          </Text>
        </View>
        <View style={styles.requirementDetailContainer}>
          <Ionicons
            name="ellipse"
            size={8}
            color="black"
            style={styles.bulletIcon}
          />
          <Text style={styles.requirementDetail}>
            Giấy tờ chụp đầy đủ các thông tin, không mất góc
          </Text>
        </View>
        <View style={styles.requirementDetailContainer}>
          <Ionicons
            name="ellipse"
            size={8}
            color="black"
            style={styles.bulletIcon}
          />
          <Text style={styles.requirementDetail}>
            Không chụp ảnh qua màn hình hoặc sử dụng giấy tờ Scan. Ảnh chụp rõ
            nét không lóa sáng
          </Text>
        </View>
        <View style={styles.requirementDetailContainer}>
          <Ionicons
            name="ellipse"
            size={8}
            color="black"
            style={styles.bulletIcon}
          />
          <Text style={styles.requirementDetail}>
            Hình ảnh phải là bằng lái xe gốc, không chấp nhận giấy hẹn trả kết
            quả bằng lái xe hoặc biên lai thu giữ bằng lái xe.
          </Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={nextStep}>
          <Text style={styles.buttonText}>Tải hồ sơ lên</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {step === 1 && <Step1 />}
      {step > 1 && (
        <TouchableOpacity style={styles.backButton} onPress={prevStep}>
          <EvilIcons name="arrow-left" size={40} color="#12aae2" />
          <Text style={styles.backButtonText}>{getStepTitle()}</Text>
        </TouchableOpacity>
      )}
      {step === 2 && (
        <ImageBackground
          source={require("../assets/images/bg_register.png")}
          style={styles.bgContainer}
        >
          <View style={styles.stepContainer}>
            <ScrollView contentContainerStyle={styles.scrollview}>
              <View style={styles.imageUploadContainer}>
                {selectedImage ? (
                  <TouchableOpacity
                    onPress={handlePickImage}
                    style={styles.imagePreviewContainer}
                  >
                    <Image
                      source={{ uri: selectedImage }}
                      style={styles.imagePreview}
                    />
                    <Text style={styles.changeImageText}>Thay đổi ảnh</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.iconContainer}>
                    <TouchableOpacity
                      onPress={handlePickImage}
                      style={styles.iconButton}
                    >
                      <Ionicons name="image" size={30} color="#12aae2" />
                      <Text style={styles.iconText}>Tải lên</Text>
                    </TouchableOpacity>
                    <View style={styles.separator} />
                    <TouchableOpacity
                      onPress={handleCaptureLicense}
                      style={styles.iconButton}
                    >
                      <Ionicons name="camera" size={30} color="#12aae2" />
                      <Text style={styles.iconText}>Chụp ảnh</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
              {imageError ? (
                <Text style={styles.errorText}>{imageError}</Text>
              ) : null}

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
                Ngày cấp (Ví dụ: 01/01/2000){" "}
                <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={issueDate}
                onChangeText={(text) => setIssueDate(formatDateString(text))}
                placeholder="Nhập ngày cấp"
                keyboardType="numeric"
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
            <Text style={styles.titleAvatar}>Vui lòng chụp rõ khuôn mặt</Text>
            <View style={styles.avatarContainer}>
              {capturedImage ? (
                <Image
                  source={{ uri: capturedImage }}
                  style={styles.avatarUpload}
                />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  {/* <Ionicons name="person" size={50} color="#ccc" /> */}

                  <Image
                    source={{
                      uri: "https://res.cloudinary.com/dtl7s29go/image/upload/v1719893155/soic9qbgyyxlso3uhmcr.png",
                    }}
                    style={styles.avatarUpload}
                  />
                </View>
              )}
              <TouchableOpacity
                style={styles.cameraButton}
                onPress={handleCaptureAvatar}
              >
                <Ionicons name="camera" size={30} color="white" />
              </TouchableOpacity>
            </View>

            <View style={styles.requirementContainer}>
              <Ionicons name="checkmark-circle" size={24} color="green" />
              <Text style={styles.requirementTextTitle}>Yêu cầu:</Text>
            </View>
            <View style={styles.requirementDetailContainer}>
              <Ionicons
                name="ellipse"
                size={8}
                color="black"
                style={styles.bulletIcon}
              />
              <Text style={styles.requirementDetail}>
                Hình ảnh khuôn mặt phải trùng khớp với khuôn mặt trên thông tin
                bằng lái xe
              </Text>
            </View>
            <View style={styles.requirementDetailContainer}>
              <Ionicons
                name="ellipse"
                size={8}
                color="black"
                style={styles.bulletIcon}
              />
              <Text style={styles.requirementDetail}>
                Không đội nón, không đeo kính râm, không đeo mặt nạ hay bất kì
                vật cản che khuất khuôn mặt
              </Text>
            </View>
            <View style={styles.requirementDetailContainer}>
              <Ionicons
                name="ellipse"
                size={8}
                color="black"
                style={styles.bulletIcon}
              />
              <Text style={styles.requirementDetail}>
                Không nhắm mắt hoặc nheo mắt khi chụp hình.
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.requirementContainer}>
              <Ionicons name="close-circle" size={24} color="red" />
              <Text style={styles.requirementTextTitle}>
                Hãy đảm bảo hình ảnh khuôn mặt không:
              </Text>
            </View>
            <View style={styles.requirementDetailContainer}>
              <Ionicons
                name="ellipse"
                size={8}
                color="black"
                style={styles.bulletIcon}
              />
              <Text style={styles.requirementDetail}>
                Hình ảnh phải chụp rõ nét toàn bộ khuôn mặt, không lóa sáng.
              </Text>
            </View>
            <View style={styles.requirementDetailContainer}>
              <Ionicons
                name="ellipse"
                size={8}
                color="black"
                style={styles.bulletIcon}
              />
              <Text style={styles.requirementDetail}>
                Không chụp ảnh qua màn hình khác.
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.button,
                !isImageUploaded ? styles.disabledButton : {},
              ]}
              onPress={nextStep}
              disabled={!isImageUploaded}
            >
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
            <ScrollView contentContainerStyle={styles.scrollview}>
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
                Ngày sinh (Ví dụ: 01/01/1970)
                <Text style={styles.required}> *</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={birthday}
                onChangeText={(text) => setBirthday(formatDateString(text))}
                placeholder="Nhập ngày sinh (dd/mm/yyyy)"
                keyboardType="numeric"
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

      {step === 5 && (
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

      {step === 6 && (
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
                <View style={styles.card}>
                  <View style={styles.row}>
                    <View style={styles.avatarContainer}>
                      {avatar ? (
                        <Image source={{ uri: avatar }} style={styles.avatar} />
                      ) : (
                        <Ionicons name="person" size={50} color="#ccc" />
                      )}
                    </View>
                    <View style={styles.column}>
                      <Text style={styles.infoHeadTextProfile}>{name}</Text>
                      <Text style={styles.infoLastTextProfile}>
                        {formatBirthday(birthday)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.infoRowProfile}>
                    <View style={styles.infoColumn}>
                      <Text style={styles.headText}>Số điện thoại</Text>
                      <Text style={styles.lastText}>{phoneNumber}</Text>
                    </View>
                    <View style={styles.infoColumn}>
                      <Text style={styles.headText}>Địa chỉ</Text>
                      <Text style={styles.lastText}>{address}</Text>
                    </View>
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
                <View style={styles.card}>
                  {selectedImage && (
                    <Image
                      source={{ uri: selectedImage }}
                      style={styles.imagePreviewDegree}
                    />
                  )}

                  <Text style={[styles.class, { marginBottom: 20 }]}>
                    {licenseClass}
                  </Text>

                  <View style={styles.infoRowProfile}>
                    <View style={[styles.infoColumn, { marginBottom: 30 }]}>
                      <Text style={styles.headText}>Số giấy phép</Text>

                      <Text style={styles.lastText}>{licenseNumber}</Text>
                    </View>
                    <View style={[styles.infoColumn, { marginLeft: 10 }]}>
                      <Text style={styles.headText}>Có giá trị đến</Text>
                      <Text style={styles.lastText}>Không giới hạn</Text>
                    </View>
                  </View>
                  <View style={styles.infoRowProfile}>
                    <View style={[styles.infoColumn]}>
                      <Text style={styles.headText}>Ngày cấp</Text>

                      <Text style={styles.lastText}>{issueDate}</Text>
                    </View>
                    <View style={[styles.infoColumn, { marginLeft: 10 }]}>
                      <Text style={styles.headText}>Nơi cấp</Text>
                      <Text style={styles.lastText}>{issuedBy}</Text>
                    </View>
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
              <TouchableOpacity
                style={[styles.button, isLoading && styles.disabledButton]}
                onPress={isLoading ? undefined : handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Xác nhận và Đăng ký</Text>
                )}
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
    marginTop: 20,
    marginBottom: 20,
    width: "100%",
  },
  stepTitle: {
    fontSize: 20,
    marginTop: 30,
    fontFamily: "Averta",
    textAlign: "center",
    marginBottom: 20,
    color: "#12aae2",
  },
  imageRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  sampleImage: {
    width: "45%",
    height: "100%",
    aspectRatio: 1.5,
    borderRadius: 10,
    marginBottom: 10,
  },
  sampleTitle: {
    fontSize: 18,
    fontFamily: "AvertaRegular",
    textAlign: "center",
    marginBottom: 20,
  },
  requirementContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  requirementTextTitle: {
    fontFamily: "Averta",
    fontSize: 16,
    marginLeft: 10,
  },
  requirementText: {
    fontFamily: "AvertaRegular",
    fontSize: 16,
    marginLeft: 10,
  },
  requirementDetailContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  bulletIcon: {
    marginRight: 10,
  },
  requirementDetail: {
    fontSize: 16,
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 20,
  },
  button: {
    padding: 15,
    width: "100%",
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
    backgroundColor: "#12aae2",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
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
  titleAvatar: {
    marginTop: 20,
    fontFamily: "Averta",
    textAlign: "center",
    fontSize: 17,
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
    paddingBottom: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  backButtonText: {
    marginLeft: 10,
    fontFamily: "Averta",
    fontSize: 17,
    color: "#12aae2",
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
  imageUploadContainer: {
    width: "100%",
    height: 200,
    marginTop: 30,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#f9f9f9",
  },
  imagePreviewContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  imagePreview: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  imagePreviewDegree: {
    width: "100%",
    height: 200,
    marginBottom: 20,
    borderRadius: 5,
  },
  changeImageText: {
    position: "absolute",
    bottom: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    color: "white",
    padding: 5,
    borderRadius: 5,
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
  },
  iconButton: {
    alignItems: "center",
  },
  iconText: {
    color: "#12aae2",
    fontFamily: "Averta",
    fontSize: 16,
    marginTop: 5,
  },
  separator: {
    width: 1,
    height: 50,
    backgroundColor: "#ccc",
    marginHorizontal: 20,
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
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#B2DEFF",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  column: {
    flexDirection: "column",
    marginLeft: 10,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarUpload: { width: 200, height: 200, borderRadius: 100 },
  infoHeadTextProfile: {
    fontSize: 16,
    fontFamily: "Averta",
    textAlign: "center",
    marginBottom: 10,
  },
  infoLastTextProfile: {
    fontSize: 16,
    fontFamily: "AvertaRegular",
    textAlign: "center",
    marginBottom: 10,
  },
  infoRowProfile: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  class: { fontFamily: "Averta", fontSize: 30 },
  infoColumn: {
    flex: 1,
    alignItems: "center",
  },
  headText: {
    fontSize: 16,
    fontFamily: "AvertaRegular",
    marginBottom: 5,
    textAlign: "left",
    width: "100%",
  },
  lastText: {
    fontSize: 16,
    fontFamily: "Averta",
    textAlign: "left",
    width: "100%",
  },
  cameraButton: {
    position: "absolute",
    bottom: 10,
    right: 90,
    backgroundColor: "#12aae2",
    borderRadius: 20,
    padding: 5,
  },
});
