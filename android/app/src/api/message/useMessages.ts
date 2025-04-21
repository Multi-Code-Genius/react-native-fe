import {useMutation, useQuery} from '@tanstack/react-query';
import {api} from '../../hooks/api';

export const fetchMessages = async (data: any) => {
  try {
    const response = await api('/api/messages', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data),
    });
    const resp = await response;
    return resp;
  } catch (error) {
    console.error('message Error:', error);
    throw new Error(error instanceof Error ? error.message : 'message failed');
  }
};

export const useMessages = (
  onSuccess?: (response: any) => void,
  onError?: (error: any) => void,
) => {
  return useMutation({
    mutationFn: fetchMessages,
    onSuccess,
    onError,
  });
};

type GetMessagesParams = {
  userId: string;
  withUserId: string;
};

export const getMessages = async ({userId, withUserId}: GetMessagesParams) => {
  try {
    const response = await api(
      `/api/messages/messages/${userId}/${withUserId}`,
      {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
      },
    );

    return response ?? [];
  } catch (error) {
    console.error('GetMessages Error:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Fetching messages failed',
    );
  }
};

export const useGetMessages = (
  params: GetMessagesParams,
  _onSuccess?: (data: any) => void,
  _onError?: (error: any) => void,
) => {
  return useQuery({
    queryKey: ['messages', params.userId, params.withUserId],
    queryFn: () => getMessages(params),
  });
};
