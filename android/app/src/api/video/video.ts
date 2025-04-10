import {useQuery} from '@tanstack/react-query';
import {api} from '../../hooks/api';

export const fetchVideos = async () => {
  try {
    const response = await api('/api/video', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });
    return await response;
  } catch (error) {
    console.error('Get Video Error:', error);
    throw new Error(error instanceof Error ? error.message : 'Video Failed');
  }
};

export const useFetchVideos = () => {
  return useQuery({
    queryKey: ['videos'],
    queryFn: fetchVideos,
    retry: false,
  });
};
