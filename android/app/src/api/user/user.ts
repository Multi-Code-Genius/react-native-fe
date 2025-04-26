import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {api} from '../../hooks/api';
import {useAuthStore} from '../../store/authStore';

export const userInfoData = async () => {
  try {
    const response = await api('/api/user', {
      method: 'GET',
      headers: {'Content-Type': 'application/json'},
      cache: 'no-store',
    });
    const resp = await response;
    return resp;
  } catch (error) {
    console.error('User Response:', error);
    throw new Error(error instanceof Error ? error.message : 'Data Not Found');
  }
};

export const useUserInfo = () => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  return useQuery({
    queryKey: ['profile'],
    queryFn: userInfoData,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    retry: 0,
    enabled: isAuthenticated,
  });
};

export const getAllUser = async () => {
  try {
    const response = await api('/api/user/all-user', {
      method: 'GET',
      headers: {'Content-Type': 'application/json'},
    });
    const resp = await response;
    return resp;
  } catch (error) {
    console.error('User Response:', error);
    throw new Error(error instanceof Error ? error.message : 'Data Not Found');
  }
};

export const useGetAllUser = () => {
  return useQuery({
    queryKey: ['all-user'],
    queryFn: getAllUser,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    retry: 0,
    enabled: useAuthStore.getState().isAuthenticated,
  });
};

export const updateUserInfo = async (data: any) => {
  try {
    const response = await api('/api/user/update', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return await response;
  } catch (error) {
    console.error('Update User Error:', error);
    throw new Error(error instanceof Error ? error.message : 'Update Failed');
  }
};

export const useUpdateUserInfo = () => {
  return useMutation({
    mutationFn: updateUserInfo,
    onSuccess: data => {
      console.log('User updated:', data);
    },
    onError: error => {
      console.error('Failed to update user:', error);
    },
  });
};

export const uploadVideo = async (data: FormData) => {
  try {
    const response = await api('/api/video/upload-video', {
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error) {
    console.error('Cannot upload video', error);
    throw new Error(error instanceof Error ? error.message : 'Upload failed');
  }
};

export const useUploadVideos = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadVideo,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['profile']});
    },
    onError: error => {
      console.error(' Failed to upload video:', error);
    },
  });
};

export const getUserById = async (id: string) => {
  try {
    const response = await api(`/api/user/user-data/${id}`, {
      method: 'GET',
      headers: {'Content-Type': 'application/json'},
      cache: 'no-store',
    });
    const resp = await response;
    return resp;
  } catch (error) {
    console.error('User Response:', error);
    throw new Error(error instanceof Error ? error.message : 'Data Not Found');
  }
};

export const useUserByIdMutation = () => {
  return useMutation({
    mutationKey: ['userById'],
    mutationFn: (id: string) => getUserById(id),
  });
};

export const updateLocation = async (location: any) => {
  try {
    console.log(
      'trigger879999999999999999999999999999999999999999999999999999999999999999',
    );
    const response = await api('/api/user/locations', {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      cache: 'no-store',
      body: JSON.stringify(location),
    });
    const resp = await response;
    return resp;
  } catch (error) {
    console.error('User Response:', error);
    throw new Error(error instanceof Error ? error.message : 'Data Not Found');
  }
};

export const useUpdateLocation = () => {
  return useMutation({
    mutationKey: ['updateLocations'],
    mutationFn: (locations: any) => getUserById(locations),
  });
};

export const getAllLocations = async (location: any) => {
  try {
    const response = await api('/api/room/location', {
      method: 'GET',
      headers: {'Content-Type': 'application/json'},
      cache: 'no-store',
      body: JSON.stringify(location),
    });
    const resp = await response;
    return resp;
  } catch (error) {
    console.error('User Response:', error);
    throw new Error(error instanceof Error ? error.message : 'Data Not Found');
  }
};

export const useGetAllLocations = () => {
  return useQuery({
    queryKey: ['updateLocations'],
    queryFn: getAllLocations,
  });
};
