import {useMutation} from '@tanstack/react-query';
import {api} from '../../hooks/api';

export const bookingGame = async (data: any) => {
  try {
    const response = await api('/api/booking/create', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      cache: 'no-store',
      body: JSON.stringify(data),
    });
    const resp = await response;
    return resp;
  } catch (error) {
    console.error('message Error:', error);
    throw new Error(error instanceof Error ? error.message : 'message failed');
  }
};
export const useBookingGames = (
  onSuccess?: (response: any) => void,
  onError?: (error: any) => void,
) => {
  return useMutation({
    mutationFn: (data: any) => bookingGame(data),
    onSuccess,
    onError,
  });
};
