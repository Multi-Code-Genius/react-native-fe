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
