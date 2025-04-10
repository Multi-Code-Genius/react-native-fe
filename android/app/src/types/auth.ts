export interface LoginParams {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface LoginError {
  message: string;
}

export interface SignupParams {
  email: string;
  password: string;
  name: string;
}

export interface SignupResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface LoginError {
  message: string;
}

export interface ResetPasswordParams {
  token: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export type RootStackParamList = {
  SignUp: undefined;
  Login: undefined;
  ResetPassword: undefined;
  ResetPassword2: undefined;
  Home: undefined;
};

export interface ResetPasswordLinkParams {
  email: string;
}

export interface ResetPasswordLinkResponse {
  message: string;
}

export type AuthState = {
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  saveToken: (token: string) => Promise<void>;
  initializeAuth: () => Promise<void>;
  removeToken: () => void;
};

export interface UserType {}

export interface UserState {
  userData: UserType | null;
  setUserData: (data: UserType) => void;
  loadUserData: () => Promise<void>;
  clearUserData: () => void;
}
