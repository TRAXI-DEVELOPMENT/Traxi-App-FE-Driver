import React, {
  createContext,
  useEffect,
  useReducer,
  useMemo,
  useCallback,
} from "react";
import axios from "axios";
import { API_ROOT } from "@/utils/constants";
import { jwtDecode } from "jwt-decode";
import { getUserInfo, setUserInfo } from "@/utils/utils";
import { isValidToken, setSession } from "@/utils/jwt";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

interface CustomJwtPayload {
  Id: string;
  Name: string;
  Role: string;
  Status: string;
  iat: number;
  exp: number;
}

enum Types {
  LOGIN = "LOGIN",
  LOGOUT = "LOGOUT",
  INITIALIZE = "INITIALIZE",
}

interface State {
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: any;
  role: string | null;
}

type Action =
  | { type: Types.LOGIN | Types.INITIALIZE; payload: { user: any } }
  | { type: Types.LOGOUT };

const initialState: State = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
  role: null,
};

const JWTReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case Types.INITIALIZE:
    case Types.LOGIN:
      return {
        ...state,
        isAuthenticated: true,
        isInitialized: true,
        user: action.payload.user,
        role: action.payload.user?.Role,
      };
    case Types.LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        role: null,
      };
    default:
      return state;
  }
};

const AuthContext = createContext<{ [key: string]: any } | null>(null);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(JWTReducer, initialState);
  const router = useRouter();

  const initialize = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userRaw = await getUserInfo();
      if (token && isValidToken(token) && userRaw) {
        setSession(token);

        const user = JSON.parse(userRaw);

        dispatch({
          type: Types.INITIALIZE,
          payload: {
            user,
          },
        });
      } else {
        dispatch({
          type: Types.INITIALIZE,
          payload: {
            user: null,
          },
        });
      }
    } catch (err) {
      // console.error(err);
      dispatch({
        type: Types.INITIALIZE,
        payload: {
          user: null,
        },
      });
    }
  };

  useEffect(() => {
    initialize();
  }, []);

  const login = useCallback(async (phone: string, password: string) => {
    try {
      const response = await axios.post(`${API_ROOT}/login/driver`, {
        phone,
        password,
      });

      const { token } = response.data;
      const decodedToken = jwtDecode<CustomJwtPayload>(token);

      const user = {
        id: decodedToken.Id,
        name: decodedToken.Name,
        role: decodedToken.Role,
        status: decodedToken.Status,
        iat: decodedToken.iat,
        exp: decodedToken.exp,
      };
      setSession(token);
      setUserInfo(user);
      // Updates.reloadAsync();
      router.replace("/");
      dispatch({
        type: Types.LOGIN,
        payload: {
          user,
        },
      });
    } catch (err) {
      // console.error(err);
      const error = err as { response: { data: { message: string } } };
      throw new Error(error.response.data.message || "Đăng nhập thất bại.");
    }
  }, []);

  const logout = useCallback(() => {
    setSession(null);
    dispatch({ type: Types.LOGOUT });
    AsyncStorage.removeItem("USER_INFO").then(() => {
      router.replace("signin");
    });
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      method: "jwt",
      login,
      logout,
    }),
    [state, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthContext, AuthProvider };
