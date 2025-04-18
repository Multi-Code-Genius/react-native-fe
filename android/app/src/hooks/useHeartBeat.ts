import {api} from './api';

const sendPing = async () => {
  try {
    const response = await api('/api/user/ping', {
      method: 'GET',
      headers: {'Content-Type': 'application/json'},
      cache: 'no-store',
    });
    const resp = await response;
    return resp;
  } catch (err) {
    console.error('Ping error:', err);
  }
};

import {useQuery} from '@tanstack/react-query';

export function usePingOnline(isActive: boolean) {
  return useQuery({
    queryKey: ['ping-online'],
    queryFn: sendPing,
    refetchInterval: isActive ? 15000 : false,
    refetchOnWindowFocus: false,
    enabled: isActive,
  });
}
