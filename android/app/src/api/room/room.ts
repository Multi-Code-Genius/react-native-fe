import {useMutation, useQuery} from '@tanstack/react-query';
import {api} from '../../hooks/api';

export const requestRoom = async (data: any) => {
  try {
    const response = await api('/api/room/find-or-create', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      cache: 'no-store',
      body: JSON.stringify(data),
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
    mutationFn: (data: any) => requestRoom(data),
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
    queryKey: ['rejectRoom'],
    queryFn: getRooms,
    enabled: true,
  });
};
