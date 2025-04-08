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
