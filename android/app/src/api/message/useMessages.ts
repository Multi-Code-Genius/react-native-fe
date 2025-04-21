import {useInfiniteQuery, useMutation, useQuery} from '@tanstack/react-query';
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
  cursor: null;
};

export const getMessages = async ({
  userId,
  withUserId,
  cursor = null,
}: GetMessagesParams) => {
  try {
    const response = await api(
      `/api/messages/messages/${userId}/${withUserId}`,
      {
        params: {cursor, limit: 20},
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

export const useChatMessages = (userId: string, withUserId: string) => {
  return useInfiniteQuery({
    queryKey: ['chatMessages', userId, withUserId],
    queryFn: ({pageParam}) =>
      getMessages({userId, withUserId, cursor: pageParam}),
    initialPageParam: null,
    getNextPageParam: lastPage => {
      if (lastPage.length === 0) {
        return undefined;
      }
      return lastPage[lastPage.length - 1].id;
    },
  });
};
