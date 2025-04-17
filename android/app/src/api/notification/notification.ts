import {useMutation} from '@tanstack/react-query';
import {api} from '../../hooks/api';

export const sendTokenToBackend = async (data: any) => {
  try {
    const response = await api('/api/notification/save-token', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data),
    });
    const resp = await response;
    return resp;
  } catch (error) {
    console.error('Notification Error:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Notification failed',
    );
  }
};

export const useSendTokenToBackend = (
  onSuccess?: (response: any) => void,
  onError?: (error: any) => void,
) => {
  return useMutation({
    mutationFn: sendTokenToBackend,
    onSuccess,
    onError,
  });
};
