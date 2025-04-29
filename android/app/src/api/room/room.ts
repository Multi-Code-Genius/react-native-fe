import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {api} from '../../hooks/api';

export const requestRoom = async () => {
  try {
    const response = await api('/api/room/find-or-create', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      cache: 'no-store',
    });
    const resp = await response;
    return resp;
  } catch (error) {
    console.error('Room Response:', error);
    throw new Error(error instanceof Error ? error.message : 'Data Not Found');
  }
};

export const useRequestRoom = () => {
  return useMutation({
    mutationKey: ['room'],
    mutationFn: requestRoom,
    onSuccess: () => {},
  });
};

export const rejectRoom = async (id: string) => {
  try {
    const response = await api(`/api/room/reject/${id}`, {
      method: 'GET',
      headers: {'Content-Type': 'application/json'},
      cache: 'no-store',
    });
    const resp = await response;
    return resp;
  } catch (error) {
    console.error('Room Response:', error);
    throw new Error(error instanceof Error ? error.message : 'Data Not Found');
  }
};

export const useRejectRoom = () => {
  return useMutation({
    mutationKey: ['rejectRoom'],
    mutationFn: (id: string) => rejectRoom(id),
    onSuccess: () => {},
  });
};

export const getRooms = async () => {
  try {
    const response = await api('/api/room', {
      method: 'GET',
      headers: {'Content-Type': 'application/json'},
      cache: 'no-store',
    });
    const resp = await response;
    return resp;
  } catch (error) {
    console.error('Room Response:', error);
    throw new Error(error instanceof Error ? error.message : 'Data Not Found');
  }
};

export const useGetRooms = () => {
  return useQuery({
    queryKey: ['getRooms'],
    queryFn: getRooms,
    refetchInterval: 5000,
    refetchOnWindowFocus: false,
    enabled: true,
  });
};

export const joinRoom = async (id: string) => {
  try {
    const response = await api(`/api/room/join/${id}`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      cache: 'no-store',
    });
    const resp = await response;
    return resp;
  } catch (error) {
    console.error('Room Response:', error);
    throw new Error(error instanceof Error ? error.message : 'Data Not Found');
  }
};

export const useJoinRoom = () => {
  const querlyClient = useQueryClient();
  return useMutation({
    mutationKey: ['joinRoom'],
    mutationFn: (id: string) => joinRoom(id),
    onSuccess: () => {
      querlyClient.invalidateQueries({queryKey: ['profile']});
    },
  });
};

export const getRoomById = async (id: string) => {
  try {
    const response = await api(`/api/room/fetch/${id}`, {
      method: 'GET',
      headers: {'Content-Type': 'application/json'},
      cache: 'no-store',
    });
    return response;
  } catch (error) {
    console.error('Room Response:', error);
    throw new Error(error instanceof Error ? error.message : 'Data Not Found');
  }
};

export const useGetRoomById = (id: string) => {
  return useQuery({
    queryKey: ['getRoomById', id],
    queryFn: () => getRoomById(id),
    refetchInterval: id ? 5000 : false,
    refetchOnWindowFocus: false,
    enabled: !!id,
  });
};
