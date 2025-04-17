import {useMutation, useQueryClient} from '@tanstack/react-query';
import {api} from '../../hooks/api';

export const sendRequest = async (data: any) => {
  try {
    const response = await api('/api/request/friend-request', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      cache: 'no-store',
      body: JSON.stringify(data),
    });
    const resp = await response;
    return resp;
  } catch (error) {
    console.error('Request Response:', error);
    throw new Error(error instanceof Error ? error.message : 'Data Not Found');
  }
};

export const useSendRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => sendRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['all-user']});
    },
  });
};

export const acceptRequest = async (id: string) => {
  try {
    const response = await api(`/api/request/friend-request/${id}/accept`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      cache: 'no-store',
    });
    const resp = await response;
    return resp;
  } catch (error) {
    console.error('Request Response:', error);
    throw new Error(error instanceof Error ? error.message : 'Data Not Found');
  }
};

export const useAcceptRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => acceptRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['profile']});
    },
  });
};

export const declineRequest = async (id: string) => {
  try {
    const response = await api(`/api/request/friend-request/${id}/decline`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      cache: 'no-store',
    });
    const resp = await response;
    return resp;
  } catch (error) {
    console.error('Request Response:', error);
    throw new Error(error instanceof Error ? error.message : 'Data Not Found');
  }
};

export const useDeclineRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => declineRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['profile']});
    },
  });
};
