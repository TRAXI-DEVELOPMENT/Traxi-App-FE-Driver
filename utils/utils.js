import AsyncStorage from "@react-native-async-storage/async-storage";

export const setAsyncStorage = (name, value) => {
  AsyncStorage.setItem(name, value);
};

export const getAsyncStorage = (name) => {
  return AsyncStorage.getItem(name);
};

export const removeAsyncStorage = (key) => {
  AsyncStorage.removeItem(key);
};

export const removeUserInfo = () => {
  removeAsyncStorage("USER_INFO");
};

export const setUserInfo = (userInfo) => {
  setAsyncStorage("USER_INFO", JSON.stringify(userInfo));
};

export const getUserInfo = () => {
  return getAsyncStorage("USER_INFO");
};
