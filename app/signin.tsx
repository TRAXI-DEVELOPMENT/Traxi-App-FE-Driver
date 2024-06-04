import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, ScrollView, ImageBackground, KeyboardAvoidingView, Platform } from 'react-native';

export default function Signin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <ImageBackground
      source={require('../assets/images/bg_login.png')}
      style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}>
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          <View style={styles.inputContainer}>
            {/* <EvilIcons name="user" style={styles.icon} /> */}
            <TextInput
              style={styles.input}
              placeholder="Tên đăng nhập"
              value={username}
              onChangeText={setUsername}
            />
          </View>
          <View style={styles.inputContainer}>
            {/* <EvilIcons name="lock" style={styles.icon} /> */}
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
            <TouchableOpacity>
              <Text style={styles.registerText}>Đăng kí</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.footer}>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Đăng nhập</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  keyboardAvoidingView: {
    flex: 1,
    width: '100%',
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  icon: {
    fontSize: 40,
    color: '#12aae2',
    marginBottom: -12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
  },
  input: {
    fontSize:17,
    flex: 1,
    fontFamily: 'Averta',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 15,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#12aae2',
  },
  footer: {
    width: '100%',
    padding: 20,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 100,
  },
  newDriverTextContainer: {
    marginTop:10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  newDriverText: {
    color: 'black',
    fontFamily: 'Averta',
    fontSize: 16,
  },
  registerText: {
    color: '#12aae2',
    fontFamily: 'Averta',
    fontSize: 16,
    marginLeft: 5,
  },
  button: {
    padding: 15,
    width: '80%',
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    backgroundColor: '#12aae2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
