import React, { useContext } from "react";
import { ILoginData, IRegisterData, IUserData, IAuthResponse } from "interface/userProfile";
import { axiosInstance } from "utils/axiosInstance";
import { AxiosError } from "axios";

interface AuthContextInterface {
  user: IUserData | null;
  setUser: React.Dispatch<React.SetStateAction<IUserData | null>>;
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  login: (loginData: ILoginData) => Promise<IAuthResponse>;
  logout: () => Promise<IAuthResponse>;
  register: (registerData: IRegisterData) => Promise<IAuthResponse>;
  detect401: (e: unknown) => Promise<void>;
}

export const AuthContext = React.createContext<AuthContextInterface | undefined>(undefined);
export const useAuth = (): AuthContextInterface => {
  const tempHookHolder = useContext(AuthContext);
  if (!tempHookHolder) {
    throw new Error("AuthContext.Provider is not properly set up");
  }
  return tempHookHolder;
};

export function AuthProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [user, setUser] = React.useState<IUserData | null>(null);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  async function loginRegisterFetchApi(isLogin: boolean, reqBody: ILoginData | IRegisterData): Promise<IAuthResponse> {
    const reqRoute = isLogin ? "/users/login" : "/users";
    try {
        const response = await axiosInstance.post(reqRoute, {user: reqBody});
        window.localStorage.setItem("token", response.data.user.token);
        setIsLoggedIn(true);
        setUser(response.data.user);
        return {
            userData: response.data.user
        }
    } catch (e) {
        setIsLoggedIn(false);
        setUser(null);
        return {
            userData: null,
            fullResponse: e
        }
    }
  }

  async function login(loginData: ILoginData): Promise<IAuthResponse> {
    return await loginRegisterFetchApi(true, loginData)
  }

  async function register(registerData: IRegisterData): Promise<IAuthResponse> {
    return await loginRegisterFetchApi(false, registerData)
  }

  async function logout(): Promise<IAuthResponse> {
    window.localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUser(null);
    return {
      userData: null
    };
  }

  async function detect401(e: unknown): Promise<void> {
    if (e instanceof AxiosError && e.response?.status === 401) {
      console.log("401 detected, logging out...")
      logout();
    }
  }

  const providerValue: AuthContextInterface = {
    user,
    setUser,
    isLoggedIn,
    setIsLoggedIn,
    login,
    logout,
    register,
    detect401
  };

  return <AuthContext.Provider value={providerValue}>{children}</AuthContext.Provider>;
}
