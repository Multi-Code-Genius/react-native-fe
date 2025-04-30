import {useQuery} from '@tanstack/react-query';
import {api} from '../../hooks/api';

export const fetchGames = async () => {
  try {
    const response = await api('/api/game', {
      method: 'GET',
      headers: {'Content-Type': 'application/json'},
      cache: 'no-store',
    });
    const resp = await response;
    return resp;
  } catch (error) {
    console.error('message Error:', error);
    throw new Error(error instanceof Error ? error.message : 'message failed');
  }
};

export const useGames = () => {
  return useQuery({
    queryKey: ['games'],
    queryFn: fetchGames,
  });
};
