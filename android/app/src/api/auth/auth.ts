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
  try {
    const response = await api(
      'api/auth/login',
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
  try {
    const response = await api(
      'api/auth/signup',
      {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
      },
      true,
    );
    const resp = await response;

    return resp;
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
    onMutate: () => {
      console.log('Mutation started ✅');
    },
    onSuccess,
    onError,
    onSettled: () => {
      console.log('Mutation finished ⏹️');
    },
  });
};
