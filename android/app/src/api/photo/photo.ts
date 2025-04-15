import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {api} from '../../hooks/api';

export const getAllPosts = async () => {
  try {
    const response = await api('api/post', {
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

export const useFetchPostPhotos = () => {
  return useQuery({
    queryKey: ['photos'],
    queryFn: getAllPosts,
    retry: false,
  });
};

export const uploadPhoto = async (data: FormData) => {
  try {
    const response = await api('/api/post/upload-post', {
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('response=============>', response);
    return response;
  } catch (error) {
    console.error('Cannot upload video', error);
    throw new Error(error instanceof Error ? error.message : 'Upload failed');
  }
};

export const useUploadPhoto = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: uploadPhoto,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['profile']});
    },
    onError: error => {
      console.error('Failed to upload photo:', error);
    },
  });
};
