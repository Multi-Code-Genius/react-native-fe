import {useMutation} from '@tanstack/react-query';
import {api} from '../hooks/api';

export const userInfoData = async () => {
  try {
    const response = await api(
      '/api/user',
      {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
      },
      true,
    );
    const resp = await response;
    return resp;
  } catch (error) {
    console.error('User Response:', error);
    throw new Error(error instanceof Error ? error.message : 'Data Not Found');
  }
};

export const updateUserInfo = async (data: any) => {
  try {
    const response = await api(
      '/api/user/update',
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      },
      true,
    );
    return await response;
  } catch (error) {
    console.error('Update User Error:', error);
    throw new Error(error instanceof Error ? error.message : 'Update Failed');
  }
};

export const useUpdateUserInfo = () => {
  return useMutation({
    mutationFn: updateUserInfo,
    onSuccess: data => {
      console.log('User updated:', data);
    },
    onError: error => {
      console.error('Failed to update user:', error);
    },
  });
};
