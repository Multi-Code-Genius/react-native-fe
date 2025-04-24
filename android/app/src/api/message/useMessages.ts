import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
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
  cursor: string | null;
  limit: number;
};

export const getMessages = async ({
  userId,
  withUserId,
  cursor = null,
  limit = 20,
}: GetMessagesParams) => {
  try {
    const response = await api(
      `/api/messages/messages/${userId}/${withUserId}?cursor=${
        cursor ?? ''
      }&limit=${limit}`,
      {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
        cache: 'no-store',
      },
    );
    return response ?? [];
  } catch (error) {
    console.error('getMessages error:', error);
    throw new Error('Failed to fetch messages');
  }
};

export const useChatMessages = (userId: string, withUserId: string) => {
  return useInfiniteQuery({
    queryKey: ['chatMessages', userId, withUserId],
    queryFn: ({pageParam}) =>
      getMessages({userId, withUserId, cursor: pageParam, limit: 20}),
    initialPageParam: null,
    getNextPageParam: lastPage => {
      return lastPage.length ? lastPage[0].id : undefined;
    },
  });
};

export const markAsRead = async (data: {
  userId: string;
  withUserId: string;
}) => {
  try {
    const response = await api(
      `/api/messages/mark-as-read/${data.userId}/${data.withUserId}`,
      {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
      },
    );
    const resp = await response;
    return resp;
  } catch (error) {
    console.error('message Error:', error);
    throw new Error(error instanceof Error ? error.message : 'message failed');
  }
};

export const useMarkAsRead = (
  _onSuccess?: (response: any) => void,
  _onError?: (error: any) => void,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['profile']});
      queryClient.invalidateQueries({queryKey: ['chatMessages']});
    },
    onError: () => {
      console.log('markAsRead error');
    },
  });
};
