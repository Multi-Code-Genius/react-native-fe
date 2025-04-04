import {useMutation} from '@tanstack/react-query';
import {api} from '../../hooks/api';
import {
  LoginError,
  LoginParams,
  LoginResponse,
  SignupParams,
  SignupResponse,
} from '../../types/auth';

export const userLogin = async (data: LoginParams): Promise<LoginResponse> => {
  console.log('data', data);
  try {
    const response = await api(
      '/auth/login',
      {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
      },
      true,
    );

    return await response;
  } catch (error) {
    console.error('Login Error:', error);
    throw new Error(error instanceof Error ? error.message : 'Login failed');
  }
};

export const useUserLogin = (
  onSuccess?: (response: LoginResponse) => void,
  onError?: (error: LoginError) => void,
) => {
  return useMutation<LoginResponse, LoginError, LoginParams>({
    mutationFn: userLogin,
    onSuccess,
    onError,
  });
};

export const userSignup = async (
  data: SignupParams,
): Promise<SignupResponse> => {
  console.log('data', data);
  try {
    const response = await api(
      '/auth/register',
      {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
      },
      true,
    );

    return await response;
  } catch (error) {
    console.error('Login Error:', error);
    throw new Error(error instanceof Error ? error.message : 'Login failed');
  }
};

export const useUserSignup = (
  onSuccess?: (response: SignupResponse) => void,
  onError?: (error: LoginError) => void,
) => {
  return useMutation<SignupResponse, LoginError, SignupParams>({
    mutationFn: userSignup,
    onSuccess,
    onError,
  });
};
