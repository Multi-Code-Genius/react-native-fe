import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAuthStore} from '../store/authStore';
import {BASE_URL} from '@env';

export const getToken = async (key: string): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

const removeToken = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing token:', error);
  }
};

export const api = async (endpoint: string, config: any = {}) => {
  const {body, headers = {}, ...customConfig} = config;

  const accessToken = await getToken('accessToken');
  const isFormData =
    body && typeof body === 'object' && typeof body.append === 'function';

  const requestConfig: RequestInit = {
    method: config.method ?? 'GET',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Accept-Language': 'en-GB,en;q=0.9',
      ...(isFormData ? {} : {'Content-Type': 'application/json'}),
      Authorization: accessToken ? `Bearer ${accessToken}` : '',
      ...headers,
    },
    credentials: 'include',
    body: isFormData
      ? body
      : typeof body === 'string'
      ? body
      : JSON.stringify(body),
    ...customConfig,
  };

  if (requestConfig.headers) {
    const headersObj = requestConfig.headers as Record<string, string>;
    Object.keys(headersObj).forEach(key => {
      if (headersObj[key] === undefined) {
        delete headersObj[key];
      }
    });
  }

  try {
    const apiUrl = BASE_URL;
    // const apiUrl = 'http://192.168.1.17:5001';

    const response = await fetch(`${apiUrl}${endpoint}`, requestConfig);
    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({message: 'Something went wrong'}));

      const message = errorData.message || 'Something went wrong';

      if ([401, 414].includes(response.status)) {
        await removeToken('accessToken');
        await removeToken('isAuthenticated');
        useAuthStore.getState().removeToken();
      }

      throw new Error(message);
    }

    return response.headers.get('Content-Type')?.includes('application/json')
      ? response.json()
      : response;
  } catch (error: any) {
    console.log('API Error:', error?.message || error);
    throw error;
  }
};
