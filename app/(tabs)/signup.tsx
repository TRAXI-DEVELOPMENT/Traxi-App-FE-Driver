import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default function Signup() {
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [temporaryAddress, setTemporaryAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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
      {step === 1 && (
        <View style={styles.stepContainer}>
          <Text style={styles.label}>Nhập số điện thoại:</Text>
          <TextInput style={styles.input} value={phoneNumber} onChangeText={setPhoneNumber} />
          <Button title="Tiếp theo" onPress={nextStep} />
        </View>
      )}
      {step === 2 && (
        <View style={styles.stepContainer}>
          <Text style={styles.label}>Tên:</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} />
          <Text style={styles.label}>Địa chỉ:</Text>
          <TextInput style={styles.input} value={address} onChangeText={setAddress} />
          <Text style={styles.label}>Địa chỉ tạm trú:</Text>
          <TextInput style={styles.input} value={temporaryAddress} onChangeText={setTemporaryAddress} />
          <Button title="Quay lại" onPress={prevStep} />
          <Button title="Tiếp theo" onPress={nextStep} />
        </View>
      )}
      {step === 3 && (
        <View style={styles.stepContainer}>
          <Text style={styles.label}>Chụp hình giấy tờ xe (mặt trước và mặt sau):</Text>
          <Button title="Quay lại" onPress={prevStep} />
          <Button title="Tiếp theo" onPress={nextStep} />
        </View>
      )}
      {step === 4 && (
        <View style={styles.stepContainer}>
          <Text style={styles.label}>Chụp hình mặt người đăng ký:</Text>
          <Button title="Quay lại" onPress={prevStep} />
          <Button title="Tiếp theo" onPress={nextStep} />
        </View>
      )}
      {step === 5 && (
        <View style={styles.stepContainer}>
          <Text style={styles.label}>Tạo mật khẩu:</Text>
          <TextInput secureTextEntry={true} style={styles.input} value={password} onChangeText={setPassword} />
          <Text style={styles.label}>Xác nhận mật khẩu:</Text>
          <TextInput secureTextEntry={true} style={styles.input} value={confirmPassword} onChangeText={setConfirmPassword} />
          <Button title="Quay lại" onPress={prevStep} />
          <Button title="Hoàn tất" onPress={() => {/* Xử lý đăng ký */}} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  stepContainer: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    justifyContent: 'flex-start',
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 15,
    marginBottom: 10,
    borderRadius: 50,
    borderColor: '#12aae2', // Thêm màu viền
    borderWidth: 2, // Độ dày của viền
  },
});