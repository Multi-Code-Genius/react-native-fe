import {useQuery} from '@tanstack/react-query';
import {getAllUser} from '../api/user/user';

export const useGetAllUser = () => {
  const {data, isLoading, error, refetch} = useQuery({
    queryKey: ['getUsers'],
    queryFn: async () => {
      return getAllUser();
    },
  });

  return {users: data, isLoading, error, refetch};
};
