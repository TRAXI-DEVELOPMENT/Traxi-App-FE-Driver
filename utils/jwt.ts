import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

// ----------------------------------------------------------------------

const isValidToken = (token: string) => {
  if (!token) {
    return false;
  }
  const decoded = jwtDecode<{ exp: number }>(token);
  const currentTime = Date.now() / 1000;

  return decoded.exp > currentTime;
};


const setSession = (token: string | null) => {
  if (token) {
    AsyncStorage.setItem('token', token);
  } else {
    AsyncStorage.removeItem('token');
  }
};

export { isValidToken, setSession };
