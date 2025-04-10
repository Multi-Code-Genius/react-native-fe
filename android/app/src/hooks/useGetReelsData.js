import {useQuery} from '@tanstack/react-query';
import {getReels} from '../api/reels/api';

export const useGetReelsData = height => {
  const {data, isLoading, error, refetch} = useQuery({
    queryKey: ['getReels', height],
    queryFn: async () => {
      return getReels(height);
    },
    enabled: !!height,
    retry: false,
  });

  return {reels: data, isLoading, error, refetch};
};
