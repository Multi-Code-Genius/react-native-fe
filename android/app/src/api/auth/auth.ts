import {useMutation} from '@tanstack/react-query';
import {api} from '../../hooks/api';
import {
  LoginError,
  LoginParams,
  LoginResponse,
  ResetPasswordParams,
  ResetPasswordResponse,
  SignupParams,
  SignupResponse,
} from '../../types/auth';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from 'react-native-screens/lib/typescript/native-stack/types';
import {AuthStackParamList} from '../../types/navigation';

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

export const resetPassword = async (
  data: ResetPasswordParams,
): Promise<ResetPasswordResponse> => {
  try {
    const response = await api(
      'api/auth/new-password',
      {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
      },
      true,
    );

    return await response;
  } catch (error) {
    console.error(' Password Reset Error:', error);
    throw new Error(error instanceof Error ? error.message : 'Login failed');
  }
};

export const useResetPassword = (
  _onSuccess?: (response: ResetPasswordResponse) => void,
  onError?: (error: unknown) => void,
) => {
  // const queryClient = useQueryClient();
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  return useMutation<ResetPasswordResponse, unknown, ResetPasswordParams>({
    mutationFn: resetPassword,
    onSuccess: res => {
      console.log('res----------->', res);
      // queryClient.invalidateQueries({queryKey: ['todos']});
      navigation.navigate('Login');
    },
    onError,
  });
};
