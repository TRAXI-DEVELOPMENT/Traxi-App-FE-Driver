import { EvilIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from "react-native";

export default function Signup() {
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [temporaryAddress, setTemporaryAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const nextStep = () => {
    if (step < 5) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <View style={styles.container}>
      {step > 1 && (
        <TouchableOpacity style={styles.backButton} onPress={prevStep}>
          <EvilIcons name="arrow-left" size={40} color="#12aae2" />
        </TouchableOpacity>
      )}
      {step === 1 && (
        <ImageBackground
          source={require("../assets/images/bg_register.png")}
          style={styles.bgContainer}
        >
          <View style={styles.stepContainer}>
            <Text style={styles.label}>Nhập số điện thoại:</Text>
            <TextInput
              style={styles.input}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
            <TouchableOpacity style={styles.button} onPress={nextStep}>
              <Text style={styles.buttonText}>Tiếp tục</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      )}

      {step === 2 && (
        <ImageBackground
          source={require("../assets/images/bg_register.png")}
          style={styles.bgContainer}
        >
          <View style={styles.stepContainer}>
            <Text style={styles.label}>Tên:</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
            />
            <Text style={styles.label}>Địa chỉ:</Text>
            <TextInput
              style={styles.input}
              value={address}
              onChangeText={setAddress}
            />
            <Text style={styles.label}>Địa chỉ tạm trú:</Text>
            <TextInput
              style={styles.input}
              value={temporaryAddress}
              onChangeText={setTemporaryAddress}
            />
            <TouchableOpacity style={styles.button} onPress={nextStep}>
              <Text style={styles.buttonText}>Tiếp tục</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      )}

      {step === 3 && (
        <ImageBackground
          source={require("../assets/images/bg_register.png")}
          style={styles.bgContainer}
        >
          <View style={styles.stepContainer}>
            <Text style={styles.label}>
              Chụp hình giấy tờ xe (mặt trước và mặt sau):
            </Text>
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
            <Text style={styles.label}>Chụp hình mặt người đăng ký:</Text>
            <TouchableOpacity style={styles.button} onPress={nextStep}>
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
            <TouchableOpacity style={styles.button} onPress={() => {}}>
              <Text style={styles.buttonText}>Hoàn tất</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start", // Thay đổi từ 'center' thành 'flex-start' để đưa các ô nhập lên trên
    padding: 20,
    backgroundColor: "#e1fffe", // Thay đổi màu nền thành trắng
  },
  stepContainer: {
    width: "100%",
    marginBottom: 20,
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
    borderRadius: 20,
    borderColor: "#12aae2",
    borderWidth: 1,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
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
});
