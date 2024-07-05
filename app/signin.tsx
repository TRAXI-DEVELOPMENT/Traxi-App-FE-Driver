import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import useAuth from "@/hooks/useAuth";
import { Redirect } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import Dialog from "@/components/Dialog"; // Import Dialog component

interface AxiosError extends Error {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export default function Signin() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const [redirectToSignup, setRedirectToSignup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogType, setDialogType] = useState<"success" | "error">("success");
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogMessage, setDialogMessage] = useState("");

  const handleLogin = async () => {
    if (!phone && !password) {
      setDialogTitle("Lỗi");
      setDialogMessage("Vui lòng điền số điện thoại và mật khẩu.");
      setDialogType("error");
      setDialogVisible(true);
      return;
    } else if (!phone) {
      setDialogTitle("Lỗi");
      setDialogMessage("Vui lòng điền số điện thoại.");
      setDialogType("error");
      setDialogVisible(true);
      return;
    } else if (!password) {
      setDialogTitle("Lỗi");
      setDialogMessage("Vui lòng điền mật khẩu.");
      setDialogType("error");
      setDialogVisible(true);
      return;
    }

    setIsLoading(true);
    try {
      await login(phone, password);
      setDialogTitle("Đăng nhập thành công");
      setDialogMessage("Token: ");
      setDialogType("success");
      setDialogVisible(true);
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorMessage =
        axiosError.response?.data?.message || axiosError.message;
      if (axiosError.response?.data?.message === "Đã có bằng lái loại B4") {
        setDialogTitle("Lỗi");
        setDialogMessage("Tải lên bằng lái bị trùng.");
        setDialogType("error");
        setDialogVisible(true);
      } else {
        setDialogTitle("Lỗi đăng nhập");
        setDialogMessage(errorMessage);
        setDialogType("error");
        setDialogVisible(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoading) {
      SplashScreen.preventAutoHideAsync();
    } else {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  if (redirectToSignup) {
    return <Redirect href="/signup" />;
  }

  return (
    <ImageBackground
      source={require("../assets/images/bg_login.png")}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Số điện thoại"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Mật khẩu"
              value={password}
              secureTextEntry
              onChangeText={setPassword}
            />
          </View>
          <View style={styles.newDriverTextContainer}>
            <Text style={styles.newDriverText}>Bạn là tài xế mới?</Text>
            <TouchableOpacity onPress={() => setRedirectToSignup(true)}>
              <Text style={styles.registerText}>Đăng kí</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.button, isLoading && styles.disabledButton]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Đăng nhập</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <Dialog
        visible={dialogVisible}
        onClose={() => setDialogVisible(false)}
        title={dialogTitle}
        message={dialogMessage}
        type={dialogType}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "white",
  },
  keyboardAvoidingView: {
    flex: 1,
    width: "100%",
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
  },
  input: {
    fontSize: 17,
    flex: 1,
    fontFamily: "Averta",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    padding: 15,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#12aae2",
  },
  footer: {
    width: "100%",
    padding: 20,
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 30,
    marginTop: 100,
  },
  newDriverTextContainer: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  newDriverText: {
    color: "black",
    fontFamily: "Averta",
    fontSize: 16,
  },
  registerText: {
    color: "#12aae2",
    fontFamily: "Averta",
    fontSize: 16,
    marginLeft: 5,
  },
  button: {
    padding: 15,
    width: "80%",
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    backgroundColor: "#12aae2",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});
